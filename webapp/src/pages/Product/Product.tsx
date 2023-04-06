import React from 'react'
import classNames from 'classnames'
import { Player } from 'video-react'
import Rating from 'react-star-review'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import styles from './Product.module.scss'
// import { FaFacebookF } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { AiFillInstagram, AiOutlineTwitter, AiFillFacebook } from 'react-icons/ai'

import { Product, useFindProductByIdQuery, useSearchQuery } from '../../generated/graphql'
import { addProductToCart } from '../../store/reducers'
import { AppDispatch } from '../../store'
import {
  Button,
  Carousel,
  Counter,
  Dropdown,
  Heading,
  Loader,
  NoMatch,
  Paragraph,
  ProductCard,
  Tabs,
} from '../../components'

interface ProductDetailProps { }

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { id } = useParams() as { id: string }
  const [alreadyDispatched, setAlreadyDispatched] = React.useState(false)
  const [activeImage, setActiveImage] = React.useState(0)
  const [quantity, setQuantity] = React.useState(1)
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading } = useFindProductByIdQuery({
    variables: {
      productId: parseInt(id),
    }
  })

  const SIMILAR_PRODUCTS_LIMIT = 4

  const { data: similarProducts, loading: similarProductsLoading } = useSearchQuery({
    variables: {
      categories: data?.product.categories?.map((category) => category.id),
      limit: SIMILAR_PRODUCTS_LIMIT,
    }
  })

  if (loading) {
    return <Loader />
  }

  if (!data || !data.product) {
    return <NoMatch />
  }

  return (
    <React.Fragment>
      <motion.section
        viewport={{ once: true }}
        initial={{ opacity: 0, y: '-100%' }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className={classNames(styles.productDetails, 'container', 'row')}
      >
        <div className="col-6">
          <div className={classNames(styles.productImages, 'row')}>
            <div className={classNames(styles.productImages__thumbnails, 'col-auto')}>
              {data.product.assets?.map((image, index) => index !== activeImage && (
                <motion.div
                  key={index}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setActiveImage(index)

                    const el = document.getElementById('layout')
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className={classNames(styles.productImages__thumbnail)}
                >
                  <img src={image.path} alt={data.product.name} />
                </motion.div>
              ))}
            </div>

            <div className={classNames(styles.productImages__main, 'col')}>
              {data.product.assets && (
                <img
                  src={data.product.assets[activeImage]?.path}
                  alt={data.product.name}
                />
              )}
            </div>
          </div>
        </div>

        <div className="col-6 ps-6 py-9">
          <Heading level={1} size="md" className={styles.productName}>{data.product.name}</Heading>

          <div className="d-flex gap-1 align-items-center mb-2">
            <Rating rating={data.product.rating} size={25} />
            <Paragraph size="md" color="secondary" className="m-0">({data.product.reviews?.length})</Paragraph>
          </div>

          <div className="d-flex gap-1 aling-items-center">
            <Paragraph size="md" color="secondary" className="m-0">Color:</Paragraph>
          </div>

          <Paragraph size="md" color="primary" className={styles.productPrice}>${data.product.price}</Paragraph>

          <div className="d-flex gap-1 align-items-center mb-2">
            <Paragraph size="md" color="secondary" className="m-0">Quantity:</Paragraph>
            <Counter
              defaultValue={1}
              onChange={(value) => {
                console.warn('value', value)
                setQuantity(value)
              }}
              min={1}
              max={data.product.quantity}
            />
            <Button
              fullWidth={false}
              onClick={() => dispatch(addProductToCart({
                quantity,
                color: data.product.colors?.at(0),
                size: data.product.sizes?.at(0),
                product: data.product as Product,
              }))}
              className="ms-2"
            >
              Add to cart
            </Button>
          </div>

          <div className="d-flex gap-1 align-items-center mb-2">
            <Paragraph size="md" color="secondary" className="m-0">Size:</Paragraph>
            <Dropdown
              onChange={(value) => console.log(value)}
              defaultValue={data.product.sizes?.[0] ? {
                value: data.product.sizes?.[0].id,
                label: data.product.sizes?.[0].value,
              } : undefined}
              options={
                data.product.sizes?.map((size) => ({
                  value: size.id,
                  label: size.value,
                })) || []
              }
            />
          </div>

          <Paragraph size="md" color="gray" className={styles.productDescription}>{data.product.description}</Paragraph>

          <div className={classNames(styles.productShare, 'd-flex', 'gap-1', 'align-items-center', 'mb-4')}>
            <Paragraph size="md" color="secondary" className="m-0">Share:</Paragraph>
            <div className="d-flex gap-2">
              <Link to="http://facebook.com/" target="_blank">
                <AiFillFacebook />
              </Link>

              <Link to="http://instragram.com/" target="_blank">
                <AiFillInstagram />
              </Link>

              <Link to="http://twitter.com/" target="_blank">
                <AiOutlineTwitter />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <section className={styles.productOverview}>
        <div className="container pt-20 pb-10">
          <Tabs
            contentClassName={classNames(styles.productOverview__content, 'mt-7')}
            tabs={[
              {
                title: 'Description',
                content: <p dangerouslySetInnerHTML={{ __html: data.product.description }} />,
              },
              {
                title: 'Reviews',
                content: (
                  <Carousel
                    slides={
                      data.product.reviews?.map((review) => ({
                        id: review.id,
                        thumbnail: review.user?.fullName,
                        render: <p className="text-center py-3">{review.content}</p>,
                      })) || []
                    }
                    showThumbnail={false}
                    autoPlay
                  />
                ),
              },
              ...(data.product.videoURL
                ? [
                  {
                    title: 'Video',
                    content: (
                      <Player autoPlay>
                        <source src={data.product.videoURL} />
                      </Player>
                    ),
                  }
                ]
                : []
              )
            ]}
          />
        </div>
      </section>

      <section className={classNames(styles.similarProducts, 'container', 'row', 'mb-10')}>
        <Heading level={3} size="lg" className="mb-5">Related Products</Heading>

        <div className="row">
          {(similarProducts?.search ?? [])
            .map((similarProduct) => (
              <div className="col-3" key={`product-${similarProduct.id}`}>
                <ProductCard
                  isLoading={similarProductsLoading}
                  product={similarProduct}
                  mode="grid"
                />
              </div>
            ))
          }
        </div>
      </section>
    </React.Fragment>
  )
}

export default ProductDetail

