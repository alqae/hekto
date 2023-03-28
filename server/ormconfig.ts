import { User, Product, Token, Asset, Category, Color, Size, Review } from "./src/entity"

export default {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "hekto",
  synchronize: true,
  logging: false,
  entities: [User, Product, Token, Asset, Category, Color, Size, Review],
  seeds: ["src/seeds/**/*{.ts,.js}"],
  factories: ["src/factories/**/*{.ts,.js}"],
}