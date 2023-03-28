import React from 'react'

import styles from './Logo.module.scss'

export interface LogoProps { }

export const Logo: React.FC<LogoProps> = () => {
  return <span className={styles.Logo}>Hekto</span>;
}
