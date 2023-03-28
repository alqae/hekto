import { define } from "typeorm-seeding"

import { Asset } from "../entity"

define(Asset, () => {
  const asset = new Asset()
  asset.path = "https://source.unsplash.com/random"
  asset.description = "Random image"
  asset.size = 100
  return asset
})
