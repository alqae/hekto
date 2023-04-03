import "reflect-metadata"
import { DataSource, EntitySubscriberInterface, EventSubscriber } from "typeorm"

import { User, Token, Product, Asset, Category, Color, Size, Review } from "./entity"

@EventSubscriber()
export class RatingSubscriber implements EntitySubscriberInterface<Product> {
  listenTo() {
    return Product;
  }

  async afterLoad(product: Product): Promise<void> {
    const ratings = product.reviews.map((review) => review.rating);
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    product.rating = parseFloat((total / ratings.length).toFixed(1));
  }
}

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async afterLoad(user: User): Promise<void> {
    user.fullName = user.firstName + " " + user.lastName;
  }
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "hekto",
  synchronize: true,
  logging: false,
  entities: [User, Product, Token, Asset, Category, Color, Size, Review],
  migrations: [],
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false,
  } : false,
  subscribers: [UserSubscriber, RatingSubscriber],
})
