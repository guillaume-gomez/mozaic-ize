
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
    <div className="form-control">
      <label>{label}</label>
      <div className="flex flex-row gap-2">
        <input
          step={step}
          min={min}
          max={max}
          type="range"
          className="range range-primary w-full"
          onChange={(e) => { onChange(parseInt(e.target.value)) }}
        />
        <legend className="fieldset-legend badge badge-accent">{value}</legend>
      </div>
    </div>
  );
}

export default Range;