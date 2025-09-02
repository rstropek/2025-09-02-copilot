'use client';

import { useCallback } from 'react';
import styles from './slider.module.css';

export type RobotColor = 'red' | 'blue' | 'green' | 'black' | 'white';

interface ColorSelectorProps {
  label: string;
  value: RobotColor;
  onChange?: (color: RobotColor) => void;
  className?: string;
  disabled?: boolean;
}

const COLOR_OPTIONS: { value: RobotColor; label: string }[] = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
];

export default function ColorSelector({
  label,
  value,
  onChange,
  className = '',
  disabled = false
}: ColorSelectorProps) {
  const handleChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newColor = event.target.value as RobotColor;
    onChange?.(newColor);
  }, [onChange]);

  return (
    <div className={`${styles.sliderContainer} ${className}`}>
      <div className={styles.labelContainer}>
        <label htmlFor={`color-selector-${label}`} className={styles.label}>
          {label}
        </label>
        <span className={styles.value}>
          {COLOR_OPTIONS.find(option => option.value === value)?.label || value}
        </span>
      </div>
      
      <div className={styles.sliderWrapper}>
        <select
          id={`color-selector-${label}`}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={styles.colorSelect}
        >
          {COLOR_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}