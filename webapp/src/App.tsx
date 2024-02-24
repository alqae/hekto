import React from 'react'
import { Toaster } from 'react-hot-toast'
// import { ScrollRestoration } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route,
} from 'react-router-dom'

import NoMatch from '@components/NoMatch'
import Layout from '@components/Layout'
import Fallback from '@components/Fallback'
import FormLayout from '@components/FormLayout'
import {
  Home,
  About,
  Shop,
  Contact,
  SignUp,
  SignIn,
  ForgotPassword,
  Faq,
  Product,
  ShoppingCart,
} from './pages'

// Import global styles
import './styles/globals.scss'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* <ScrollRestoration /> */}

      <Route path="auth" element={<FormLayout />}>
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="forgot" element={<ForgotPassword />} />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<Product />} />
        <Route path="shop/cart" element={<ShoppingCart />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<Faq />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <>
      <Toaster containerClassName="toast" />
      <AnimatePresence>
        <RouterProvider router={router} fallbackElement={<Fallback />} />
      </AnimatePresence>
    </>
  )
}

export default App
