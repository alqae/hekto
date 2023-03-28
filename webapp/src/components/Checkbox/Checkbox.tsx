import React from 'react'
import classNames from 'classnames'
import styles from './checkbox.module.scss'
import { Control, Controller } from 'react-hook-form'

interface Props {
  name: string
  label: string | React.ReactNode
  required: boolean
  className?: string
  control: Control<any, any>
  defaultValue?: boolean
  onChange?: ((event: any) => void) | undefined
}

const Checkbox: React.FC<Props> = ({
  name,
  control,
  label,
  required,
  className,
  defaultValue,
  onChange,
}) => (
  <Controller
    name={name}
    control={control}
    rules={{ required, onChange }}
    defaultValue={defaultValue}
    render={({ field, fieldState: { error } }) => (
      <div
        className={classNames(
          styles.checkbox,
          {
            [styles.error]: error,
            [className ?? '']: className,
          },
          'd-flex',
          'align-items-center',
        )}
      >
        <input
          id={name}
          type="checkbox"
          className={classNames({ [styles.checked]: field.value })}
          {...field}
        />
        <label htmlFor={name}>{label}</label>
      </div>
    )}
  />
)

Checkbox.defaultProps = {
  required: false,
  name: '',
  label: '',
  defaultValue: false,
}

export default Checkbox
