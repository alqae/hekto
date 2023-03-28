import React from 'react'
import classNames from 'classnames'
import styles from './badge.module.scss'
import { Paragraph } from '../Paragraph'

interface Props {
  isActive?: boolean
  className?: string
  children?: React.ReactNode
}

const Badge: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = ({
  isActive,
  children,
  className,
  ...props
}) => (
  <div
    className={classNames(
      styles.badge,
      {
        [styles.active]: isActive,
        [className ?? '']: className,
      }
    )}
    {...props}
  >
    <Paragraph as="span" color={isActive ? 'primary' : 'gray'}>{children}</Paragraph>
  </div>
)

Badge.defaultProps = {}

export default Badge
