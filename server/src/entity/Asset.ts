import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import { ObjectType, Field, Int, Float, registerEnumType } from "type-graphql"

export enum AssetType {
  USER_AVATAR = "user_avatar",
  PRODUCT_ASSET = "product_asset",
  PRODUCT_THUMBNAIL = "product_thumbnail",
  UNKNOWN = "unknown",
}

registerEnumType(AssetType, {
  name: "AssetType",
  description: "The assets types",
  valuesConfig: {
    PRODUCT_ASSET: {
      description: "Product asset",
    },
    PRODUCT_THUMBNAIL: {
      description: "Product Thumbnail",
    },
    USER_AVATAR: {
      description: "User asset",
    },
    UNKNOWN: {
      description: "Unknown asset",
    },
  },
})

@ObjectType()
@Entity("assets")
export class Asset extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column("text")
  description: string

  @Field(() => String)
  @Column("text")
  path: string

  @Field(() => Float)
  @Column("float")
  size: number

  // @Field(() => AssetType)
  // @Column("text", { default: AssetType.UNKNOWN, nullable: true })
  // entityType: string

  // @Field(() => Int)
  // @Column("int", { nullable: true })
  // entityId: number
}
