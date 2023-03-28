import { faker } from "@faker-js/faker"
import { define } from "typeorm-seeding"

import { Review } from "../entity"

define(Review, () => {
  const review = new Review()
  review.content = faker.lorem.paragraph()
  review.rating = parseFloat((Math.random() * (5 - 1) + 1).toFixed(1));
  return review
})
