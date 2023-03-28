import React from 'react'
import classNames from 'classnames'
import styles from './heading.module.scss'

interface HeadingProps {
  level?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'black' | 'primary' | 'secondary' | 'white' | 'navy-blue'
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

const Heading: React.FC<HeadingProps> = ({
  children,
  level,
  size,
  className,
  color,
  onClick,
}) => {
  const TagName = `h${level}` as keyof React.ReactHTML // h1, h2, h3, h4, h5, h6
  return (
    <TagName
      className={classNames({
        [styles[size ?? 'xl']]: size,
        [styles[color ?? 'black']]: color,
        [className ?? '']: className,
      })}
      onClick={onClick}
    >
      {children}
    </TagName>
  )
}

Heading.defaultProps = {
  level: 1,
  size: 'xl',
  color: 'navy-blue',
}

export default Heading
