import React from 'react'
import classNames from 'classnames'
import styles from './Carousel.module.scss'
import { AnimationProps, motion, useDragControls } from 'framer-motion'

import { usePrevious } from '@hooks/usePrevious'

const transition: AnimationProps['transition'] = {
  duration: 0.8,
  ease: [0.43, 0.13, 0.23, 0.96],
}

export interface SlideItem {
  id: string | number
  thumbnail: React.ReactNode
  render: React.ReactNode
}

export interface CarouselProps {
  wrapperThumbnailClassName?: string
  wrapperSlideClassName?: string
  showThumbnail?: boolean
  slides: SlideItem[]
  autoPlay?: boolean
  className?: string
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  wrapperThumbnailClassName,
  wrapperSlideClassName,
  showThumbnail,
  autoPlay,
  className,
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [isHover, setIsHover] = React.useState(false)
  const previousCurrentSlide = usePrevious(currentSlide) ?? 0;
  const controls = useDragControls()

  const loopAutoplay = () => {
    setTimeout(() => {
      if (!isHover) {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(currentSlide + 1)
        } else {
          setCurrentSlide(0)
        }
      }

      return loopAutoplay()
    }, 10000)
  }

  React.useEffect(() => {
    if (autoPlay) {
      loopAutoplay()
    }
  }, [autoPlay, currentSlide, isHover])

  return (
    <div
      className={classNames(styles.carousel, { [className ?? '']: className })}
    >
      {showThumbnail && (
        <div className={classNames(
          styles.carousel__thumbnails,
          { [wrapperThumbnailClassName ?? '']: wrapperThumbnailClassName }
        )}>
          {slides.map((slide, index) => (
            <div key={slide.id} onClick={() => setCurrentSlide(index)}>{slide.thumbnail}</div>
          ))}
        </div>
      )}

      <div className={classNames(styles.carousel__slides, { [wrapperSlideClassName ?? '']: wrapperSlideClassName })}>
        <motion.div
          key={currentSlide}
          drag="x"
          onHoverStart={() => setIsHover(true)}
          onHoverEnd={() => setIsHover(false)}
          draggable
          dragSnapToOrigin
          dragControls={controls}
          onDragEnd={(_, info) => {
            if (info.offset.x > 50 && !!currentSlide) {
              setCurrentSlide(currentSlide - 1);
            } else if (info.offset.x < -50 && currentSlide < slides.length - 1) {
              setCurrentSlide(currentSlide + 1);
            }
          }}
          transition={transition}
          viewport={{ once: true }}
          initial={{ x: currentSlide > previousCurrentSlide ? '-100%' : '100%', opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
        >
          {slides[currentSlide].render}
        </motion.div>
      </div>

      <div className={styles.carousel__controls}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={classNames(
              styles.dot,
              { [styles.current]: index === currentSlide }
            )}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

Carousel.defaultProps = {
  showThumbnail: true,
  autoPlay: false,
}

export default Carousel
