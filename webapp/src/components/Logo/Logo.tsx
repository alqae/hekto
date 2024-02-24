import React from 'react'

import styles from './Logo.module.scss'

export interface LogoProps { }

const Logo: React.FC<LogoProps> = () => {
  return <span className={styles.Logo}>Hekto</span>;
}

export default Logo
