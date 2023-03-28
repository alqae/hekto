import React from 'react'
import classNames from 'classnames'
import Rating from 'react-star-review'
import { motion } from 'framer-motion'
import styles from './product-card.module.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AiFillHeart, AiOutlineHeart, AiOutlineZoomIn } from 'react-icons/ai'
import { MdOutlineAddShoppingCart, MdOutlineRemoveShoppingCart } from 'react-icons/md'

import { AppDispatch, RootState } from '../../store'
import { Product } from '../../generated/graphql'
import { ButtonIcon } from '../ButtonIcon'
import { Paragraph } from '../Paragraph'
import { Heading } from '../Heading'
import {
  addProductToCart,
  addProductToWhiteList,
  removeProductFromCart,
  removeProductFromWhiteList,
} from '../../store/reducers'

interface Props {
  product: Product
  className?: string
  mode: 'grid' | 'row' | 'preview'
}

const ProductCard: React.FC<Props> = ({ product, className, mode }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const isProductOnCart = useSelector<RootState, boolean>((state) =>
    !!state.shared.shoppingCart.find(({ id }) => id === product.id)
  )
  const isProductOnWishlist = useSelector<RootState, boolean>((state) =>
    !!state.shared.whiteList.find(({ id }) => id === product.id)
  )

  const openPreview = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
  }

  const addToWishlist = () => dispatch(
    isProductOnWishlist
      ? removeProductFromWhiteList(product)
      : addProductToWhiteList(product)
  )

  const addToCart = () => dispatch(
    isProductOnCart
      ? removeProductFromCart(product)
      : addProductToCart(product)
  )

  const isGrid = mode === 'grid'
  const isRow = mode === 'row'
  const isPreview = mode === 'preview'

  return (
    <motion.div
      key={`product-${product.id}-${mode}`}
      className={classNames(
        styles.card,
        {
          [styles.row]: isRow,
          ['row p-4 m-0']: isRow,
          [styles.grid]: isGrid,
          [styles.preview]: isPreview,
          [className ?? '']: className,
          ['justify-content-between']: isPreview,
          'd-flex flex-column': isGrid || isPreview,
        }
      )}
      viewport={{ once: true }}
      initial={{ opacity: 0, y: -100 }}
      whileInView={{ y: 0, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onClick={isGrid ? () => navigate(`/shop/${product.id}`) : undefined}
    >
      <div className={classNames(styles.imageContainer, { 'col me-4 p-0': isRow })}>
        <img src={product.thumbnail?.path} alt={product.name} />
      </div>

      {isGrid && (
        <div className="mt-1 text-center">
          <Heading level={4} size="sm" className="fw-bold m-0">{product.name}</Heading>
          <Paragraph color="primary" size="md">$ {product.price}</Paragraph>
        </div>
      )}

      {isRow && (
        <div className="col">
          <Heading level={4} size="sm" className="fw-bold m-0">{product.name}</Heading>

          <div className="d-flex align-items-center">
            <Paragraph color="primary" size="md" className="m-0 me-2">${product.price}</Paragraph>
            {isRow && <Rating size={16} rating={product.rating} />}
          </div>

          {isRow && (
            <>
              <Paragraph color="gray" className="mb-4 col-12">{product.description}</Paragraph>

              <div className="d-flex gap-3">
                <ButtonIcon
                  color="secondary"
                  onClick={addToCart}
                  icon={isProductOnCart ? MdOutlineRemoveShoppingCart : MdOutlineAddShoppingCart}
                />
                <ButtonIcon
                  color="secondary"
                  onClick={addToWishlist}
                  icon={isProductOnWishlist ? AiFillHeart : AiOutlineHeart}
                />
                <ButtonIcon color="secondary" onClick={openPreview} icon={AiOutlineZoomIn} />
              </div>
            </>
          )}
        </div>
      )}

      {isPreview && (
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Heading level={4} size="sm" className="fw-bold m-0">{product.name}</Heading>
            <div className="mt-1">
              {/* <Rating size={16} rating={product.rating} /> */}
            </div>
          </div>

          <Paragraph color="primary" size="md" className="m-0 me-2">${product.price}</Paragraph>
        </div>
      )}
    </motion.div>
  )
}

ProductCard.defaultProps = {
  mode: 'grid',
}

export default ProductCard
