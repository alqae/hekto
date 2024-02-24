import React from 'react'
import classNames from 'classnames'
import { motion } from 'framer-motion'

import styles from './Counter.module.scss'

export interface CounterProps {
  onChange: (value: number) => void;
  defaultValue: number;
  max?: number;
  min?: number;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({ max, min, onChange, defaultValue, className }) => {
  const [value, setValue] = React.useState(defaultValue ?? 0);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    onChange(newValue);
  };

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className={classNames(styles.Counter, { [className ?? '']: className })}>
      <motion.button
        disabled={value === min}
        onClick={() => handleChange(value - 1)}
        whileTap={{ scale: 0.95 }}
        type="button"
      >
        -
      </motion.button>
      <input
        type="text"
        id="counter"
        name="counter"
        onChange={(e) => handleChange(parseInt(e.target.value))}
        value={value}
      />
      <motion.button
        disabled={value === max}
        onClick={() => handleChange(value + 1)}
        whileTap={{ scale: 0.95 }}
        type="button"
      >
        +
      </motion.button>
    </div>
  )
}

Counter.defaultProps = {
  onChange: () => { },
  defaultValue: 0,
  max: 999,
  min: 0,
}

export default Counter
