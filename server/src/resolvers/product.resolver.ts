import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql"

import { Product, User } from "../entity"
import { MyContext } from "../types/MyContext"
import { Between, FindOptionsWhere, ILike, In } from "typeorm"

@InputType()
export class ProductInput {
  @Field(() => String, { nullable: true })
  name: string

  @Field(() => String, { nullable: true })
  description: string
}

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async search(
    @Arg("categories", () => [Number], { defaultValue: [], validate: false }) categories?: number[],
    @Arg("colors", () => [Number], { defaultValue: [], validate: false }) colors?: number[],
    @Arg("limit", { defaultValue: 100, nullable: true }) limit?: number,
    @Arg("minPrice", { nullable: true }) minPrice?: number,
    @Arg("maxPrice", { nullable: true }) maxPrice?: number,
    @Arg("name", { nullable: true }) name?: string,
    @Arg("sortKey", { nullable: true }) sortKey?: string,
    @Arg("sortDirection", { nullable: true }) sortDirection?: string,
    ): Promise<Product[]> {
    const where: FindOptionsWhere<Product> = {}

    if (minPrice != undefined && maxPrice != undefined) {
      where.price = Between(minPrice, maxPrice)
    }

    if (categories && !!categories.length) {
      where.categories = { id: In(categories) }
    }

    if (colors && !!colors.length) {
      where.colors = { id: In(colors) }
    }

    if (name) {
      where.name = ILike(`%${name}%`)
    }
    
    return await Product.find({
      where,
      order: sortDirection && sortKey ? { [sortKey]: sortDirection } : undefined,
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
