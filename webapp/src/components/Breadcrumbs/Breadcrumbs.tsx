import React from 'react'
import { NavLink } from 'react-router-dom'
import useBreadcrumbs, { BreadcrumbsRoute, BreadcrumbMatch } from 'use-react-router-breadcrumbs'

import styles from './Breadcrumbs.module.scss'

import { useFindProductNameByIdQuery } from '@graphql'
import Heading from '../Heading'

// const userNamesById = { 1: "John" };

// const DynamicUserBreadcrumb = ({ match }: any) => (
//   <span>{userNamesById[match.params.userId]}</span>
// );

const DynamicProductBreadcrumb: React.FC<{ match: BreadcrumbMatch<string> }> = ({ match }) => {
  const { data, loading, error } = useFindProductNameByIdQuery({
    variables: {
      id: parseInt(match.params.id ?? '') ?? NaN,
    }
  })

  if (error) return <span>Error</span>
  if (loading || !data) return <span>Loading...</span>
  return <>{data.product.name}</>
};

// define custom breadcrumbs for certain routes.
// breadcrumbs can be components or strings.
const routes: BreadcrumbsRoute<string>[] = [
  // { path: "/users/:userId", breadcrumb: DynamicUserBreadcrumb },
  { path: '/shop/:id', breadcrumb: DynamicProductBreadcrumb },
  {
    path: '/shop/cart',
    breadcrumb: 'Shopping Cart',
  },
  {
    path: '/about',
    breadcrumb: () => <React.Fragment>About Us</React.Fragment>,
  },
  {
    path: '/contact',
    breadcrumb: () => <React.Fragment>Contact Us</React.Fragment>,
  },
  {
    path: '/faq',
    breadcrumb: () => <React.Fragment>FAQ</React.Fragment>,
  },
  {
    path: '/',
    breadcrumb: () => <React.Fragment>Home</React.Fragment>,
  },
  {
    path: '/auth',
    breadcrumb: () => <React.Fragment>Auth</React.Fragment>,
  },
  {
    path: '/shop',
    breadcrumb: () => <React.Fragment>Shop</React.Fragment>,
  },
  {
    path: '/auth/*',
    breadcrumb: () => <React.Fragment>My Account</React.Fragment>,
  },
  {
    path: '*',
    breadcrumb: () => <React.Fragment>404 Not Found</React.Fragment>,
  }
];

// map & render your breadcrumb components however you want.
const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routes);
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div className={styles.breadcrumbs}>
      <div className="container">
        <Heading level={3} size="md">{lastBreadcrumb.breadcrumb}</Heading>
        <div className={styles.breadcrumbsWrapper}>
          {breadcrumbs.map(({ match, breadcrumb }, index) => (
            <React.Fragment key={match.pathname} >
              <NavLink to={match.pathname} className={styles.breadcrumb}>
                {breadcrumb}
              </NavLink>
              {breadcrumbs.length - 1 !== index && <span>.</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div >
  )
}

export default Breadcrumbs
