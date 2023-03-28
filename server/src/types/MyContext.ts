import { Request, Response } from "express"
import { TokenType } from "../entity"

export interface JwtPayload {
  type: TokenType
  userId: number
  email: string
  tokenVersion: number
}

export interface MyContext {
  req: Request
  res: Response
  payload: JwtPayload
}
