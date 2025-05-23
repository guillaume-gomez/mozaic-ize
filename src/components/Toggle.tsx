interface ToggleProps {
  label: string;
  value: boolean;
  toggle: () => void;
}

function Toggle({ label, value, toggle } : ToggleProps) {
  return (
    <div className="flex flex-row gap-2">
        <span className="label-text">{label}</span>
        <input type="checkbox" className="toggle toggle-primary" checked={value} onChange={toggle} />
    </div>
  );
}

export default Toggle;