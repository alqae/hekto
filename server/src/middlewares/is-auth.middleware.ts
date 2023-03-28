import { MiddlewareFn } from "type-graphql"
import { verify } from "jsonwebtoken"

import { MyContext } from "../types/MyContext"
import { logger } from "../utils/logger"

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"]

  if (!authorization) {
    throw new Error("Not authtenticated")
  }

  try {
    const token = authorization.split(" ")[1]
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!)
    context.payload = payload as MyContext["payload"]
  } catch (error) {
    logger.error(error)
    throw new Error("Not authtenticated")
  }

  return next()
}