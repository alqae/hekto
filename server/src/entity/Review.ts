import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"
import { ObjectType, Field, Int, Float } from "type-graphql"
import { User } from "./User"

@ObjectType()
@Entity("reviews")
export class Review extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column("text")
  content: string

  @Field(() => Float)
  @Column('float')
  rating: number

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id)
  user: User
}
