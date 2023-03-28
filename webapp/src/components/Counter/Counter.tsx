import { motion } from 'framer-motion';
import React from 'react';

import styles from './Counter.module.scss';

export interface CounterProps {
  onChange: (value: number) => void;
  defaultValue: number;
  max?: number;
  min?: number;
}

export const Counter: React.FC<CounterProps> = ({ max, min, onChange, defaultValue }) => {
  const [value, setMessage] = React.useState(defaultValue ?? 0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value ?? 0);
    setMessage(newValue);
    onChange(newValue);
  };

  React.useEffect(() => {
    setMessage(defaultValue);
  }, [defaultValue]);

  return (
    <div className={styles.Counter}>
      <motion.button
        disabled={value === min}
        onClick={() => onChange(value - 1)}
        whileTap={{scale: 0.95}}
      >
        -
      </motion.button>
      <input
        type="text"
        id="counter"
        name="counter"
        onChange={handleChange}
        value={value}
      />
      <motion.button
        disabled={value === max}
        onClick={() => onChange(value + 1)}
        whileTap={{scale: 0.95}}
      >
        +
      </motion.button>
    </div>
  )
}
