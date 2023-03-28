import React from 'react'
import { useSelector } from 'react-redux'
import styles from './form-layout.module.scss'
import { Outlet, useNavigate } from 'react-router-dom'

import { Breadcrumbs } from '../Breadcrumbs'
import { RootState } from '../../store'
import { Footer } from '../Footer'
import { Navbar } from '../Navbar'

interface Props {
  children?: React.ReactNode
}

const FormLayout: React.FC<Props> = () => {
  const navigate = useNavigate()
  const token = useSelector<RootState>((state) => state.auth.token)

  React.useEffect(() => {
    if (token) {
      navigate('/', { replace: true })
    }
  }, [token, navigate])

  return (
    <main>
      <header>
        <Navbar />
        <Breadcrumbs />
      </header>

      <div className="container">
        <div className={styles.wrapper}>
          <Outlet />
        </div>
      </div>

      <Footer />
    </main>
  )
}

FormLayout.defaultProps = {}

export default FormLayout
