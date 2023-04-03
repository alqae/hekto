import React from 'react'
import classNames from 'classnames'
import { useFormContext } from 'react-hook-form'

import { useFindCategoriesQuery } from '../../../../generated/graphql'
import { Checkbox, Heading, Paragraph } from '../../../../components'
import { SearchForm } from '../../Shop'

export interface FilterCategoryProps { }

export const FilterCategory: React.FC<FilterCategoryProps> = () => {
  const { data } = useFindCategoriesQuery()
  const [categoriesToShow, setCategoriesToShow] = React.useState(5)
  const totalCategories = data?.categories?.length || 0
  const { register, watch } = useFormContext<SearchForm>()

  return (
    <div className="mb-2">
      <Heading level={4} size="sm">Categories</Heading>
      <div className={classNames({ 'mb-2': categoriesToShow === totalCategories })}>

      {data?.categories?.slice(0, categoriesToShow).map((category) => (
        <Checkbox
          key={category.id}
          id={`${category.name}-${category.id}`}
          name="categories"
          className=""
          value={category.id}
          label={category.name}
          checked={watch("categories").includes(category.id.toString())}
          render={
            <input
              type="checkbox"
              value={category.id.toString()}
              id={`${category.name}-${category.id}`}
              {...register('categories')}
            />
          }
        />
      ))}

      {totalCategories > categoriesToShow && (
        <Paragraph
          onClick={() => setCategoriesToShow(categoriesToShow + 5)}
          className="clickable mt-1 mb-2"
          color="primary"
          size="sm"
        >
          Show more
        </Paragraph>
      )}
      </div>
    </div>
  )
}
