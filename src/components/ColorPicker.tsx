import { throttle } from "lodash";
import { useCallback } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

function ColorPicker({ value, onChange, label }: ColorPickerProps) {

  const throttleOnChangeInputColor = useCallback(throttle(onChangeInputColor, 500), []);

  function onChangeInputColor(color: string) {
    onChange(color)
  }
	
	return (
  	<div className="form-control flex flex-col">
      <label>{label}</label>
      <input
        type="color"
        className="w-15 h-10 border-0 m-0"
        value={value}
        onChange={(e) => throttleOnChangeInputColor(e.target.value)}
      />
    </div>
  );
}

export default ColorPicker;