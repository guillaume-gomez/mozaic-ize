import React from 'react';

interface RangeProps {
  label: string;
  value: number;
  min: value;
  max:value
  step?: number
  onChange: (newValue: number) => void;
}

function Range({label, onChange, value, min, max, step = 1} : RangeProps) {
  
  return (
    <div className="flex flex-col gap-3">
      <label>
        {label}
        <input
          step={step}
          min={min}
          max={max}
          type="range"
          onChange={(e) => { onChange(parseInt(e.target.value)) }}
        />
      </label>
      <span>{value}</span>
    </div>
  );
}

export default Range;