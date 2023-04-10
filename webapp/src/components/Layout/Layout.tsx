import React from 'react'
import styles from './layout.module.scss'
import { AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'

import { Breadcrumbs } from '../Breadcrumbs'
import { RootState } from '../../store'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'
import { setToken } from '../../store/reducers'

interface Props {
  children?: React.ReactNode
}

const Layout: React.FC<Props> = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isIndexPage = useMatch('/')
  const token = useSelector<RootState>((state) => state.auth.token)

  React.useEffect(() => {
    if (token) {
      fetch(
        `${import.meta.env.GRAPHQL_URL ?? 'http://localhost:4000'}/refresh`,
        {
          credentials: 'include',
          method: 'POST',
        }
      ).then(res => res.json())
        .then((data: { ok: boolean, token: string }) => {
          if (data.ok && data.token) {
            dispatch(setToken(data.token))
          }
        })
    }
  }, [token, dispatch, navigate])

  return (
    <React.Fragment>
      <Navbar />
        <main>
          {!isIndexPage && <Breadcrumbs />}
          <div className={styles.layout} id="layout">
            <Outlet />
          </div>
        </main>
      <Footer />
    </React.Fragment>
  )
}

export default Layout
