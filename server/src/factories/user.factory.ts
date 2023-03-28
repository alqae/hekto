import { faker } from "@faker-js/faker"
import { define } from "typeorm-seeding"

import { User } from "../entity"

define(User, () => {
  const user = new User()
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  user.firstName = firstName
  user.lastName = lastName
  user.email = faker.internet.email(firstName, lastName)
  user.isActive = true;
  user.password = "12345"
  user.tokenVersion = 0;
  return user;
})
