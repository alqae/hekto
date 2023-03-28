import { faker } from "@faker-js/faker"
import { define } from "typeorm-seeding"

import { Category } from "../entity"

define(Category, () => {
  const category = new Category()
  category.name = faker.commerce.department()
  return category
})
