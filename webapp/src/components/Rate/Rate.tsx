import React from 'react'
import classNames from 'classnames'
import styles from './Rate.module.scss'
import { AiFillStar } from 'react-icons/ai'

interface RateProps {
  value?: number | null
  count?: number
  enabled?: boolean
  className?: string
  onChange?: (value: number) => void
}

const Rate: React.FC<RateProps> = ({
  count = 5,
  value = 0,
  onChange = () => {},
  className,
  enabled = false,
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  return (
    <div className={classNames(styles.stars, { [className ?? '']: className })}>
      {[...Array(count)].map((_, starIndex) => {
        const ratingValue = starIndex + 1

        return (
          <label
            key={ratingValue}
            htmlFor="rating"
            onMouseEnter={() => enabled && setHoverValue(ratingValue)}
            onMouseLeave={() => enabled && setHoverValue(null)}
          >
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onChange={() => enabled && onChange(ratingValue)}
            />
            <AiFillStar
              className={
                classNames(
                  styles.star,
                  {
                    [styles.active]: ratingValue <= ((value ?? 0) || (hoverValue ?? 0))
                  }
                )
              }
            />
          </label>
        )
      })}
    </div>
  )
}

export default Rate
