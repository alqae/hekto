import React from 'react'
import ReactSlider from 'react-slider'
import styles from './FilterPrice.module.scss'

import { Heading } from '../../../../components'

export interface FilterPriceProps {
  onMinPriceChange: (minPrice: number) => void
  onMaxPriceChange: (maxPrice: number) => void
  maxPrice: number
  minPrice: number
  min: number
  max: number
}

const FilterPrice: React.FC<FilterPriceProps> = ({
  onMinPriceChange,
  onMaxPriceChange,
  maxPrice,
  minPrice,
  min,
  max,
}) => (
  <div className="mb-2 pe-3">
    <Heading level={4} size="sm">Filter By Price</Heading>
    {maxPrice && <ReactSlider
      min={min}
      max={max}
      value={[minPrice, maxPrice]}
      onChange={(value, index) => {
        if (index === 0) {
          onMinPriceChange(value[0])
        } else {
          onMaxPriceChange(value[1])
        }
      }}
      className={styles.slider}
      thumbClassName={styles.thumb}
      trackClassName={styles.track}
      renderThumb={(props, state) => <span {...props}>${state.valueNow}</span>}
    />}
  </div>
)

export default FilterPrice
