import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql"

import { Product, User } from "../entity"
import { MyContext } from "../types/MyContext"

@InputType()
export class ProductInput {
  @Field(() => String)
  @Field({ nullable: false })
  name: string

  @Field(() => String)
  @Field({ nullable: false })
  description: string
}

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async search(
    @Arg("limit", { defaultValue: 100, nullable: true }) limit?: number,
    // @Arg("name", { nullable: true }) name?: string,
    // @Arg("minPrice", { nullable: true }) minPrice?: number,
    // @Arg("maxPrice", { nullable: true }) maxPrice?: number,
    // @Arg("items", () => [String]) items: String[]
    // @Arg("tags", () => [String], { nullable: true }) tags?: String[],
    // @Arg("categories", () => [String], { nullable: true }) categories?: String[],
  ): Promise<Product[]> {
    return await Product.find({
      relations: ['categories', 'colors', 'sizes', 'reviews', 'thumbnail'],
      take: limit,
    })
  }

  @Query(() => Product)
  product(@Arg("id") id: number): Promise<Product | null> {
    return Product.findOne({ where: { id }, relations: ['categories', 'assets', 'thumbnail', 'reviews', 'sizes'] })
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg("input") productInput: ProductInput,
    @Ctx() ctx: MyContext,
  ): Promise<Product | null> {
    const user = await User.findOne({ where: { id: ctx.payload.userId } })
    if (!user) return null
    return await Product.create({ ...productInput, user }).save()
  }
}
