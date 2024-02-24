import React from 'react'
import * as Yup from 'yup'
import currency from 'currency.js'
import classNames from 'classnames'
import { faker } from '@faker-js/faker'
import { useForm } from 'react-hook-form'
import { AiOutlineClose } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import styles from './ShoppingCart.module.scss'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'

import ColorRadio from '@components/ProductCard/components/ColorRadio'
import { AppDispatch, RootState } from '@store'
import Paragraph from '@components/Paragraph'
import Counter from '@components/Counter'
import Heading from '@components/Heading'
import Button from '@components/Button'
import Field from '@components/Field'
import {
  ShoppingCartProduct,
  clearShoppingCart,
  removeProductFromCart,
  updateProductQuantity,
} from '@store/reducers'

interface ShippingForm {
  country: string
  state: string
  zipCode: string
}

const shippingFormSchema = Yup.object().shape({
  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string().required('Zip Code is required'),
})

export interface ShoppingCartProps { }

export const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const isAviableShipping = faker.datatype.boolean()
  const products = useSelector<RootState, ShoppingCartProduct[]>((state) => state.shared.shoppingCart)

  const [totals, setTotals] = React.useState([
    {
      id: 1,
      name: 'Subtotal',
      value: products.reduce((acc, { quantity, product }) => acc + product.price * quantity, 0),
    },
    ...(
      isAviableShipping ?
        [
          {
            id: 2,
            name: 'Shipping',
            value: 0,
          },
        ] :
        []
    ),
    {
      id: 3,
      name: 'Total',
      value: products.reduce((acc, { quantity, product }) => acc + product.price * quantity, 0),
    },
  ])

  const { handleSubmit, control } = useForm<ShippingForm>({
    resolver: yupResolver(shippingFormSchema),
    defaultValues: {
      country: '',
      state: '',
      zipCode: '',
    },
  })

  const continueShopping = () => navigate('/shop')

  const onCalculateShipping = (data: ShippingForm) => {
    console.log(data)
  }

  return (
    <section className="container row">
      <div className="col-8">
        {!!products.length ? (
          <>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <td colSpan={2}>
                    <Heading level={4} size="sm" color="secondary">Product</Heading>
                  </td>
                  <td>
                    <Heading level={4} size="sm" color="secondary">Price</Heading>
                  </td>
                  <td>
                    <Heading level={4} size="sm" color="secondary">Size</Heading>
                  </td>
                  <td>
                    <Heading level={4} size="sm" color="secondary">Quantity</Heading>
                  </td>
                  <td>
                    <Heading level={4} size="sm" color="secondary">Total</Heading>
                  </td>
                </tr>
              </thead>

              <tbody>
                {products.map(({ product, quantity, size, color }, index) => (
                  <tr className={styles.productRow} key={product.id}>
                    <td className="py-2" colSpan={2}>
                      <div className={classNames(styles.thumbnail, 'd-flex', 'align-items-center')}>
                        <div className={styles.close} onClick={() => dispatch(removeProductFromCart(product.id))}>
                          <AiOutlineClose />
                        </div>

                        <img src={product.thumbnail?.path} alt={product.name} />

                        <div className="ms-2">
                          <Paragraph color="secondary">{product.name}</Paragraph>
                          <div className="d-flex align-items-center">
                            <Paragraph className="me-1" color="gray">Color:</Paragraph>
                            <ColorRadio
                              className="d-inline-block"
                              color={color?.value}
                              name={product.name}
                              value={true}
                            />
                          </div>
                          <Paragraph color="gray">Size: {size?.value}</Paragraph>
                        </div>
                      </div>
                    </td>
                    <Paragraph as="td" color="secondary">{currency(product.price).format()}</Paragraph>
                    <Paragraph as="td" color="secondary">{size?.value}</Paragraph>
                    <td className={classNames(styles.quantityRow)}>
                      <Counter
                        min={1}
                        max={product.quantity}
                        className="mx-3"
                        defaultValue={quantity}
                        onChange={(value) => dispatch(updateProductQuantity({ quantity: value, index }))}
                      />
                    </td>
                    <Paragraph as="td" color="secondary">{currency(product.price).multiply(quantity).format()}</Paragraph>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-between mt-4">
              <Button fullWidth={false} onClick={continueShopping}>Continue Shopping</Button>
              <Button fullWidth={false} onClick={() => dispatch(clearShoppingCart())}>Clear Cart</Button>
            </div>
          </>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center">
            <Heading level={3} size="sm" color="secondary" className="mb-3">Your Cart is Empty</Heading>
            <Paragraph className="mb-3">You have no items in your shopping cart. Continue shopping to add items to your cart.</Paragraph>
            <div><Button fullWidth={true} onClick={continueShopping}>Continue Shopping</Button></div>
          </div>
        )}
      </div>

      <div className="col-4 text-center">
        {/* <Heading level={3} size="sm" color="secondary" className="mb-3">Cart Totals</Heading>
        <div className={styles.Panel}>
          {totals.map((total) => (
            <div key={total.id} className={classNames(styles.Row, 'd-flex', 'justify-content-between', 'mb-4', 'pb-1')}>
              <Paragraph className="mb-0" color="secondary">{total.name}</Paragraph>
              <Paragraph className="mb-0" color="secondary">${total.value}</Paragraph>
            </div>
          ))}

          <div
            className={classNames(
              styles.shoppingStatus,
              'd-flex',
              'gap-1',
              'align-items-center',
              'mb-3',
              {
                [styles.aviable]: isAviableShipping
              }
            )}
          >
            {isAviableShipping ? <BsFillPatchCheckFill /> : <MdOutlineSmsFailed />}
            <Paragraph size="md" className="mb-0" color="gray">Shipping & taxes calculated at checkout</Paragraph>
          </div>

          <Button>Proceed To Checkout</Button>
        </div> */}

        <Heading level={3} size="sm" color="secondary" className="mt-4 mb-3">Calculate Shopping</Heading>
        <form className={styles.Panel} onSubmit={handleSubmit(onCalculateShipping)}>
          <Field type="text" className="mb-3" control={control} name="country" placeholder="Country" />
          <Field type="text" className="mb-3" control={control} name="state" placeholder="State" />
          <Field type="text" className="mb-3" control={control} name="zipCode" placeholder="Zip Code" />
          <Button fullWidth={false}>Calculate Shiping</Button>
        </form>
      </div>
    </section>
  )
}
