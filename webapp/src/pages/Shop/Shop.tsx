import React from 'react'
import * as Yup from 'yup'
import classNames from 'classnames'
import styles from './Shop.module.scss'
import { faker } from '@faker-js/faker'
import { useForm } from 'react-hook-form'
import ReactPaginate from 'react-paginate'
import { BsFillGridFill } from 'react-icons/bs'
import { yupResolver } from '@hookform/resolvers/yup'
import { AiOutlineOrderedList } from 'react-icons/ai'
import { AnimationProps, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md'

import { AppDispatch, RootState } from '../../store'
import { Product } from '../../generated/graphql'
import { search } from '../../store/reducers'
import {
  Dropdown,
  Field,
  Heading,
  Loader,
  Paragraph,
  ProductCard,
} from '../../components'

interface SearchProps { }

interface SearchForm {
  perPage: number | string
  query: string
  sort: string
  minPrice: number
  maxPrice: number
  tags: string[]
  categories: string[]
}

const categories = [
  { id: faker.datatype.uuid(), name: 'Clothing' },
  { id: faker.datatype.uuid(), name: 'Shoes' },
  { id: faker.datatype.uuid(), name: 'Accessories' },
  { id: faker.datatype.uuid(), name: 'Jewelry' },
  { id: faker.datatype.uuid(), name: 'Beauty' },
  { id: faker.datatype.uuid(), name: 'Home' },
  { id: faker.datatype.uuid(), name: 'Kids' },
  { id: faker.datatype.uuid(), name: 'Pets' },
  { id: faker.datatype.uuid(), name: 'Sports' },
  { id: faker.datatype.uuid(), name: 'Toys' },
  { id: faker.datatype.uuid(), name: 'Electronics' },
  { id: faker.datatype.uuid(), name: 'Books' },
]

const tags = [
  { id: faker.datatype.uuid(), name: 'New' },
  { id: faker.datatype.uuid(), name: 'Sale' },
  { id: faker.datatype.uuid(), name: 'Bestseller' },
  { id: faker.datatype.uuid(), name: 'Trending' },
  { id: faker.datatype.uuid(), name: 'Featured' },
  { id: faker.datatype.uuid(), name: 'Popular' },
  { id: faker.datatype.uuid(), name: 'Limited' },
  { id: faker.datatype.uuid(), name: 'Exclusive' },
  { id: faker.datatype.uuid(), name: 'Gift' },
  { id: faker.datatype.uuid(), name: 'Free Shipping' },
  { id: faker.datatype.uuid(), name: 'Free Returns' },
  { id: faker.datatype.uuid(), name: 'Free Gift' },
]

const sortOptions = [
  { value: '1', label: 'Newest' },
  { value: '2', label: 'Oldest' },
  { value: '3', label: 'Price: Low to High' },
  { value: '4', label: 'Price: High to Low' },
]

const transition: AnimationProps['transition'] = { duration: 0.5, ease: 'easeOut' };

const Shop: React.FC<SearchProps> = () => {
  const [hitsDirection, setHitsDirection] = React.useState<'grid' | 'row'>('grid')
  const isGrid = hitsDirection == 'grid'  
  const isRow = hitsDirection == 'row'

  const [currentPageData, setCurrentPageData] = React.useState<Product[]>([])
  const [pageCount, setPageCount] = React.useState<number>(0)
  const [currentPage, setCurrentPage] = React.useState(0)
  const [perPage, setPerPage] = React.useState(15)

  const dispatch = useDispatch<AppDispatch>()

  const hits = useSelector<RootState, Product[]>((state) => state.search.hits || [])
  const isLoading = useSelector<RootState, boolean>((state) => state.search.loading)

  React.useEffect(() => {
    if (!!perPage && !!hits.length) {
      console.warn('passou aqui', { perPage, hits: hits.length, currentPage });
      
      const offset = currentPage * perPage
      setPageCount(Math.ceil(hits.length / perPage))
      setCurrentPageData(hits.slice(offset, offset + perPage))
    }
  }, [currentPage, hits, perPage])

  React.useEffect(() => {
    dispatch(search())
  }, [dispatch])

  const duration = useSelector<RootState, string>((state) => {
    const ms = state.search.duration || 0
    const min = Math.floor((ms / 1000 / 60) << 0)
    const sec = ((ms % 60000) / 1000).toFixed(1)
    return `${min > 0 ? `${min} minutes` : ``}${sec} seconds`
  })

  const formSchema = Yup.object().shape({
    perPage: Yup.number().min(10).max(hits.length / 10).required(),
  })

  const { control, watch, handleSubmit, setValue } = useForm<SearchForm>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      minPrice: 0,
      maxPrice: 100,
      perPage,
      query: '',
    }
  })
  
  // const { append: appendCategory, remove: removeCategory } = useFieldArray({
  //   control, // control props comes from useForm (optional: if you are using FormContext)
  //   name: 'categories'
  // } as UseFieldArrayProps<SearchForm>)

  // const { append: appendTag, remove: removeTag } = useFieldArray({
  //   control, // control props comes from useForm (optional: if you are using FormContext)
  //   name: 'tags'
  // } as UseFieldArrayProps<SearchForm>)

  watch((value) => {
    if (value.perPage && value.perPage != perPage) {
      setPerPage(typeof value.perPage == 'string' ? parseInt(value.perPage) : value.perPage)
    }

    // console.warn('Before search', {
    //   // dispatch(Search({
    //   query: value.query,
    //   maxPrice: value.maxPrice,
    //   minPrice: value.minPrice,
    //   categories: value.categories,
    //   tags: value.tags,
    //   // }))
    // })
  }, {
    categories: [],
    minPrice: 0,
    query: '',
    tags: [],
    perPage,
  })

  // React.useEffect(() => {
  //   console.warn('watching')
  //   const subscription = watch((value) => {
  //     dispatch(Search({
  //       query: value.query,
  //       maxPrice: value.maxPrice,
  //       minPrice: value.minPrice,
  //       categories: value.categories,
  //       tags: value.tags,
  //     }))
  //   }, {
  //     categories: [],
  //     minPrice: 0,
  //     query: '',
  //     tags: [],
  //   })

  // //   return () => subscription.unsubscribe()
  // }, [dispatch])

  const handlePageClick = (selected: number) => {
    setCurrentPage(selected)

    const el = document.getElementById('layout')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const onSubmit = (data: SearchForm) => {
    console.log(data)
  }

  return (
    <section className="container d-flex flex-wrap mt-0 pt-md-15 pt-8">
      <motion.div
        viewport={{ once: true }}
        initial={{ opacity: 0, y: '-100%' }}
        whileInView={{ opacity: 1, y: 0, zIndex: 2 }}
        transition={transition}
        className="row col-12 align-items-center"
      >
        <div className="col me-auto d-flex flex-column justify-content-center">
          <Heading level={3} size="sm" className="mb-0">Ecommerce Acceories & Fashion item</Heading>
          <Paragraph as="span">About {hits.length} results ({duration})</Paragraph>
        </div>

        <div className="col-auto d-flex align-items-center">
          <Paragraph as="label" color="secondary" className="me-1">Per Page:</Paragraph>
          <Field
            rules={{
              min: 10,  
              max: hits.length / 10,
            }}
            name="perPage"
            type="number"
            control={control}
            className={styles.perPage}
          />
        </div>

        <div className="col-auto">
          <Paragraph as="label" color="secondary" className="me-1">Sort By:</Paragraph>
          <Dropdown
            options={sortOptions}
            defaultValue={sortOptions[0]}
            onChange={({ value }) => setValue('sort', value)}
          />
        </div>

        <div className={classNames(styles.viewMode, 'col-auto', 'd-flex', 'gap-1', 'align-items-center')}>
          <Paragraph as="span" color="secondary">View :</Paragraph>
          <button
            className={classNames({ [styles.active]: isRow })}
            onClick={() => setHitsDirection('row')}
          >
            <AiOutlineOrderedList />
          </button>
          <button
            className={classNames({ [styles.active]: isGrid })}
            onClick={() => setHitsDirection('grid')}
          >
            <BsFillGridFill />
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="pt-10 row">
        
          {isGrid && (
            <motion.form
              viewport={{ once: true }}
              initial={{ opacity: 0, x: '100%' }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={transition}
              className="col-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Heading level={4} size="sm">Product Brand</Heading>
              <Heading level={4} size="sm">Discount Offer</Heading>
              <Heading level={4} size="sm">Rating Item</Heading>
              <Heading level={4} size="sm">Categories</Heading>
              <Heading level={4} size="sm">Price Filter</Heading>
              <Heading level={4} size="sm">Filter By Color</Heading>
            </motion.form>
          )}

          <motion.div
            id="results"
            key={hitsDirection}
            viewport={{ once: true }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={classNames({
              'col-9 row': isGrid,
              'col-12': isRow,
            })}
          >
            {currentPageData.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                mode={hitsDirection}
                className={classNames({
                  'col-4': isGrid,
                  'col-12': isRow,
                  'mb-4': isRow && (currentPageData.length - 1) != index,
                })}
              />
            ))}
          </motion.div>

          <div className="col-12 mt-5">
            <ReactPaginate
              pageCount={pageCount}
              nextClassName={styles.next}
              previousClassName={styles.previous}
              containerClassName={classNames(
                styles.pagination,
                'd-flex',
                'justify-content-center',
                'align-items-center',
              )}
              activeClassName={styles.active}
              disabledClassName={styles.disabled}
              nextLabel={<MdSkipNext />}
              previousLabel={<MdSkipPrevious />}
              onPageChange={({ selected }) => handlePageClick(selected)}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default Shop
