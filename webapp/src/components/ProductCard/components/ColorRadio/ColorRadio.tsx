import React from 'react'
import styles from './ColorRadio.module.scss'

import { Paragraph } from '../../../Paragraph'
import classNames from 'classnames'

export interface RadioProps {
  className?: string
  // value?: string | number
  checked: boolean
  disabled?: boolean
  style?: React.CSSProperties
  name: string
  color?: string
  label?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const ColorRadio: React.FC<RadioProps> = ({
  name,
  color,
  checked,
  onChange,
  label,
}) => {
  return (
    <label
      htmlFor={name}
      className={
        classNames(
          styles.radio,
          { [styles.checked]: checked },
        )
      }
      style={{ borderColor: color }}
    >
      <input type="radio" id={name} name={name} checked={checked} onChange={onChange} />
      <span style={{ backgroundColor: color }} className={styles.checkmark} />
      {label && <Paragraph as="span">{label}</Paragraph>}
    </label>
  )
}

export default ColorRadio
