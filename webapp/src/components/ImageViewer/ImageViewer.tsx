import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import styles from './ImageViewer.module.scss'
import { MdOutlineCloseFullscreen } from 'react-icons/md'
import { BiArrowToLeft, BiArrowToRight } from 'react-icons/bi'

import { Asset, Maybe } from '@graphql'
import { usePrevious } from '@hooks'

interface ImageViewerProps {
  images: Maybe<Asset[]> | undefined
  show: boolean
  onClose: () => void
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images = [],
  show = false,
  onClose = () => { },
}) => {
  const [currentImage, setCurrentImage] = React.useState(0)
  const previousCurrentImage = usePrevious(currentImage) ?? 0

  if (!images || !show) return null

  const handleNext = () => {
    if (currentImage < images.length - 1) {
      setCurrentImage(currentImage + 1)
    } else if (currentImage === images.length - 1) {
      setCurrentImage(0)
    }
  }

  const handlePrev = () => {
    if (currentImage > 0) {
      setCurrentImage(currentImage - 1)
    } else if (currentImage === 0) {
      setCurrentImage(images.length - 1)
    }
  }

  const handleImageClick = (index: number) => {
    setCurrentImage(index)
  }

  const handleParentClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();

    if (event.target === event.currentTarget) {
      onClose()
    }
  }


  const fromLastToFirstImage = currentImage === 0 && previousCurrentImage === (images.length - 1)
  const fromFirstToLastImage = currentImage === (images.length - 1) && previousCurrentImage === 0

  return ReactDOM.createPortal(
    <motion.div whileInView={{ backdropFilter: 'blur(5px)' }} className="backdrop" onClick={handleParentClick}>
      <motion.div
        whileTap={{ scale: 0.9 }}
        whileInView={{ y: 0 }}
        initial={{ y: -75 }}
        className={styles.close}
        onClick={onClose}
      >
        <MdOutlineCloseFullscreen />
      </motion.div>

      <motion.div
        whileTap={{ scale: 0.9 }}
        whileInView={{ x: 0 }}
        initial={{ x: -100 }}
        className={classNames(styles.arrow, styles.arrowPrev)}
        onClick={handlePrev}
      >
        <BiArrowToLeft />
      </motion.div>

      <motion.div
        className={styles.current}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        key={currentImage}
        initial={{
          x:
            fromLastToFirstImage ? '75%' :
              fromFirstToLastImage ? '-75%' :
                currentImage > previousCurrentImage ? '75%' : '-75%',
          opacity: 0
        }}
      >
        <img
          src={images[currentImage]?.path}
          alt="product"
        />
      </motion.div>

      <motion.div whileInView={{ y: 0 }} initial={{ y: 75 }} className={styles.thumbnails}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.9 }}
            className={classNames(styles.thumbnail, {
              [styles.active]: index === currentImage
            })}
            onClick={() => handleImageClick(index)}
          >
            {/* <img src={image.path} alt="product" /> */}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        whileTap={{ scale: 0.9 }}
        whileInView={{ x: 0 }}
        initial={{ x: 100 }}
        className={classNames(styles.arrow, styles.arrowNext)}
        onClick={handleNext}
      >
        <BiArrowToRight />
      </motion.div>
    </motion.div>,
    document.getElementById('portal') as HTMLElement,
  )
}

export default ImageViewer
