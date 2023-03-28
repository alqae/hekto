import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { DeleteResult } from "typeorm"

import { Category } from "../entity"

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  categories(): Promise<Category[]> {
    return Category.find()
  }

  @Query(() => Category)
  category(@Arg("id") id: number): Promise<Category | null> {
    return Category.findOne({ where: { id } })
  }

  @Mutation(() => Category)
  async createCategory(@Arg("name") name: string): Promise<Category> {
    const category = await Category.create({ name }).save()

    return category
  }

  @Mutation(() => Category)
  deleteCategory(@Arg("id") id: number): Promise<DeleteResult> {
    return Category.delete({ id })
  }
}
