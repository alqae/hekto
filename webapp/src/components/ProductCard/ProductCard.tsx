import React from 'react'
import classNames from 'classnames'
import Rating from 'react-star-review'
import Skeleton from 'react-loading-skeleton'
import styles from './ProductCard.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { AiFillHeart, AiOutlineHeart, AiOutlineZoomIn } from 'react-icons/ai'
import { MdOutlineAddShoppingCart, MdOutlineRemoveShoppingCart } from 'react-icons/md'

import { AppDispatch, RootState } from '../../store'
import { Product } from '../../generated/graphql'
import { ButtonIcon } from '../ButtonIcon'
import { ColorRadio } from './components'
import { Paragraph } from '../Paragraph'
import { Heading } from '../Heading'
import {
  addProductToCart,
  addProductToWhiteList,
  removeProductFromCart,
  removeProductFromWhiteList,
} from '../../store/reducers'

export interface ProductCardProps {
  product: Product
  className?: string
  mode: 'grid' | 'row'
  isLoading?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className, mode, isLoading }) => {
  const [selectedColor, setSelectedColor] = React.useState<string>(product.colors?.at(0)?.value ?? '')
  const dispatch = useDispatch<AppDispatch>()

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

  const totalColors = product.colors?.length ?? 0

  if (isLoading) {
    switch (mode) {
      case 'row':
        return (
          <div
            className={
              classNames(
                styles.card,
                'card',
                'd-flex',
                'flex-row',
                'p-4',
                'm-0',
                'gap-4',
                { [className ?? '']: className }
              )
            }
          >
            <div className="col-4">
              <Skeleton height={280} />
            </div>
            <div className="card-body col-8">
              <Skeleton height={18} width="50%" />
              <div className="d-flex gap-1">
                <Skeleton width={75} height={20} />  
                <div className="ms-2">
                  <Skeleton width={80} height={20} />  
                </div>
              </div>

              <Skeleton height={20} />
              <Skeleton height={20} />

              <div className="d-flex gap-1">
                <Skeleton circle width={34} height={34} />
                <Skeleton circle width={34} height={34} />
                <Skeleton circle width={34} height={34} />
              </div>
            </div>
          </div>
        )
      //   break;

      default:
        return (
          <div className={classNames(styles.card, 'card', { [className ?? '']: className, })}>
            <Skeleton height={280} />
            <div className="card-body">
              <div className={classNames(styles.noLine, 'd-flex', 'gap-1', 'justify-content-center', 'align-items-center', 'lh-none', 'mb-1')}>
                {new Array(3).fill(0).map((_, i) => <Skeleton key={i} circle width={15} height={15} />)}
              </div>
              <Skeleton height={18} />
              <Skeleton height={20} />
            </div>
          </div>
        )
    }
  }

  return (
    <div
      key={`product-${product.id}-${mode}`}
      className={classNames(
        styles.card,
        'card',
        {
          [className ?? '']: className,
          'd-flex flex-row p-4 m-0 gap-4': isRow,
        }
      )}
    // onClick={() => navigate(`/shop/${product.id}`)}
    // onClick={isGrid ? () => navigate(`/shop/${product.id}`) : undefined}
    >
      <LazyLoadImage
        placeholder={<Skeleton width="100%" height="100%" />}
        src={product.thumbnail?.path}
        className="card-img-top"
        wrapperClassName={classNames({ 'col-4': isRow })}
        alt={product.name}
        effect="blur"
      />

      <div className={classNames({ 'col-8': isRow })}>
        <div className={classNames('card-body', { 'text-center': isGrid, 'p-0 pt-3': isRow })}>
          {isGrid && (
            <div className="d-flex gap-1 justify-content-center align-items-center mb-1">
              {product.colors?.slice(0, 5).map((color) => (
                <ColorRadio
                  key={color.id}
                  checked={color.value === selectedColor}
                  name={`color-${color.id}`}
                  color={color.value}
                  onChange={() => setSelectedColor(color.value)}
                />
              ))}
              {totalColors > 5 && <Paragraph color="black">+{totalColors - 5}</Paragraph>}
            </div>
          )}

          <Heading level={4} size={isRow ? 'sm' : 'xs'} className="fw-bold m-0">{product.name}</Heading>

          <div className={classNames({ 'd-flex gap-2 align-items-center mb-2': isRow })}>
            <Paragraph color="primary" size="md">$ {product.price}</Paragraph>
            {isRow && <Rating size={16} rating={product.rating} />}
          </div>

          {isRow && <Paragraph color="gray" size="md" className="mb-3 col-11">{product.description}</Paragraph>}
        </div>

        <div className={classNames('d-flex', 'gap-1', { 'flex-column': isGrid, [styles.actions]: isGrid })}>
          <ButtonIcon
            color="primary"
            onClick={addToCart}
            icon={isProductOnCart ? MdOutlineRemoveShoppingCart : MdOutlineAddShoppingCart}
          />
          <ButtonIcon
            color="secondary"
            onClick={addToWishlist}
            icon={isProductOnWishlist ? AiFillHeart : AiOutlineHeart}
          />
          <ButtonIcon color="tertiary" onClick={openPreview} icon={AiOutlineZoomIn} />
        </div>
      </div>
    </div>
  )
}

ProductCard.defaultProps = {
  mode: 'grid',
}

export default ProductCard
