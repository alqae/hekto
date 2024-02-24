import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { FaFacebookF } from 'react-icons/fa'
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai'

import styles from './Footer.module.scss'

import Logo from '../Logo'

export interface FooterProps { }

const Footer: React.FC<FooterProps> = () => (
  <footer>
    <div className={styles.footer}>
      <div className="container row mx-auto">
        <div className="col-4">
          <Logo />

          <form className={styles.subscribe}>
            <div className={styles.subscribe__field}>
              <input type="email" placeholder="Enter Email Address" />
            </div>
            <div>
              <button type="submit">Sign Up</button>
            </div>
          </form>
        </div>

        <div className={classNames(styles.footer__menu, 'col')}>
          <h5 className="mb-5">Catagories</h5>
          <Link to="#">Laptops & Computers</Link>
          <Link to="#">Cameras & Photography</Link>
          <Link to="#">Smart Phones & Tablets</Link>
          <Link to="#">Video Games & Consoles</Link>
          <Link to="#">Waterproof Headphones</Link>
        </div>

        <div className={classNames(styles.footer__menu, 'col')}>
          <h5 className="mb-5">Customer Care</h5>
          <Link to="#">My Account</Link>
          <Link to="#">Discount</Link>
          <Link to="#">Returns</Link>
          <Link to="#">Orders History</Link>
          <Link to="#">Order Tracking</Link>
        </div>

        <div className={classNames(styles.footer__menu, 'col')}>
          <h5 className="mb-5">Pages</h5>
          <Link to="#">Blog</Link>
          <Link to="#">Browse the Shop</Link>
          <Link to="#">Category</Link>
          <Link to="#">Pre-Built Pages</Link>
          <Link to="#">Visual Composer Elements</Link>
          <Link to="#">WooCommerce Pages</Link>
        </div>
      </div>
    </div>

    <div className={styles.copyright}>
      <div className="container d-flex justify-content-between align-items-center py-2">
        <span>©Webecy - All Rights Reserved</span>

        <div className="d-flex gap-2">
          <Link to="http://facebook.com/" target="_blank">
            <FaFacebookF />
          </Link>

          <Link to="http://instragram.com/" target="_blank">
            <AiFillInstagram />
          </Link>

          <Link to="http://twitter.com/" target="_blank">
            <AiOutlineTwitter />
          </Link>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
