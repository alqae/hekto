import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { DeleteResult } from "typeorm"

import { Size } from "../entity"

@Resolver(Size)
export class SizeResolver {
  @Query(() => [Size])
  sizes(): Promise<Size[]> {
    return Size.find()
  }

  @Query(() => Size)
  size(@Arg("id") id: number): Promise<Size | null> {
    return Size.findOne({ where: { id } })
  }

  @Mutation(() => Size)
  async createSize(@Arg("value") value: string): Promise<Size> {
    const size = await Size.create({ value }).save()

    return size
  }

  @Mutation(() => Size)
  deleteSize(@Arg("id") id: number): Promise<DeleteResult> {
    return Size.delete({ id })
  }
}
