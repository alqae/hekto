import React from 'react'
import classNames from 'classnames'
import styles from './Product.module.scss'
import Rating from 'react-star-review'
import { Player } from 'video-react';
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { MdAdd, MdFacebook, MdRemove } from 'react-icons/md'
import {
  AiFillInstagram,
  AiFillTwitterCircle,
  AiFillYoutube,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineHeart,
  AiOutlineShareAlt,
  AiOutlineShoppingCart,
  AiOutlineTwitter,
} from 'react-icons/ai'

import { Product, useFindProductByIdQuery } from '../../generated/graphql'
import { AppDispatch, RootState } from '../../store'
import { addProductToCart, search } from '../../store/reducers'
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
  // Tabs,
} from '../../components'
import { FaFacebookF } from 'react-icons/fa';

interface Props { }

const ProductDetail: React.FC<Props> = () => {
  const { id } = useParams() as { id: string }
  const [alreadyDispatched, setAlreadyDispatched] = React.useState(false)
  const [activeImage, setActiveImage] = React.useState(0)
  const [quantity, setQuantity] = React.useState(1)
  const dispatch = useDispatch<AppDispatch>()
  const similarProducts = useSelector<RootState, Product[]>((state) => state.search.hits.slice(0, 4))
  const { data, loading } = useFindProductByIdQuery({
    variables: {
      productId: parseInt(id),
    }
  })

  React.useEffect(() => {
    if (!similarProducts.length && !alreadyDispatched) {
      // dispatch(search())
      setAlreadyDispatched(true)
    }
  }, [])

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
                console.warn('value', value);
                setQuantity(value)
              }}
              min={1}
              max={data.product.quantity}
            />
            <Button
              fullWidth={false}
              // onClick={() => addProductToCart(data.product)}
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
                <FaFacebookF />
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
                content: <div dangerouslySetInnerHTML={{ __html: data.product.description }} />,
              },
              {
                title: 'Reviews',
                content: (
                  <Carousel
                    slides={data.product.reviews?.map((review) => ({
                      id: review.id,
                      thumbnail: review.user?.fullName,
                      render: <div className="text-center py-3">{review.content}</div>,
                    })) || []}
                    showThumbnail={false}
                    autoPlay
                  />
                ),
              },
              ...(data.product.description
                ? [
                    {
                      title: 'Video',
                      content: (
                        <Player autoPlay>
                          <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
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

        {similarProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="col-3"
            mode="grid"
          />
        ))}
      </section>
    </React.Fragment>
  )
}

export default ProductDetail

