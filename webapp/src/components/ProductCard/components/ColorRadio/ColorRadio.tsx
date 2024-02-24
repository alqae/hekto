import React from 'react'
import styles from './ColorRadio.module.scss'

import Paragraph from '@components/Paragraph'
import classNames from 'classnames'

export interface RadioProps {
  className?: string
  value: boolean
  defaultChecked?: boolean
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
  value,
  defaultChecked = false,
  onChange,
  label,
}) => {
  return (
    <label
      htmlFor={name}
      className={
        classNames(
          styles.radio,
          { [styles.checked]: value },
        )
      }
      style={{ borderColor: color }}
    >
      <input
        type="radio"
        id={name}
        name={name}
        defaultChecked={defaultChecked}
        value={value.toString()}
        onChange={onChange}
      />
      <span style={{ backgroundColor: color }} className={styles.checkmark} />
      {label && <Paragraph as="span">{label}</Paragraph>}
    </label>
  )
}

export default ColorRadio
