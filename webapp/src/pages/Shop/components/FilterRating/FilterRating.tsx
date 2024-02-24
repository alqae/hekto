import React from 'react'
import classNames from 'classnames'
// import Rating from 'react-star-review'
import { useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'

import Checkbox from '@components/Checkbox'
import Heading from '@components/Heading'
import Paragraph from '@components/Paragraph'
import { SearchForm } from '../../Shop'
import { RootState } from '@store'
import { Product } from '@graphql'

export interface FilterRatingProps { }

const FilterRating: React.FC<FilterRatingProps> = () => {
  const { register, watch } = useFormContext<SearchForm>()
  const hits = useSelector<RootState, Product[]>((state) => state.search.hits) || 0

  return (
    <div className="mb-2">
      <Heading level={4} size="sm">Rating Item</Heading>
      {[1, 2, 3, 4, 5].map((number, index, array) => {
        const productsCount = hits.filter(
          (hit) => Math.round(hit.rating ?? 0) === number
        ).length

        return (
          <Checkbox
            key={number}
            id={number.toString()}
            name="rating"
            value={number}
            className={classNames({ 'mb-1': index != array.length })}
            label={
              <div className="d-flex">
                {/* <Rating size={20} rating={number} /> */}
                <Paragraph as="span" color="gray" className="ms-1">({productsCount})</Paragraph>
              </div>
            }
            checked={watch("rating").includes(number.toString())}
            render={
              <input
                type="checkbox"
                value={number.toString()}
                id={number.toString()}
                {...register('rating')}
              />
            }
          />
        )
      })}
    </div>
  )
}

export default FilterRating
