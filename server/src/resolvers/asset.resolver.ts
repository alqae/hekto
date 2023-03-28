import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql"
import { DeleteResult } from "typeorm"

import { Asset, AssetType } from "../entity"

@InputType()
export class AssetInput {
  @Field({ nullable: true })
  description?: string;

  @Field(() => Number, { nullable: false })
  entityId: number

  @Field(() => AssetType, { nullable: false })
  entityType: AssetType
}

@Resolver(Asset)
export class AssetResolver {
  @Query(() => Asset)
  asset(@Arg("id") id: number): Promise<Asset | null> {
    return Asset.findOne({ where: { id } })
  }

  @Mutation(() => Asset)
  deleteAsset(@Arg("id") id: number): Promise<DeleteResult> {
    return Asset.delete({ id })
  }
}
