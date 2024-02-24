import React from 'react'
import classNames from 'classnames'
import styles from './about.module.scss'
import { AnimationProps, motion } from 'framer-motion'

import AboutImage from '@assets/images/about.png'
import TruckImage from '@assets/images/features/truck.svg'
import CashBackImage from '@assets/images/features/cashback.svg'
import QualityImage from '@assets/images/features/quality.svg'
import SupportImage from '@assets/images/features/support.svg'

import Paragraph from '@components/Paragraph'
import Heading from '@components/Heading'
import Button from '@components/Button'

const transition: AnimationProps['transition'] = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

interface AboutProps { }

const About: React.FC<AboutProps> = () => {
  const features = [
    {
      id: 1,
      image: TruckImage,
      title: 'Free Delivery',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.'
    },
    {
      id: 2,
      image: CashBackImage,
      title: '100% Cash back',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.'
    },
    {
      id: 3,
      image: QualityImage,
      title: 'Quality Product',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.'
    },
    {
      id: 4,
      image: SupportImage,
      title: '24/7 Support',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.'
    }
  ]

  return (
    <>
      <section className={classNames('container', 'd-flex', 'gap-4', 'justify-content-center')}>
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={transition}
          className={classNames(styles.imageCard, 'col-auto')}
        >
          <img src={AboutImage} alt="About" />
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={transition}
          className="col-5"
        >
          <Heading level={3} size="md" className="mb-2">Know About Our Ecomerce Business, History</Heading>
          <Paragraph className="mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices
            mattis aliquam, malesuada diam est. Malesuada sem tristique amet erat vitae
            eget dolor lobortis. Accumsan faucibus vitae lobortis quis bibendum quam.
          </Paragraph>
          <Button fullWidth={false}>Contact us</Button>
        </motion.div>
      </section>

      <section className={classNames('container', 'text-center')}>
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={transition}
          className="mb-8"
        >
          <Heading level={3} size="lg">Our Features</Heading>
        </motion.div>

        <div className="d-flex gap-3 flex-wrap justify-content-between">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              viewport={{ once: true }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={transition}
              whileHover={{ scale: 1.15, cursor: 'pointer' }}
              className={styles.featureCard}
            >
              <img src={feature.image} alt={feature.title} />
              <Heading level={3} size="sm" className="mb-2 my-3">{feature.title}</Heading>
              <Paragraph className="fw-bold m-0">{feature.description}</Paragraph>
            </motion.div>
          ))}
        </div>
      </section>


      <section className={styles.ourClient}>
        <div className="container">
          <Heading level={3} size="lg" className="mb-8 text-center">Our Client Say!</Heading>
          {/* <Carousel wrapperThumbnailClassName="d-flex gap-2" wrapperSlideClassName="col-7 mx-auto" /> */}
        </div>
      </section>
    </>
  )
}


export default About
