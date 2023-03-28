import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { ObjectType, Field, Int } from "type-graphql"

export enum TokenType {
  ACCESS = "access",
  REFRESH = "refresh",
  INVITATION = "invitation",
  RECOVERY_PASSWORD = "recoveryPassword"
}

@ObjectType()
@Entity("tokens")
export class Token extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column("text", { default: TokenType.INVITATION })
  type: TokenType

  @Field()
  @Column("text")
  value: string

  @Field()
  @Column("boolean", { default: true })
  isActive: boolean
}
