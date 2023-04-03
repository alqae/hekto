import React from 'react'
import classNames from 'classnames'
import styles from './paragraph.module.scss'

interface ParagraphProps {
  className?: string
  children?: React.ReactNode
  as?: 'p' | 'span' | 'div' | 'li' | 'label' | 'td'
  size?: 'sm' | 'md' | 'lg'
  color?: 'black' | 'primary' | 'secondary' | 'white' | 'gray' | 'sub' | 'danger' | 'success' | 'warning'
  onClick?: () => void
  htmlFor?: string
}

const Paragraph: React.FC<ParagraphProps> = ({
  className,
  children,
  color,
  size,
  as,
  ...props
}) => {
  const TagName = `${as}` as keyof JSX.IntrinsicElements
  return (
    <TagName
      className={
        classNames(
          styles.paragraph,
          {
            [className ?? '']: className,
            [styles[`color-${color}`]]: color,
            [styles[`size-${size}`]]: size,
          },
        )
      }
      {...props}
    >
      {children}
    </TagName>
  )
}

Paragraph.defaultProps = {
  color: 'sub',
  size: 'md',
  as: 'p',
}

export default Paragraph
