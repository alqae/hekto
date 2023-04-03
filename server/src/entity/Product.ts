import { ObjectType, Field, Int, Float } from "type-graphql"
import {
  PrimaryGeneratedColumn,
  ManyToMany,
  BaseEntity,
  JoinTable,
  ManyToOne,
  OneToOne,
  Entity,
  Column,
  JoinColumn,
} from "typeorm"

import { Category } from "./Category"
import { Color } from "./Color"
import { Asset } from "./Asset"
import { User } from "./User"
import { Size } from "./Size"
import { Review } from "./Review"
import moment from "moment"

@ObjectType()
@Entity("products")
export class Product extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column("text")
  name: string

  @Field(() => String)
  @Column("text")
  description: string

  @Field()
  @Column("float")
  price: number

  @Field(() => Int)
  @Column("int", { default: 1 })
  quantity: number

  @Field(() => Asset, { nullable: true })
  @OneToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: "thumbnail_id", referencedColumnName: "id" })
  thumbnail: Asset

  @Field(() => [Review], { defaultValue: [], nullable: true })
  @ManyToMany(() => Review)
  @JoinTable({
    name: "product_reviews",
    joinColumn: { name: "product_id" },
    inverseJoinColumn: { name: "review_id" },
  })
  reviews: Review[]

  @Field(() => Float, { nullable: true })
  rating: number

  @Field(() => [Asset], { defaultValue: [], nullable: true })
  @ManyToMany(() => Asset)
  @JoinTable({
    name: "product_assets",
    joinColumn: { name: "product_id" },
    inverseJoinColumn: { name: "asset_id" },
  })
  assets: Asset[]

  @Field(() => [Category], { defaultValue: [], nullable: true })
  @ManyToMany(() => Category)
  @JoinTable({
    name: "product_categories",
    joinColumn: { name: "product_id" },
    inverseJoinColumn: { name: "category_id" },
  })
  categories: Category[]

  @Field(() => [Color], { defaultValue: [], nullable: true })
  @ManyToMany(() => Color)
  @JoinTable({
    name: "product_colors",
    joinColumn: { name: "product_id" },
    inverseJoinColumn: { name: "color_id" },
  })
  colors: Color[]

  @Field(() => [Size], { defaultValue: [], nullable: true })
  @ManyToMany(() => Size)
  @JoinTable({
    name: "product_sizes",
    joinColumn: { name: "product_id" },
    inverseJoinColumn: { name: "size_id" },
  })
  sizes: Size[]

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.products)
  user: User

  @Field(() => Int)
  @Column("int", { nullable: true, default: moment().unix() })
  createdAt: number

  @Field(() => Int)
  @Column("int", { nullable: true, default: moment().unix() })
  updatedAt: number
}
