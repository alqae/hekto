import React from 'react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import styles from './checkbox.module.scss'
// import { Control, Controller, RegisterOptions, UseFormRegister, UseFormRegisterReturn } from 'react-hook-form'

import Paragraph from '../Paragraph'

interface CheckboxProps {
  name: string
  label?: string | React.ReactNode
  // required: boolean
  className?: string
  // control: Control<any, any>
  // defaultValue?: boolean
  // onChange?: ((event: any) => void) | undefined
  customColor?: string
  value?: string | number | readonly string[]
  checked?: boolean
  render: React.ReactNode
  id: string
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  customColor,
  checked,
  className,
  render,
  label,
}) => {
  return (
    <Paragraph
      as="label"
      htmlFor={id}
      className={classNames(
        styles.checkboxWrapper,
        'd-flex',
        'align-items-center',
        'clickable',
        // { [styles.error]: error },
        { [className ?? '']: className },
      )}
    >
      {render}

      <div
        className={classNames(styles.checkbox, { [styles.checked]: checked })}
        style={customColor ? { backgroundColor: customColor, borderColor: customColor } : {}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: checked ? 1 : 0 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            key={checked ? "checked" : "unchecked"}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      {label}
    </Paragraph>
    // <Controller
    //   name={name}
    //   control={control}
    //   rules={{ required, onChange }}
    //   defaultValue={defaultValue}
    //   render={({ field, fieldState: { error } }) => (

    //   )}
    // />
  )
}

Checkbox.defaultProps = {
  // ref: () => {},
  // required: false,
  // name: '',
  // label: '',
  // defaultValue: false,
}

export default Checkbox
