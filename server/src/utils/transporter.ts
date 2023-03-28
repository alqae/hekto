import nodemailer, { SendMailOptions } from "nodemailer"

import { logger } from "./logger"

export type MailOptions = SendMailOptions & { template: string, context: any }

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Boolean(process.env.SMTP_SECURE || true),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
}, {
  from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
})

transporter.verify((error, _success) => {
  if (error) {
    logger.error(error)
  } else {
    logger.info("🦄 [Server] Ready to take our messages")
  }
})
