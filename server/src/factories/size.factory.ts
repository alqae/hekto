import { faker } from "@faker-js/faker"
import { define } from "typeorm-seeding"

import { Size } from "../entity"

define(Size, () => {
  const size = new Size()
  size.value = faker.helpers.arrayElement(["XS", "S", "M", "L", "XL", "XXL"])
  return size
})
