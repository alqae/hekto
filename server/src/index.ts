import "dotenv/config"
import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import path from "path"
import cors from "cors"
import morgan from "morgan"
import multer from "multer"
import crypto from "crypto"
import slug from "slug"
import fs from "fs"
import express from "express"
import bodyParser from "body-parser"
import { verify } from "jsonwebtoken"
import cookieParser from "cookie-parser"
import { buildSchema } from "type-graphql"
import hbs from "nodemailer-express-handlebars"

import { logger, createRefreshToken, sendRefreshToken, transporter } from "./utils"
import { Asset, AssetType, Product, User } from "./entity"
import { morganMiddleware } from "./middlewares"
import { JwtPayload } from "./types/MyContext"
import { AppDataSource } from "./data-source"
import {
  AssetResolver,
  CategoryResolver,
  ColorResolver,
  ProductResolver,
  SizeResolver,
  UserResolver,
} from "./resolvers"

(async () => {
  const app = express()

  const hbsConfig = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.join(process.cwd(), "./views/"),
      layoutsDir: path.join(process.cwd(), "/views/"),
    },
    viewPath: path.join(process.cwd(), "./views/"),
    extName: ".hbs",
  }

  const storage = multer.diskStorage({
    destination: (req, _, cb) => {
      const { entityType } = req.query
      const path = `./uploads/${entityType}`
      fs.mkdirSync(path, { recursive: true })
      return cb(null, path)
    },
    filename: (req, file, cb) => {
      const description = String(req.query.description) ?? file.originalname
      crypto.randomBytes(3, (err, res) => {
        if (err) return cb(err, file.filename)
        return cb(null, slug(description, { lower: true }) + '_' + res.toString('hex') + path.extname(file.originalname))
      })
    }
  })
  
  // multer.diskStorage({
  //   destination: (req, _file, cb) => cb(null, process.cwd() + `/uploads/${req.query.entityType ?? ''}/`) ,
  //   filename: (_req, file, cb) => cb(null, file.originalname),
  // })

  const uploads = multer({ storage })

  transporter.use("compile", hbs(hbsConfig))
  app.use(express.static("public"))
  app.use(cors({
    origin: process.env.URL_SITE,
    credentials: true
  }))
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(morgan(":graphql-query"))
  app.use(morganMiddleware)
  const PORT = process.env.PORT || 3000

  await AppDataSource.initialize()

  const apolloServer = new ApolloServer({
    schema:  await buildSchema({
      resolvers: [UserResolver, ProductResolver, CategoryResolver, SizeResolver, ColorResolver, AssetResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({ app, cors: {
    origin: process.env.URL_SITE,
    credentials: true,
  }})

  app.get("/", (_req, res) => res.send(":)"))
  app.post("/refresh", async (req, res) => {
    const token = req.cookies.jid
    if (!token) {
      return res.send({ ok: false, token: "" })
    }

    let payload: JwtPayload;

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload
    } catch (error) {
      logger.error(error)
      return res.send({ ok: false, token: "" })
    }

    const user = await User.findOne({ where: { id: payload.userId } })

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, token: "" })
    }

    sendRefreshToken(res, await createRefreshToken(user))

    return res.send({ ok: true, token: await createRefreshToken(user) })
  })
  app.post("/uploads", uploads.array("files"), async (req, res) => {
    try {
      const { entityType, entityId } = req.query
      const files = req.files as Express.Multer.File[]

      if (
        !entityType ||
        !entityId ||
        !Object.values<String>(AssetType).includes(entityType as string)
      ) {
        return res.status(500).send({ ok: false, error: "Invalid input" })
      }

      await Promise.all(
        files.map(async (file) => {
          const asset = await Asset.create({
            path: file.path,
            size: file.size,
            description: file.originalname,
          }).save()

          switch (entityType) {
            case AssetType.PRODUCT_ASSET:
            case AssetType.PRODUCT_THUMBNAIL:
              const product = await Product.findOne({ where: { id: Number(entityId) } })
              if (!product) return res.status(404).send({ ok: false })
              if (entityType === AssetType.PRODUCT_ASSET) product.assets.push(asset)
              if (entityType === AssetType.PRODUCT_THUMBNAIL) product.thumbnail = asset
              await product.save()
              break;

            case AssetType.USER_AVATAR:
              const user = await User.findOne({ where: { id: Number(entityId) } })
              if (!user) return res.status(404).send({ ok: false })
              user.avatar = asset
              await user.save()
              break;
          
            default:
              break;
          }

          return asset
        })
      )
      return res.status(200).send({ ok: true })
    } catch (error) {
      logger.error(error)
      return res.status(500).send({ ok: false, error })
    }
  })

  app.listen(PORT, () => logger.info("👉 [Server] Initialized"))
})()
