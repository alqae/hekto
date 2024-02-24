import React from 'react'
import classNames from 'classnames'
import { Player } from 'video-react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import styles from './Product.module.scss'
import { Link, useParams } from 'react-router-dom'
import ReactImageMagnify from 'react-image-magnify'
import { AiFillInstagram, AiOutlineTwitter, AiFillFacebook } from 'react-icons/ai'

import { Product, useFindProductByIdQuery, useSearchQuery } from '@graphql'
import ColorRadio from '@components/ProductCard/components/ColorRadio'
import { addProductToCart } from '@store/reducers'
import ImageViewer from '@components/ImageViewer'
import ProductCard from '@components/ProductCard'
import Paragraph from '@components/Paragraph'
import Carousel from '@components/Carousel'
import Dropdown from '@components/Dropdown'
import Heading from '@components/Heading'
import Counter from '@components/Counter'
import NoMatch from '@components/NoMatch'
import Loader from '@components/Loader'
import Button from '@components/Button'
import { AppDispatch } from '@store'
import Tabs from '@components/Tabs'
import Rate from '@components/Rate'

interface AddToCartForm {
  quantity: number
  size: number
  color: number
}

interface ProductDetailProps { }

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { id } = useParams() as { id: string }
  const [activeImage, setActiveImage] = React.useState(0)
  const [showImageViewer, setShowImageViewer] = React.useState(false)
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

  const { setValue, watch, handleSubmit } = useForm<AddToCartForm>({
    defaultValues: {
      quantity: 1,
      size: data?.product.sizes?.[0].id,
      color: data?.product.colors?.[0].id,
    }
  })

  const selectedColor = watch('color', data?.product.colors?.[0].id)

  const handleAddToCart = ({ color, quantity, size }: AddToCartForm) => {
    dispatch(addProductToCart({
      quantity,
      product: data?.product as Product,
      size: data?.product.sizes?.find((productSize) => productSize.id === size),
      color: data?.product.colors?.find((productColor) => productColor.id === color),
    }))
  }

  if (loading) {
    return <Loader />
  }

  if (!data || !data.product) {
    return <NoMatch />
  }

  return (
    <>
      <ImageViewer
        images={data.product.assets}
        show={showImageViewer}
        onClose={() => setShowImageViewer(false)}
      />

      <motion.section
        viewport={{ once: true }}
        initial={{ opacity: 0, y: '-100%' }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className={classNames(styles.productDetails, 'container', 'row')}
      >
        <div className="col-6">
          <div className={classNames(styles.productImages, 'row')}>
            <div className={classNames(styles.productImages__thumbnails, 'col-auto', 'p-0')}>
              {data.product.assets?.map((image, index) => index !== activeImage && (
                <motion.div
                  key={index}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveImage(index)}
                  className={classNames(styles.productImages__thumbnail)}
                >
                  <img src={image.path} alt={data.product.name} />
                </motion.div>
              ))}
            </div>

            <div className={classNames(styles.productImages__main, 'col')} onClick={() => setShowImageViewer(true)}>
              {data.product.assets && (
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: data.product.name,
                      isFluidWidth: true,
                      src: data.product.assets[activeImage]?.path,
                    },
                    largeImage: {
                      src: data.product.assets[activeImage]?.path,
                      width: 1000,
                      height: 1000,
                    },
                    enlargedImageContainerStyle: {
                      zIndex: 9999,
                    },
                    enlargedImageContainerDimensions: {
                      width: '200%',
                      height: '100%',
                    },
                    isHintEnabled: true,
                    shouldHideHintAfterFirstActivation: false,
                    enlargedImagePosition: 'over',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <form className="col-6 ps-6 py-9" onSubmit={handleSubmit(handleAddToCart)}>
          <Heading level={1} size="md" className={styles.productName}>{data.product.name}</Heading>

          <div className="d-flex gap-1 align-items-center mb-2">
            <Rate value={data.product.rating ?? 0} />
            <Paragraph size="md" color="secondary" className="m-0">({data.product.reviews?.length})</Paragraph>
          </div>

          <div className="d-flex gap-1 align-items-center">
            <Paragraph size="md" color="secondary" className="m-0">Color:</Paragraph>
            {data.product.colors?.map((color) => (
              <ColorRadio
                key={color.id}
                value={selectedColor === color.id}
                name={`color-${color.id}`}
                color={color.value}
                onChange={() => setValue('color', color.id)}
              />
            ))}
          </div>

          <Paragraph size="md" color="primary" className={styles.productPrice}>${data.product.price}</Paragraph>

          <div className="d-flex gap-1 align-items-center mb-2">
            <Paragraph size="md" color="secondary" className="m-0">Quantity:</Paragraph>
            <Counter
              min={1}
              defaultValue={1}
              max={data.product.quantity}
              onChange={(value) => setValue('quantity', value)}
            />
            <Button fullWidth={false} type="submit" className="ms-2">
              Add to cart
            </Button>
          </div>

          <div className="d-flex gap-1 align-items-center mb-2">
            <Paragraph size="md" color="secondary" className="m-0">Size:</Paragraph>
            <Dropdown
              onChange={(value) => setValue('size', parseInt(value.value))}
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
        </form>
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
                  product={similarProduct as Product}
                  mode="grid"
                />
              </div>
            ))
          }
        </div>
      </section>
    </>
  )
}

export default ProductDetail

