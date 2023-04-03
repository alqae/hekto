import React from 'react'
import { useFormContext } from 'react-hook-form'

import { useFindColorsQuery } from '../../../../generated/graphql'
import { Checkbox, Heading } from '../../../../components'
import { SearchForm } from '../../Shop'

export interface FilterColorProps { }

const FilterColor: React.FC<FilterColorProps> = () => {
  const { data } = useFindColorsQuery()
  const { register, watch } = useFormContext<SearchForm>()

  return(
    <React.Fragment>
      <Heading level={4} size="sm">Filter By Color</Heading>
      <div className="d-flex gap-1 flex-wrap">
        {data?.colors?.map((color) => (
          <Checkbox
            key={color.id}
            id={color.value}
            name="colors"
            customColor={color.value}
            value={color.id}
            checked={watch("colors").includes(color.id.toString())}
            render={
              <input
                type="checkbox"
                value={color.id.toString()}
                id={color.value}
                {...register('colors')}
              />
            }
          />
        ))}
      </div>
    </React.Fragment>
  )
}

export default FilterColor
