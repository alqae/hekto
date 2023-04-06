import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Color, Product, Size } from '../../generated/graphql'

export interface ShoppingCartProduct {
  size?: Size
  color?: Color
  quantity: number
  product: Product
}

interface SharedState {
  shoppingCart: ShoppingCartProduct[]
  whiteList: Product[]
  isLoading: boolean
}

const initialState: SharedState = {
  shoppingCart: [],
  whiteList: [],
  isLoading: false,
}

const SharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    addProductToWhiteList(state, action: PayloadAction<Product>) {
      state.whiteList.push(action.payload)
    },
    removeProductFromWhiteList(state, action: PayloadAction<Product>) {
      state.whiteList = state.whiteList.filter((product) => product.id !== action.payload.id)
    },
    addProductToCart(state, action: PayloadAction<ShoppingCartProduct>) {
      state.shoppingCart.push(action.payload)
    },
    removeProductFromCart(state, action: PayloadAction<number>) {
      state.shoppingCart = state.shoppingCart.filter(({ product }) => product.id !== action.payload)
    },
    clearShoppingCart(state) {
      state.shoppingCart = []
    },
    updateProductQuantity(state, action: PayloadAction<{ id: number } & Partial<ShoppingCartProduct>>) {
      // const { id, quantity } = action.payload
      // const productIndex = state.shoppingCart.findIndex((product) => product.id === id)
      // if (productIndex !== -1) {
      //   state.shoppingCart[productIndex]. = quantity
      // }
    }
  },
})

export const {
  addProductToCart,
  addProductToWhiteList,
  removeProductFromCart,
  removeProductFromWhiteList,
  clearShoppingCart,
  updateProductQuantity,
} = SharedSlice.actions
export default SharedSlice.reducer
