import React from 'react'
import classNames from 'classnames'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { Control, Controller, RegisterOptions } from 'react-hook-form'

import styles from './field.module.scss'

interface Props {
  type: React.HTMLInputTypeAttribute
  name: string
  label?: string
  placeholder?: string
  min?: number
  max?: number
  rules?: Omit<RegisterOptions<any, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined
  control: Control<any, any>
  suffixIcon?: React.ReactNode
  preffixIcon?: React.ReactNode
  className?: string
  showErrorMessage?: boolean
  showErrorIcon?: boolean
}

const Field: React.FC<Props> = ({
  type,
  name,
  label,
  placeholder,
  control,
  suffixIcon,
  preffixIcon,
  rules,
  className,
  showErrorMessage,
  showErrorIcon,
}) => {
  switch (type) {
    default: // Text, number
      return (
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { name, onBlur, onChange, ref, value }, fieldState: { error }, formState: { defaultValues }, }) => {
            const props = {
              placeholder: `${placeholder}${rules?.required ? '*' : ''}`,
              onChange,
              defaultValue: defaultValues ? defaultValues[name] : '',
              onBlur,
              id: name,
              name,
              ref,
            }
            
            return (
              <div className={classNames(
                styles.field,
                {
                  [styles.error]: error,
                  [styles[type]]: styles[type],
                }
              )}>
                {label && (
                  <label htmlFor={name}>
                    {label}{rules?.required ? '*' : ''}
                  </label>
                )}

                <div className={classNames(styles.inputWrapper, { [className ?? '']: className })}>
                  {suffixIcon && <div className={classNames(styles.suffixIcon)}>{suffixIcon}</div>}
                  {type === 'textarea' ? (
                    <textarea rows={4} {...props} />
                  ) : (
                    <input {...props} type={type} max={rules?.max?.toString()} />
                  )}
                  {(preffixIcon && !error) && <div className={classNames(styles.preffixIcon)}>{preffixIcon}</div>}
                  {error && showErrorIcon && <AiOutlineExclamationCircle className={styles.preffixIcon} />}
                  {error && showErrorMessage && <div className={styles.errorMessage}>{error?.message}</div>}
                </div>
              </div>
            )
          }
          }
        />
      );
  }
}

Field.defaultProps = {
  type: 'text',
  placeholder: '',
  label: '',
  name: '',
  rules: {},
  suffixIcon: null,
  showErrorMessage: true,
  showErrorIcon: true,
}

export default Field
