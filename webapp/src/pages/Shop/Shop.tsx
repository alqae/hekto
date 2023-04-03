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
  { value: '1', label: 'Newest' },
  { value: '2', label: 'Oldest' },
  { value: '3', label: 'Price: Low to High' },
  { value: '4', label: 'Price: High to Low' },
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
  const [filteredHits, setFilteredHits] = React.useState<Product[]>(hits)
  const isLoading = useSelector<RootState, boolean>((state) => state.search.loading)

  React.useEffect(() => {
    if (!!perPage && !!filteredHits.length) {
      calculatePagination(currentPage)
    }
  }, [currentPage, filteredHits, perPage])

  React.useEffect(() => {
    dispatch(search())
  }, [dispatch])

  React.useEffect(() => {
    setFilteredHits(hits)
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

  const calculatePagination = (page: number): void => {
    const offset = page * perPage
    const currentPageData = filteredHits.slice(offset, offset + perPage)
    setCurrentPageData(currentPageData)
  }

  const duration = useSelector<RootState, string>((state) => {
    const ms = state.search.duration || 0
    const min = Math.floor((ms / 1000 / 60) << 0)
    const sec = ((ms % 60000) / 1000).toFixed(1)
    return `${min > 0 ? `${min} minutes` : ``}${sec} seconds`
  })
  
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

  const handlePageClick = (selected: number) => {
    setCurrentPage(selected)

    const el = document.getElementById('layout')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const onSubmit = (data: SearchForm) => {
    console.log(data)
  }

  const perPageOptions = Array
    .from({ length: 20 }, (_, i) => i + 1)
    .filter((item) => item * 5 <= filteredHits.length)
    .map((item) => ({ value: (item * 5).toString(), label: (item * 5).toString() }))

  // const rating = methods.watch('rating') ?? []
  const categories = methods.watch('categories') ?? []
  const colors = methods.watch('colors') ?? []
  const minPrice = methods.watch('minPrice') ?? 0
  const maxPrice = methods.watch('maxPrice') ?? 1
  const sort = methods.watch('sort') ?? '1'

  // TODO: Refactor this
  React.useEffect(() => {
    let hitsToUpdate = [...hits]
    
  //   if (!!rating.length) {
  //     const value = rating.map((item) => parseInt(item))
  //     const filteredByRating = hitsToUpdate.filter((hit) => value.includes(Math.round(hit.rating ?? 0)))
  //     hitsToUpdate = filteredByRating
  //   } else {
  //     hitsToUpdate = hits
  //   }

    // if (sort === '1') {
    //   hitsToUpdate = hitsToUpdate.sort((a, b) => a.createdAt - b.createdAt)
    // } else if (sort === '2') {
    //   hitsToUpdate = hitsToUpdate.sort((a, b) => b.createdAt - a.createdAt)
    // } else 
    if (sort === '3') {
      hitsToUpdate = hitsToUpdate.sort((a, b) => a.price - b.price)
    } else if (sort === '4') {
      hitsToUpdate = hitsToUpdate.sort((a, b) => b.price - a.price)
    }
    setFilteredHits(hitsToUpdate)
    // calculatePagination(currentPage)
  }, [sort])

  React.useEffect(() => {
    console.warn('searching...');
    
    dispatch(search({
      categories: categories.map((category) => parseInt(category)),
      colors: colors.map((color) => parseInt(color)),
      minPrice,
      maxPrice,
    }))
    
    // if (!!categories.length) {
    //   const categoriesSelected = categories.map((item) => parseInt(item))
    //   const filteredByCategory = hitsToUpdate.filter((hit) => {
    //     const hitCategories = hit.categories?.map((category) => category.id) ?? []
    //     return categoriesSelected.map((categorySelected) => hitCategories.includes(categorySelected)).every((item) => item)
    //   })
    //   hitsToUpdate = filteredByCategory
    // }

    // if (!!colors.length) {
    //   const colorsSelected = colors.map((item) => parseInt(item))
    //   const filteredByColor = hitsToUpdate.filter((hit) => {
    //     const hitColors = hit.colors?.map((color) => color.id) ?? []
    //     return colorsSelected.map((colorSelected) => hitColors.includes(colorSelected)).every((item) => item)
    //   })
    //   hitsToUpdate = filteredByColor
    // }
    
    // if (!rating.length && !categories.length && !colors.length) {
    //   hitsToUpdate = hits
    // }

    // const filteredByPrice = hitsToUpdate.filter((item) => {
    //   const price = parseFloat(item.price)
    //   return price >= minPrice && price <= maxPrice
    // })
    // hitsToUpdate = filteredByPrice

    // if (sort === '1') {
    //   hitsToUpdate = hitsToUpdate.sort((a, b) => a.createdAt - b.createdAt)
    // } else if (sort === '2') {
    //   hitsToUpdate = hitsToUpdate.sort((a, b) => b.createdAt - a.createdAt)
    // } else if (sort === '3') {
    //   hitsToUpdate = hitsToUpdate.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    // } else if (sort === '4') {
    //   hitsToUpdate = hitsToUpdate.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    // }
  }, [categories, colors, minPrice, maxPrice])

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
    createdAt: 0,
    updatedAt: 0,
  });
    
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
            <Heading level={3} size="sm" className="mb-0">Ecommerce Acceories & Fashion item</Heading>
            <Paragraph as="span">About {filteredHits.length} results ({duration})</Paragraph>
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
                <div className={classNames({
                  'col-4': isGrid,
                  'col-12': isRow,
                  'mb-4': isRow && (currentPageData.length - 1) != index,
                })}>
                  <ProductCard
                    key={product.id}
                    isLoading={isLoading}
                    product={product}
                    mode={hitsDirection}
                  />
                </div>
              ))
            }
          </div>
        </div>

        <div className="col-12 mt-5 text-center">
          <Pagination
            onPageChange={handlePageClick}
            currentPage={currentPage}
            total={filteredHits.length}
            perPage={perPage}
            pagesToShow={5}
          />
        </div>
      </FormProvider>
    </section>
  )
}

export default Shop
