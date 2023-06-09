import { Factory, Seeder } from "typeorm-seeding"
import { faker } from "@faker-js/faker"
import { Connection } from "typeorm"

import { User, Product, Category, Color, Size, Review, Asset } from "../entity"

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, _connection: Connection): Promise<void> {
    const users = await factory(User)().createMany(15)
    const categories = await factory(Category)().createMany(30)
    const colors = await factory(Color)().createMany(30)
    const sizes = await factory(Size)().createMany(6)
    const reviews = await factory(Review)()
      .map(async (review) => {
        review.user = users[Math.floor(Math.random() * users.length)]
        return review
      })
      .createMany(100)

    const assets = await factory(Asset)().createMany(100)

    await factory(Product)()
      .map(async (product) => {
        product.user = users[Math.floor(Math.random() * users.length)]
        product.categories = faker.helpers.arrayElements(categories, faker.datatype.number({ max: 5 }))
        product.colors = faker.helpers.arrayElements(colors, faker.datatype.number({ min: 3, max: 10 }))
        product.sizes = faker.helpers.arrayElements(sizes, faker.datatype.number({ min: 1, max: 4 }))
        product.reviews = faker.helpers.arrayElements(reviews, faker.datatype.number({ min: 1, max: 10 }))
        product.assets = faker.helpers.arrayElements(assets, 4)
        const thumbnail = await factory(Asset)().create()
        product.thumbnail = thumbnail
        return product
      })
      .createMany(50)
  }
}