import React from 'react'
import classNames from 'classnames'
import styles from './button.module.scss'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  soft?: boolean
  rounded?: boolean
  fullWidth?: boolean
  transparent?: boolean
  className?: string
}

const Button: React.FC<Props> = ({
  children,
  className,
  soft,
  rounded,
  fullWidth,
  transparent,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classNames(
        styles.button,
        {
          [styles.soft]: soft,
          [styles.large]: !soft,
          [styles.rounded]: rounded,
          [styles.fullWidth]: fullWidth,
          [styles.transparent]: transparent,
          [className ?? '']: className,
        },
      )}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
  soft: false,
  rounded: true,
  fullWidth: true,
}

export default Button
