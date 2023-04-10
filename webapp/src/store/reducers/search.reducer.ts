import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Product, SearchQuery } from '../../generated/graphql'

interface SearchState {
  hits: Product[]
  loading: boolean
  error: Error | string | unknown
  duration: number
}

const initialState: SearchState = {
  hits: [],
  duration: 0,
  error: null,
  loading: false,
}

export const search = createAsyncThunk<{
  hits: Product[]
  duration: number
} | undefined, {
  name?: string
  maxPrice?: number
  minPrice?: number
  limit?: number
  colors?: number[]
  categories?: number[]
  sortKey?: string
  sortDirection?: string
} | undefined>(
  'search/search',
  async (variables, { dispatch }) => {
    dispatch(setLoading(true))

    try {
      const time1 = performance.now()
      const GRAPHQL_API = import.meta.env.GRAPHQL_URL || 'http://localhost:4000/graphql'
      const response = await fetch(GRAPHQL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query Search(
              $name: String
              $maxPrice: Float
              $minPrice: Float
              $limit: Float
              $colors: [Float!]
              $categories: [Float!]
              $sortKey: String
              $sortDirection: String
            ) {
              search(
                name: $name,
                maxPrice: $maxPrice,
                minPrice: $minPrice,
                limit: $limit,
                colors: $colors,
                categories: $categories,
                sortKey: $sortKey,
                sortDirection: $sortDirection
              ) {
                id
                name
                description
                price
                rating
                categories {
                  id
                  name
                }
                sizes {
                  id
                  value
                }
                colors {
                  id
                  value
                }
                user {
                  id
                  firstName
                  lastName
                  email
                }
                thumbnail {
                  id
                  description
                  path
                  size
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables,
        }),
      })
      const products = await response.json()
      const time2 = performance.now()
      const duration = time2 - time1
      const hits = products.data?.search
      return { hits, duration }
    } catch (error) {
      dispatch(setError(error))
    }
  },
)

const SearchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<SearchState['error']>) {
      state.error = action.payload
    },
    setHits(state, action: PayloadAction<{ hits: Product[]; duration: number }>) {
      state.hits = action.payload.hits
      state.duration = action.payload.duration
    },
  },
  extraReducers: (builder) => {
    builder.addCase(search.fulfilled, (state, action) => {
      if (action.payload) {
        state.loading = false
        state.hits = action.payload.hits
        state.duration = action.payload.duration
      }
    })
  }
})

export const { setLoading, setError, setHits } = SearchSlice.actions
export default SearchSlice.reducer
