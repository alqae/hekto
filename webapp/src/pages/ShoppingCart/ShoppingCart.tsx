import React from 'react'
import * as Yup from 'yup'
import { useTable } from 'react-table'
import { useForm } from 'react-hook-form'
import styles from './ShoppingCart.module.scss'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'

import { ShoppingCartProduct, clearShoppingCart, updateProductQuantity } from '../../store/reducers'
import { Button, Counter, Field, Heading, Paragraph } from '../../components'
import { AppDispatch, RootState } from '../../store'
import { Product } from '../../generated/graphql'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import { MdOutlineSmsFailed } from 'react-icons/md'
import { BsFillPatchCheckFill } from 'react-icons/bs'

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
  const products = useSelector<RootState, ShoppingCartProduct[]>((state) => state.shared.shoppingCart)
  const isAviableShipping = faker.datatype.boolean()
  console.warn('products', products);
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns: [
      {
        Header: 'Product',
      },
      {
        Header: 'Price',
      },
      {
        Header: 'Size',
      },
      {
        Header: 'Quantity',
      },
      {
        Header: 'Total',
      },
    ],
    data: products ?? [],
  })

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
            {/* <table>
              <thead>
                <tr>
                  <td>
                    <Heading level={4} size="sm" color="secondary" className="mt-4 mb-3">Product</Heading>
                  </td>
                  <td>
                    <Heading level={4} size="sm" color="secondary" className="mt-4 mb-3">Price</Heading>
                  </td>
                  <td>
                    <Heading level={4} size="sm" color="secondary" className="mt-4 mb-3">Quantity</Heading>
                  </td>
                  <td>
                    <Heading level={4} size="sm" color="secondary" className="mt-4 mb-3">Total</Heading>
                  </td>
                </tr>
              </thead>
              <tbody>
                {products.map(({ product, quantity }) => (
                  <tr className={styles.productRow} key={product.id}>
                    <td className="py-2 col-5">
                      <div className="d-flex align-items-center">
                        <img src={product.thumbnail?.path} alt={product.name} />

                        <div className="ms-2">
                          <Paragraph className="mb-0" color="secondary">{product.name}</Paragraph>
                          <Paragraph className="mb-0" color="gray">Color: Black</Paragraph>
                          <Paragraph className="mb-0" color="gray">Size: XL</Paragraph>
                        </div>
                      </div>
                    </td>
                    <Paragraph as="td" color="secondary">${product.price}</Paragraph>
                    <td>
                      <Counter
                        min={1}
                        max={product.quantity}
                        defaultValue={quantity}
                        onChange={(quantity) => dispatch(updateProductQuantity({ id: product.id, quantity }))}
                      />
                    </td>
                    <Paragraph as="td" color="secondary">£219.00</Paragraph>
                  </tr>
                ))}
              </tbody>
            </table> */}
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      })}
                    </tr>
                  )
                })}
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
        <Heading level={3} size="sm" color="secondary" className="mb-3">Cart Totals</Heading>
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
        </div>

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
