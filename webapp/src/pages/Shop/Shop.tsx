import React from 'react'
import classNames from 'classnames'
import styles from './Shop.module.scss'
import { BsFillGridFill } from 'react-icons/bs'
import { AiOutlineOrderedList } from 'react-icons/ai'
import { AnimationProps, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'

import { AppDispatch, RootState } from '../../store'
import { Product } from '../../generated/graphql'
import { search } from '../../store/reducers'
import {
  Button,
  Dropdown,
  Heading,
  Pagination,
  Paragraph,
  ProductCard,
} from '../../components'
import {
  FilterCategory,
  FilterColor,
  FilterPrice,
  FilterRating,
} from './components'
import { faker } from '@faker-js/faker'

export interface SearchProps { }

export interface SearchForm {
  perPage: string
  sort: string
  minPrice: number
  maxPrice: number
  rating: string[]
  categories: string[]
  colors: string[]
}

const sortOptions = [
  {
    value: '1',
    label: 'Newest',
    metadata: { sortKey: 'createdAt', sortDirection: 'DESC' }
  },
  {
    value: '2',
    label: 'Oldest',
    metadata: { sortKey: 'createdAt', sortDirection: 'ASC' }
  },
  {
    value: '3',
    label: 'Price: Low to High',
    metadata: { sortKey: 'price', sortDirection: 'ASC' }
  },
  {
    value: '4',
    label: 'Price: High to Low',
    metadata: { sortKey: 'price', sortDirection: 'DESC' }
  },
]

const transition: AnimationProps['transition'] = { duration: 0.5, ease: 'easeOut' };

export enum SearchMode {
  Grid = 'grid',
  Row = 'row',
}

const Shop: React.FC<SearchProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  // Form Direction
  const [hitsDirection, setHitsDirection] = React.useState<SearchMode>(SearchMode.Grid)
  const isGrid = hitsDirection == SearchMode.Grid
  const isRow = hitsDirection == SearchMode.Row
  // Pagination
  const [currentPageData, setCurrentPageData] = React.useState<Product[]>([])
  const [currentPage, setCurrentPage] = React.useState(0)
  const [majorPrice, setMajorPrice] = React.useState(0)
  const [minorPrice, setMinorPrice] = React.useState(0)
  const [perPage, setPerPage] = React.useState(20)
  /// Search
  const hits = useSelector<RootState, Product[]>((state) => state.search.hits || [])
  const isLoading = useSelector<RootState, boolean>((state) => state.search.loading)

  const methods = useForm<SearchForm>({
    defaultValues: {
      minPrice: 0,
      maxPrice: majorPrice,
      categories: [],
      colors: [],
      rating: [],
      perPage: perPage.toString(),
      sort: '1',
    }
  })

  React.useEffect(() => {
    if (!!perPage && !!hits.length) {
      const isOutOfBound = currentPage * perPage > hits.length
      const nextCurrentPage = isOutOfBound ? 0 : currentPage
      calculatePagination(nextCurrentPage)
      handlePageClick(nextCurrentPage)
    }
  }, [currentPage, hits, perPage])

  React.useEffect(() => {
    dispatch(search())
  }, [dispatch])

  React.useEffect(() => {
    const nextMajorValue = Math.max(...hits.map((item) => item.price))
    const nextMinorValue = Math.min(...hits.map((item) => item.price))

    if (nextMajorValue > majorPrice) {
      setMajorPrice(nextMajorValue)
      methods.setValue('maxPrice', nextMajorValue)
    }

    if (nextMinorValue < minorPrice) {
      setMinorPrice(nextMinorValue)
      methods.setValue('minPrice', nextMinorValue)
    }
  }, [hits])

  const categories = methods.watch('categories', [])
  const colors = methods.watch('colors', [])
  const minPrice = methods.watch('minPrice', 0)
  const maxPrice = methods.watch('maxPrice', 1)
  const sort = methods.watch('sort', '1')

  React.useEffect(() => {
    const { metadata } = sortOptions.find((item) => item.value === sort) ?? {}

    dispatch(search({
      categories: categories.map((category) => parseInt(category)),
      colors: colors.map((color) => parseInt(color)),
      minPrice,
      maxPrice,
      sortKey: metadata?.sortKey,
      sortDirection: metadata?.sortDirection,
    }))
  }, [categories, colors, minPrice, maxPrice, sort])


  const calculatePagination = (page: number): void => {
    const offset = page * perPage
    const currentPageData = hits.slice(offset, offset + perPage)
    setCurrentPageData(currentPageData)
  }

  const duration = useSelector<RootState, string>((state) => {
    const ms = state.search.duration || 0
    const min = Math.floor((ms / 1000 / 60) << 0)
    const sec = ((ms % 60000) / 1000).toFixed(1)
    return `${min > 0 ? `${min} minutes` : ``}${sec} seconds`
  })

  const handlePageClick = (selected: number) => {
    setCurrentPage(selected)

    const el = document.getElementById('layout')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const onSubmit = (data: SearchForm) => {
    const { metadata } = sortOptions.find((item) => item.value === data.sort) ?? {}

    dispatch(search({
      categories: data.categories.map((category) => parseInt(category)),
      colors: data.colors.map((color) => parseInt(color)),
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      sortKey: metadata?.sortKey,
      sortDirection: metadata?.sortDirection,
    }))
  }

  const perPageOptions = Array
    .from({ length: 20 }, (_, i) => i + 1)
    .filter((item) => item * 5 <= hits.length)
    .map((item) => ({ value: (item * 5).toString(), label: (item * 5).toString() }))

  const clearFilters = () => {
    methods.reset({
      minPrice: minorPrice,
      maxPrice: majorPrice,
      categories: [],
      colors: [],
      rating: [],
      perPage: perPage.toString(),
      sort: '1',
    })
  }

  const skeletonProducts = new Array<Product>(perPage).fill({
    id: 0,
    name: '',
    price: 0,
    rating: 0,
    description: '',
    quantity: 0,
    assets: [],
    categories: [],
    colors: [],
    reviews: [],
    sizes: [],
    videoURL: '',
    createdAt: 0,
    updatedAt: 0,
  })
    
  return (
    <section className="container d-flex flex-wrap mt-0 pt-md-15 pt-8">
      <FormProvider {...methods}>
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: '-100%' }}
          whileInView={{ opacity: 1, y: 0, zIndex: 2 }}
          transition={transition}
          className="row col-12 align-items-center"
        >
          <div className="col me-auto d-flex flex-column justify-content-center">
            <Heading level={3} size="sm" className="mb-0">Ecommerce Acceories & Fashion</Heading>
            <Paragraph as="span">About {hits.length} results ({duration})</Paragraph>
          </div>

          <div className="col-auto d-flex align-items-center">
            <Paragraph as="label"color="secondary" className="me-1">
              Per Page:
            </Paragraph>
            <Dropdown
              options={perPageOptions}
              defaultValue={{ value: perPage.toString(), label: perPage.toString() }}
              onChange={({ value }) => {
                methods.setValue('perPage', value)
                setPerPage(parseInt(value))
              }}
            />
          </div>

          <div className="col-auto">
            <Paragraph as="label" color="secondary" className="me-1">Sort By:</Paragraph>
            <Dropdown
              options={sortOptions}
              defaultValue={sortOptions[0]}
              value={sortOptions.find((item) => item.value === sort)}
              onChange={({ value }) => methods.setValue('sort', value)}
            />
          </div>

          <div className={classNames(styles.viewMode, 'col-auto', 'd-flex', 'gap-1', 'align-items-center')}>
            <Paragraph as="span" color="secondary">View :</Paragraph>
            <button
              className={classNames({ [styles.active]: isRow })}
              onClick={() => setHitsDirection(SearchMode.Row)}
            >
              <AiOutlineOrderedList />
            </button> 
            <button
              className={classNames({ [styles.active]: isGrid })}
              onClick={() => setHitsDirection(SearchMode.Grid)}
            >
              <BsFillGridFill />
            </button>
          </div>
        </motion.div>

        <div className="pt-3 col-12 row">
          {isGrid && (
            <motion.form
              viewport={{ once: true }}
              initial={{ opacity: 0, x: '100%' }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={transition}
              className="col-3"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              {/* TODO: Add Product Brand filter */}
              {/* TODO: Add Discount Offer filter */}
              {/* <FilterRating /> */}
              <FilterCategory />
              <FilterPrice
                maxPrice={methods.watch('maxPrice')}
                minPrice={methods.watch('minPrice')}
                onMaxPriceChange={(value) => methods.setValue('maxPrice', value)}
                onMinPriceChange={(value) => methods.setValue('minPrice', value)}
                min={minorPrice}
                max={majorPrice}
              />
              <FilterColor />
              <Button type="reset" onClick={clearFilters} soft className="mt-2">Clear</Button>
            </motion.form>
          )}

          <div
            id="results"
            key={hitsDirection}
            className={classNames({
              'col-9 row g-2': isGrid,
              [styles.resultsGridWrapper]: isGrid,
              'col-12': isRow
            })}
          >
            {
              (isLoading ? skeletonProducts : currentPageData).map((product, index) => (
                <div key={isLoading ? index : product.id} className={classNames({
                  'col-4': isGrid,
                  'col-12': isRow,
                  'mb-4': isRow && (currentPageData.length - 1) != index,
                })}>
                  <ProductCard isLoading={isLoading} product={product} mode={hitsDirection} />
                </div>
              ))
            }
          </div>
        </div>

        <div className="col-12 mt-5 text-center">
          <Pagination
            onPageChange={handlePageClick}
            currentPage={currentPage}
            total={hits.length}
            perPage={perPage}
            pagesToShow={5}
          />
        </div>
      </FormProvider>
    </section>
  )
}

export default Shop
