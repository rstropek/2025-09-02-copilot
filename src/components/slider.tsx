'use client';

import { useState, useCallback } from 'react';
import styles from './slider.module.css';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export default function Slider({
  label,
  min,
  max,
  step = 1,
  defaultValue,
  value: controlledValue,
  onChange,
  className = '',
  disabled = false
}: SliderProps) {
  // Handle both controlled and uncontrolled usage
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? controlledValue ?? min
  );
  
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    onChange?.(newValue);
  }, [isControlled, onChange]);

  // Calculate percentage for styling
  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className={`${styles.sliderContainer} ${className}`}>
      <div className={styles.labelContainer}>
        <label htmlFor={`slider-${label}`} className={styles.label}>
          {label}
        </label>
        <span className={styles.value}>
          {currentValue.toFixed(step < 1 ? String(step).split('.')[1]?.length || 0 : 0)}
        </span>
      </div>
      
      <div className={styles.sliderWrapper}>
        <input
          id={`slider-${label}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className={styles.slider}
          style={{
            '--slider-percentage': `${percentage}%`
          } as React.CSSProperties}
        />
        
        <div className={styles.track}>
          <div 
            className={styles.fill}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className={styles.rangeLabels}>
          <span className={styles.rangeLabel}>{min}</span>
          <span className={styles.rangeLabel}>{max}</span>
        </div>
      </div>
    </div>
  );
}

// Joint angles interface for the robot arm control
export interface JointAngles {
  j0: number; // yaw
  j1: number; // pitch
  j2: number; // pitch
  j3: number; // pitch
  j4: number; // pitch
}

interface RobotArmControlProps {
  onChange?: (angles: JointAngles) => void;
  className?: string;
  disabled?: boolean;
}

// Robot Arm Control Component with 5 joint sliders
export function RobotArmControl({
  onChange,
  className = '',
  disabled = false
}: RobotArmControlProps) {
  const [angles, setAngles] = useState<JointAngles>({
    j0: 0,   // yaw: 0-360, default 0
    j1: 75,  // pitch: 0-90, default 75
    j2: 45,  // pitch: 0-90, default 45
    j3: 15,  // pitch: 0-90, default 15
    j4: 10   // pitch: 0-90, default 10
  });

  const updateAngle = useCallback((joint: keyof JointAngles, value: number) => {
    const newAngles = { ...angles, [joint]: value };
    setAngles(newAngles);
    onChange?.(newAngles);
  }, [angles, onChange]);

  return (
    <div className={`${styles.robotArmControl} ${className}`}>
      <Slider
        label="J0 (yaw)"
        min={0}
        max={360}
        step={1}
        value={angles.j0}
        onChange={(value) => updateAngle('j0', value)}
        disabled={disabled}
      />
      
      <Slider
        label="J1 (pitch)"
        min={0}
        max={90}
        step={1}
        value={angles.j1}
        onChange={(value) => updateAngle('j1', value)}
        disabled={disabled}
      />
      
      <Slider
        label="J2 (pitch)"
        min={0}
        max={90}
        step={1}
        value={angles.j2}
        onChange={(value) => updateAngle('j2', value)}
        disabled={disabled}
      />
      
      <Slider
        label="J3 (pitch)"
        min={0}
        max={90}
        step={1}
        value={angles.j3}
        onChange={(value) => updateAngle('j3', value)}
        disabled={disabled}
      />
      
      <Slider
        label="J4 (pitch)"
        min={0}
        max={90}
        step={1}
        value={angles.j4}
        onChange={(value) => updateAngle('j4', value)}
        disabled={disabled}
      />
    </div>
  );
}
