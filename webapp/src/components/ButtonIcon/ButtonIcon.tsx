import React from 'react'
import classNames from 'classnames'
import { IconType } from 'react-icons'
import styles from './ButtonIcon.module.scss'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends HTMLMotionProps<'button'> {
  icon: IconType
  size?: number
  color?: 'primary' | 'secondary' | 'tertiary'
  transparent?: boolean
}

const ButtonIcon: React.FC<ButtonProps> = ({
  icon: Icon,
  size,
  color,
  transparent,
  className,
  ...props
}) => {
  return (
    <motion.button
      className={classNames(
        styles.buttonIcon,
        {
          [styles[color ?? 'primary']]: color,
          [className ?? '']: className,
          [styles.transparent]: transparent
        }
      )}
      {...props}
    >
      <Icon size={size} />
    </motion.button>
  )
}

ButtonIcon.defaultProps = {
  size: 24,
  color: 'primary',
  transparent: false,
}

export default ButtonIcon
