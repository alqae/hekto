import { Response } from "express"
import { sign } from "jsonwebtoken"

import { AppDataSource } from "../data-source"

import { User, TokenType, Token } from "../entity"

export const createAccessToken = async (user: User): Promise<string> => {
  return sign(
    {
      type: TokenType.ACCESS,
      userId: user.id,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  )
}

export const createRefreshToken = async (user: User): Promise<string> => {
  return sign(
    {
      type: TokenType.REFRESH,
      userId: user.id,
      tokenVersion: user.tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  )
}

export const sendRefreshToken = (res: Response, token: string) => {
  return res.cookie("jid", token, { httpOnly: true })
}

export const createRecoveryPasswordToken = async (user: User): Promise<Token> => {
  const value = sign(
    {
      type: TokenType.RECOVERY_PASSWORD,
      userId: user.id,
      email: user.email,
    },
    process.env.RECOVERY_PASSWORD_TOKEN_SECRET!,
    {
      expiresIn: "2h",
    }
  )

  return Token
    .create({ value, type: TokenType.RECOVERY_PASSWORD, isActive: true })
    .save()
}

export const createInvitationToken = async (email: string): Promise<Token> => {
  const value = sign(
    {
      type: TokenType.INVITATION,
      email,
    },
    process.env.INVITATION_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  )

  return await AppDataSource
    .getRepository(Token)
    .create({ value, type: TokenType.INVITATION, isActive: true })
    .save()
}
