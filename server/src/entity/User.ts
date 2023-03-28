import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert, OneToOne, JoinColumn } from "typeorm"
import { ObjectType, Field, Int } from "type-graphql"
import { genSalt, hash } from "bcryptjs"
import { Product } from "./Product"
import { Asset } from "./Asset"

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column("text")
  firstName: string

  @Field(() => String)
  @Column("text")
  lastName: string

  @Field(() => String)
  fullName: string;

  @Field(() => String)
  @Column("text", { unique: true })
  email: string

  @Field(() => Boolean)
  @Column("boolean", { default: false })
  isActive: boolean

  @Column("text")
  password: string

  @Field(() => Int)
  @Column("int", { default: 0 })
  tokenVersion: number

  @Field(() => [Product], { defaultValue: [], nullable: true })
  @OneToMany(() => Product, (product) => product.user)
  products: Product[]

  @Field(() => Boolean)
  @Column("boolean", { default: false })
  isSeller: boolean

  @Field(() => Asset)
  @OneToOne(() => Asset, { nullable: true })
  @JoinColumn()
  avatar: Asset

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await genSalt()
    this.password = await hash(password || this.password, salt)
  }
}
