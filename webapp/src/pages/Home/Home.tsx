import React from 'react'

import { Hero, Heading } from '../../components'

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  return (
    <React.Fragment>
      <Hero />
      <section className="container text-center">
        <Heading level={3} size="lg" className="mb-6">Featured Products</Heading>
      </section>
    </React.Fragment>
  )
}

export default Home
