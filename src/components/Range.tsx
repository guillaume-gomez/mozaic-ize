
interface RangeProps {
  label: string;
  value: number;
  min: number;
  max:number
  step?: number
  onChange: (newValue: number) => void;
}

function Range({label, onChange, value, min, max, step = 1} : RangeProps) {
  
  return (
    <div className="fieldset form-control flex flex-col gap-3">
      <legend className="fieldset-legend badge badge-accent">{value}</legend>
      <label>
        {label}
        <input
          step={step}
          min={min}
          max={max}
          type="range"
          className="range range-primary"
          onChange={(e) => { onChange(parseInt(e.target.value)) }}
        />
      </label>
    </div>
  );
}

export default Range;