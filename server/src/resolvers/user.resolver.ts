import { compare, hash } from "bcryptjs"
import { verify } from "jsonwebtoken"
import moment from "moment"
import path from "path"
import {
  Query,
  Mutation,
  ObjectType,
  Field,
  Arg,
  Resolver,
  Ctx,
  UseMiddleware,
  Int,
} from "type-graphql"

import { JwtPayload, MyContext } from "../types/MyContext"
import { AppDataSource } from "../data-source"
import { isAuth } from "../middlewares"
import { Token, User } from "../entity"
import {
  createRecoveryPasswordToken,
  createInvitationToken,
  createRefreshToken,
  createAccessToken,
  sendRefreshToken,
  MailOptions,
  transporter,
  logger,
} from "../utils"

@ObjectType()
class SignInSuccess {
  @Field()
  token: string
}

@Resolver(User)
export class UserResolver {
  @Query(() => String)
  hello(): string {
    return "Hi there!"
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() ctx: MyContext): string {
    return `You user id is: ${ctx.payload.userId}`
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find()
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg("userId", () => Int) userId: number
  ): Promise<boolean> {
    await AppDataSource
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1)

    return true
  }

  @Mutation(() => Boolean)
  async signUp(
    @Arg("email") email: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("password") password: string,
  ): Promise<boolean> {
    if (await User.findOne({ where: { email } })) {
      throw new Error("Email already in use")
    }

    try {
      const hashedPassword = await hash(password, 12)
      await User.insert({ firstName, lastName, email, password: hashedPassword })
      const token = await createInvitationToken(email)
      transporter.sendMail({
        from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
        to: email,
        subject: `[${process.env.APP_NAME}] Activate your account`,
        template: "activation",
        context: {
          name: firstName,
          lastname: lastName,
          username: email,
          link: `${process.env.URL_SITE}/auth/sign-in?token=${token.value}`,
          copyright: `© ${moment().format("YYYY")}, <a style="text-decoration: none; font-weight: 700; color: #FFFFFF;" href="${process.env.URL_SITE}">${process.env.APP_NAME}</a>. All rights reserved.`
        },
        attachments: [
          {
            filename: "logo",
            path: path.join(process.cwd() + "/assets/logo.png"),
            cid: "logo",
          }
        ]
      } as MailOptions)
    } catch (error) {
      logger.error(error)
      throw new Error("Error creating user")
    }

    return true
  }

  @Mutation(() => SignInSuccess)
  async signIn(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext,
  ): Promise<SignInSuccess> {
    const user = await User.findOne({ where: { email } })

    if (!user || !user?.isActive) {
      throw new Error("Invalid login")
    }

    const valid = await compare(password, user.password)

    if (!valid) {
      throw new Error("Bad password")
    }

    sendRefreshToken(ctx.res, await createRefreshToken(user))

    return {
      token: await createAccessToken(user)
    }
  }

  @Mutation(() => SignInSuccess)
  async activeUser(@Arg("token") token: string, @Ctx() ctx: MyContext): Promise<SignInSuccess> {
    const payload = verify(token, process.env.INVITATION_TOKEN_SECRET!) as JwtPayload
    const user = await User.findOne({ where: { email: payload.email } })
    const tokenEntity = await Token.findOne({ where: { value: token } })

    if (!user) {
      throw new Error("Invalid user")
    }

    if (user.isActive) {
      throw new Error("User already active")
    }

    if (!tokenEntity || !tokenEntity?.isActive) {
      throw new Error("Invalid token")
    }

    await Token.update({ id: tokenEntity.id }, { isActive: false })
    await User.update({ id: user.id }, { isActive: true })
    sendRefreshToken(ctx.res, await createRefreshToken(user))

    return {
      token: await createAccessToken(user)
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new Error("Please check your email")
    }

    try {
      const token = await createRecoveryPasswordToken(user)
      transporter.sendMail({
        from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: `[${process.env.APP_NAME}] Recover your password`,
        template: "recovery-password",
        context: {
          name: user.firstName,
          lastname: user.lastName,
          username: user.email,
          link: `${process.env.URL_SITE}/auth/forgot?token=${token.value}`,
          copyright: `© ${moment().format("YYYY")}, <a style="text-decoration: none; font-weight: 700; color: #FFFFFF;" href="${process.env.URL_SITE}">${process.env.APP_NAME}</a>. All rights reserved.`
        },
        attachments: [
          {
            filename: "logo",
            path: path.join(process.cwd() + "/assets/logo.png"),
            cid: "logo",
          }
        ]
      } as MailOptions)
    } catch (error) {
      logger.error(error)
      return false
    }

    return true
  }

  @Mutation(() => Boolean)
  async resetPassword(@Arg("token") token: string, @Arg("password") password: string): Promise<boolean> {
    try {
      const payload = verify(token, process.env.RECOVERY_PASSWORD_TOKEN_SECRET!) as JwtPayload
      const tokenEntity = await Token.findOne({ where: { value: token } })
      const user = await User.findOne({ where: { id: payload.userId } })

      if (!user) {
        throw new Error("Invalid user")
      }

      if (!tokenEntity || !tokenEntity?.isActive) {
        throw new Error("Invalid token")
      }

      const hashedPassword = await hash(password, 12)
      await Token.update({ id: tokenEntity.id }, { isActive: false })
      await User.update({ id: user.id }, { password: hashedPassword })
    } catch (error) {
      logger.error(error)
      return false
    }

    return true
  }

  // @Mutation(() => Boolean)
  // async profilePicture(
  //   @Arg("picture", () => GraphQLUpload),
  //   { createReadStream, filename }: Upload,
  // ): Promise<boolean> {
  //   return new Promise(async (resolve, reject) =>
  //     createReadStream()
  //       .pipe(createWriteStream(__dirname + '../../uploads/users' + filename))
  //       .on("finish", () => resolve(true))
  //       .on("error", () => reject(false))
  //   )
  // } 
}
