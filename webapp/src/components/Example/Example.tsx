import React from 'react'
import classNames from 'classnames'
import styles from './Example.module.scss'

interface ExampleProps { }

const Example: React.FC<ExampleProps> = () => {
  return (
    <div className={styles.Example}>
      <span>Example</span>
    </div>
  )
}

Example.defaultProps = { }

export default Example
