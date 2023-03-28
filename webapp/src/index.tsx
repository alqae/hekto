import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { onError } from '@apollo/client/link/error'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  Observable,
  Operation,
  from,
  ObservableSubscription
} from '@apollo/client'

import 'video-react/dist/video-react.css'; // import css

import reportWebVitals from './reportWebVitals'
import { store } from './store'
import App from './App'
import { clearToken } from './store/reducers'

const cache = new InMemoryCache()

const request = async (operation: Operation) => {
  const token = localStorage.getItem('token')
  operation.setContext({
    headers: {
      authorization: `Baerer ${token}`
    }
  })
}

const requestLink = new ApolloLink((operation, forward) =>
  new Observable((observer) => {
    let handle: ObservableSubscription
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        })
      })
      .catch(observer.error.bind(observer))

    return () => {
      if (handle) handle.unsubscribe()
    }
  })
)

const client = new ApolloClient({
  connectToDevTools: process.env.NODE_ENV === 'development',
  link: from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        )

      if (networkError) {
        console.log(`[Network error]: ${networkError}`)
        store.dispatch(clearToken())
      }
    }),
    requestLink,
    new HttpLink({
      uri: process.env.GRAPHQL_URL || 'http://localhost:4000/graphql',
      credentials: 'include'
    })
  ]),
  cache,
  resolvers: {
    Mutation: {
      updateNetworkStatus: (_, { isConnected }, { cache }) => {
        cache.writeData({ data: { isConnected } })
        return null
      }
    }
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const persistor = persistStore(store)

root.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </ApolloProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
