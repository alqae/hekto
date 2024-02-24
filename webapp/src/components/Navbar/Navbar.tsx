import React from 'react'
import classNames from 'classnames'
import { Link, NavLink } from 'react-router-dom'
import { FiPhoneCall } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import {
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineLogout,
} from 'react-icons/ai'
import styles from './Navbar.module.scss'

import Logo from '../Logo'
import { AppDispatch, RootState } from '@store'
import { clearToken } from '@store/reducers'

export type NavbarProps = {}

const Navbar: React.FC<NavbarProps> = () => {
  const isAuthenticated = useSelector<RootState>((state) => !!state.auth.token)
  const dispatch = useDispatch<AppDispatch>()
  const activeRouteProps = {
    className: ({ isActive }: { isActive: boolean }) => classNames({ [styles.active]: isActive })
  }
  return (
    <header>
      <div className={classNames(styles.preferences, 'py-2')}>
        <div className="container d-flex justify-content-between">
          <div className="d-flex gap-6 align-items-center">
            <span className={styles.preferences__email}>
              <AiOutlineMail className="me-1" />
              <a href="mailto:mhhasanul@gmail.com">mhhasanul@gmail.com</a>
            </span>

            <span className={styles.preferences__phone}>
              <FiPhoneCall className="me-1" />
              <a href="tel:(12345)67890">(12345)67890</a>
            </span>
          </div>

          <div className="d-flex gap-2 align-items-center">
            {/* TODO: Add dropdown to select language and currency */}
            <span className={styles.preferences__language}>English</span>
            <span className={styles.preferences__currency}>USD</span>
            {isAuthenticated ? (
              <span onClick={() => dispatch(clearToken())}>Logout<AiOutlineLogout /></span>
            ) : (
              <Link to="/auth/sign-in">Login<AiOutlineUser /></Link>
            )}
            <Link to="/wishlist">Wishlist<AiOutlineHeart /></Link>
            <Link to="/shop/cart"><AiOutlineShoppingCart /></Link>
          </div>
        </div>
      </div>

      <nav className={classNames(
        styles.navbar,
        'container',
        'd-flex',
        'justify-content-between',
        'align-items-center',
      )}>
        <Logo />

        <div className={classNames(styles.navbar__links, 'd-flex', 'gap-4')}>
          <NavLink {...activeRouteProps} to="/">Home</NavLink>
          <NavLink {...activeRouteProps} to="/shop">Shop</NavLink>
          <NavLink {...activeRouteProps} to="/faq">Faq</NavLink>
          <NavLink {...activeRouteProps} to="/about">About</NavLink>
          <NavLink {...activeRouteProps} to="/contact">Contact</NavLink>
        </div>

        <form className={styles.navbar__search}>
          <input type="text" placeholder="Search" />
          <button type="submit"><AiOutlineSearch /></button>
        </form>
      </nav>
    </header>
  );
}

export default Navbar
