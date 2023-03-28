import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Product } from '../../generated/graphql'

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
  query?: string
  maxPrice?: number
  minPrice?: number
  categories?: string[]
  tags?: string[]
} | undefined>(
  'search/search',
  async (variables, { dispatch }) => {
    dispatch(setLoading(true))

    try {
      const time1 = performance.now()
      const GRAPHQL_API = process.env.GRAPHQL_URL || 'http://localhost:4000/graphql'
      const response = await fetch(GRAPHQL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query Search {
              search(limit: 1000) {
                id
                name
                description
                price
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
