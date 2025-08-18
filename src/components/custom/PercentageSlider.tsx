interface PercentageSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
}

export function PercentageSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  disabled = false,
}: PercentageSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="opacity-70">{label}</label>}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{min}%</span>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          {value}%
        </div>
        <span className="text-sm text-gray-500">{max}%</span>
      </div>
    </div>
  );
}
