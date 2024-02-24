import React from 'react'

import Heading from '@components/Heading'
import Hero from '@components/Hero'

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  return (
    <>
      <Hero />
      <section className="container text-center">
        <Heading level={3} size="lg" className="mb-6">Featured Products</Heading>
      </section>
    </>
  )
}

export default Home
