import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { DeleteResult } from "typeorm"

import { Color } from "../entity"

@Resolver(Color)
export class ColorResolver {
  @Query(() => [Color])
  colors(): Promise<Color[]> {
    return Color.find()
  }

  @Query(() => Color)
  color(@Arg("id") id: number): Promise<Color | null> {
    return Color.findOne({ where: { id } })
  }

  @Mutation(() => Color)
  async createColor(@Arg("value") value: string): Promise<Color> {
    const color = await Color.create({ value }).save()

    return color
  }

  @Mutation(() => Color)
  deleteColor(@Arg("id") id: number): Promise<DeleteResult> {
    return Color.delete({ id })
  }
}
