import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import authReducer from './reducers/auth.reducer'
import sharedReducer from './reducers/shared.reducer'
import searchReducer from './reducers/search.reducer'

const reducer = combineReducers({
  auth: authReducer,
  shared: sharedReducer,
  search: searchReducer,
})

const middleware = [
  thunk,
  ...(
    import.meta.env.NODE_ENV === 'development' ?
      [
        /* Development middleware */
        logger,
      ] : [
        /* Production middleware */
      ]
  )
]

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'shared'],
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware,
  devTools: import.meta.env.NODE_ENV !== 'production',
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
