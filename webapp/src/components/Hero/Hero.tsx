import React from 'react'
import { motion } from 'framer-motion'
import styles from './hero.module.scss'

import HeroImage from '@assets/images/home/banner-promotional.png'
import Paragraph from '../Paragraph'
import Heading from '../Heading'
import Button from '../Button'

export interface HeroProps {
  variant?: 'home' | 'about'
}

const Hero: React.FC<HeroProps> = () => (
  <motion.div
    viewport={{ once: true }}
    initial={{ y: '-100%' }}
    whileInView={{ y: 0 }}
    transition={{ delay: 0, duration: 0.5 }}
    className={styles.hero}
  >
    <div className="container d-flex align-items-center justify-content-around py-5">
      <div className="col-5">
        <Heading level={4} color="primary" size="sm" className="mb-2">Best Furniture For Your Castle....</Heading>
        <Heading level={1} color="black" size="lg" className="mb-2">New Furniture Collection Trends in 2020</Heading>
        <Paragraph className="fw-bold" size="md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.</Paragraph>
        <Button className="fw-bold" fullWidth={false}>Shop Now</Button>
      </div>

      <div className="col-4">
        <img src={HeroImage} alt="Hero" className="w-100" />
      </div>
    </div>
  </motion.div>
)

Hero.defaultProps = {
  variant: 'home'
}

export default Hero
