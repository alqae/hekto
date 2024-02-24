import React from 'react'
import currency from 'currency.js'
import classNames from 'classnames'
import Skeleton from 'react-loading-skeleton'
import styles from './ProductCard.module.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { AiFillHeart, AiOutlineHeart, AiOutlineZoomIn } from 'react-icons/ai'
import { MdOutlineAddShoppingCart, MdOutlineRemoveShoppingCart } from 'react-icons/md'

import { AppDispatch, RootState } from '@store'
import ColorRadio from './components/ColorRadio'
import { Color, Product } from '@graphql'
import ImageViewer from '../ImageViewer'
import ButtonIcon from '../ButtonIcon'
import Paragraph from '../Paragraph'
import Heading from '../Heading'
import Rate from '../Rate'
import {
  addProductToCart,
  addProductToWhiteList,
  removeProductFromCart,
  removeProductFromWhiteList,
} from '@store/reducers'

export interface ProductCardProps {
  product: Product
  className?: string
  mode: 'grid' | 'row'
  isLoading?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className, mode, isLoading }) => {
  const [showInPreview, setShowInPreview] = React.useState(false)
  const [selectedColor, setSelectedColor] = React.useState<Color | undefined>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const isProductOnCart = useSelector<RootState, boolean>((state) =>
    !!state.shared.shoppingCart.find(({ product: { id } }) => id === product.id)
  )
  const isProductOnWishlist = useSelector<RootState, boolean>((state) =>
    !!state.shared.whiteList.find(({ id }) => id === product.id)
  )

  React.useEffect(() => {
    setSelectedColor(product.colors?.at(0))
  }, [product])

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
      ? removeProductFromCart(product.id)
      : addProductToCart({ product, quantity: 1, size: product.sizes?.at(0), color: selectedColor })
  )

  const isGrid = mode === 'grid'
  const isRow = mode === 'row'

  const totalColors = product.colors?.length ?? 0

  if (isLoading) {
    if (isRow) {
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
    } else if (isGrid) {
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

  const goToDetail = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();

    if (event.target === event.currentTarget) {
      navigate(`/shop/${product.id}`)
    }
  };

  const lineClasses = classNames(
    'mb-1',
    'gap-1',
    'd-inline-flex',
    'align-items-center',
    'justify-content-center',
  )

  return (
    <>
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
        onClick={goToDetail}
      >
        <LazyLoadImage
          placeholder={<Skeleton width="100%" height="100%" />}
          src={product.thumbnail?.path}
          className="card-img-top"
          wrapperClassName={classNames({ 'col-4': isRow })}
          onClick={goToDetail}
          alt={product.name}
          effect="blur"
        />

        <div className={classNames({ 'col-8': isRow })} onClick={goToDetail}>
          <div
            className={classNames('card-body', { 'text-center d-flex flex-column align-ite d-flex flex-column align-items-center': isGrid, 'p-0 pt-3': isRow })}
            onClick={goToDetail}
          >
            {isGrid && (
              <>
                <div className={lineClasses}>
                  <Rate value={product.rating} />
                  <Paragraph size="sm" color="secondary">({product.reviews?.length})</Paragraph>
                </div>
                <div className={lineClasses}>
                  {product.colors?.slice(0, 5).map((color) => (
                    <ColorRadio
                      key={color.id}
                      value={color.value === selectedColor?.value}
                      name={`product-${product.id}-color-${color.id}`}
                      color={color.value}
                      onChange={() => setSelectedColor(color)}
                    />
                  ))}
                  {totalColors > 5 && <Paragraph size="sm" color="secondary">+{totalColors - 5}</Paragraph>}
                </div>
              </>
            )}

            <Heading
              level={4}
              size={isRow ? 'sm' : 'xs'}
              className={classNames('fw-bold', 'm-0'/*, 'd-inline-block'*/)}
            >
              {product.name}
            </Heading>
            {/* <br /> */}
            <Paragraph color="primary" size="md">{currency(product.price).format()}</Paragraph>
            {isRow && (
              <>
                <Rate value={product.rating} />
                <Paragraph color="gray" size="md" className="mb-3 col-11">{product.description}</Paragraph>
              </>
            )}
          </div>

          <div className={classNames('d-inline-flex', 'gap-1', { 'flex-column': isGrid, [styles.actions]: isGrid })}>
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
            <ButtonIcon
              color="secondary"
              onClick={() => setShowInPreview(true)}
              icon={AiOutlineZoomIn}
            />
          </div>
        </div>
      </div>

      <ImageViewer
        images={product.assets}
        show={showInPreview}
        onClose={() => setShowInPreview(false)}
      />
    </>
  )
}

ProductCard.defaultProps = {
  mode: 'grid',
}

export default ProductCard
