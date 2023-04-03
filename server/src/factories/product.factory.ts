import { faker } from "@faker-js/faker"
import { define } from "typeorm-seeding"

import { Product } from "../entity"

define(Product, () => {
  const product = new Product()
  product.name = faker.commerce.productName()
  product.description = faker.commerce.productDescription()
  product.price = parseFloat(faker.finance.amount())
  product.quantity = faker.datatype.number({ min: 1, max: 150 })
  return product
})
