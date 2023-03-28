import { Request } from "express"
import morgan from "morgan"

import { logger } from "../utils/logger"

const stream = {
  // Use the http severity
  write: (message: any) => logger.http(message),
}

const skip = () => {
  const env = process.env.NODE_ENV || "development"
  return env !== "development"
}

export const morganMiddleware = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream, skip }
)

morgan.token("graphql-query", (req: Request) => {
  const {query, variables, operationName} = req.body;
  const skipOperations = ["IntrospectionQuery"]
  if (operationName && !skipOperations.includes(operationName)) {
    return `GRAPHQL: \nOperation Name: ${operationName} \nQuery: ${query} \nVariables: ${JSON.stringify(variables)}`
  }
  return
})
