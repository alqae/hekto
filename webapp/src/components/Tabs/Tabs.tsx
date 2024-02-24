import React from 'react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import styles from './Tabs.module.scss'

import { usePrevious } from '@hooks'
import Heading from '../Heading'

export interface TabsProps {
  className?: string
  headerClassName?: string
  contentClassName?: string
  tabs: {
    title: string
    content: React.ReactNode
  }[]
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  className,
  headerClassName,
  contentClassName
}) => {
  const [selectedTab, setSelectedTab] = React.useState(0)
  const previousSelectedTab = usePrevious(selectedTab) ?? 0

  return (
    <div className={classNames(styles.Tabs, { [className ?? '']: className })}>
      <div className={classNames('d-flex', 'gap-10', { [headerClassName ?? '']: headerClassName })}>
        {tabs.map((tab, index) => (
          <Heading
            size="sm"
            level={3}
            key={tab.title}
            color="secondary"
            onClick={() => setSelectedTab(index)}
            className={classNames(styles.Tab, 'm-0', { [styles.active]: index === selectedTab })}
          >
            {tab.title}
          </Heading>
        ))}
      </div>

      <motion.div
        key={selectedTab}
        className={classNames(styles.TabContent, { [contentClassName ?? '']: contentClassName })}
        transition={{ duration: 0.4, ease: 'linear' }}
        animate={{ x: [selectedTab > previousSelectedTab ? 100 : -100, 0], opacity: [0, 1] }}
      >
        {tabs[selectedTab].content}
      </motion.div>
    </div>
  )
}

export default Tabs
