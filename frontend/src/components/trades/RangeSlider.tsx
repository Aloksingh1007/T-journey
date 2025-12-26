import { cn } from '@/lib/utils';

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  labels?: { min: string; max: string };
  error?: string;
}

export function RangeSlider({
  value,
  onChange,
  label,
  min = 1,
  max = 10,
  step = 1,
  showValue = true,
  labels,
  error,
}: RangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const getColor = () => {
    if (value <= 3) return 'bg-red-500';
    if (value <= 6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {showValue && (
          <span className={cn(
            'px-3 py-1 rounded-full text-sm font-semibold',
            value <= 3 && 'bg-red-100 text-red-700',
            value > 3 && value <= 6 && 'bg-yellow-100 text-yellow-700',
            value > 6 && 'bg-green-100 text-green-700'
          )}>
            {value}
          </span>
        )}
      </div>

      <div className="relative pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${getColor().replace('bg-', '')} 0%, ${getColor().replace('bg-', '')} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
        
        {/* Value markers */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={cn(
                'w-8 h-8 rounded-full text-xs font-medium transition-all',
                value === num
                  ? 'bg-blue-600 text-white scale-110'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {labels && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>{labels.min}</span>
          <span>{labels.max}</span>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
