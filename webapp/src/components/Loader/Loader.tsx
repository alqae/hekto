import React from 'react'
import styles from './loader.module.scss'
import { motion, Transition } from 'framer-motion'

interface Props {}

const DotVariants = {
  initial: {
    y: "0%"
  },
  animate: {
    y: "100%"
  }
}

const DotTransition: Transition = {
  duration: 0.5,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "reverse"
}

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2
    }
  },
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

const Loader: React.FC<Props> = () => (
  <div className={styles.wrapper}>
    <motion.div
      className={styles.LoadingContainer}
      variants={ContainerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.span
        className={styles.LoadingDot}
        variants={DotVariants}
        transition={DotTransition}
      />
      <motion.span
        className={styles.LoadingDot}
        variants={DotVariants}
        transition={DotTransition}
      />
      <motion.span
        className={styles.LoadingDot}
        variants={DotVariants}
        transition={DotTransition}
      />
    </motion.div>
  </div>
)

Loader.defaultProps = {}

export default Loader
