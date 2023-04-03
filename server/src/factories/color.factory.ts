import { faker } from "@faker-js/faker"
import { define } from "typeorm-seeding"

import { Color } from "../entity"

define(Color, () => {
  const color = new Color()
  color.value = faker.color.rgb({ format: "hex" })
  return color
})
