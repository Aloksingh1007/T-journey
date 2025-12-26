import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{ value: string; label: string }>;
  label: string;
  placeholder?: string;
  error?: string;
}

export function MultiSelect({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select options',
  error,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const getLabel = (optionValue: string) => {
    return options.find(opt => opt.value === optionValue)?.label || optionValue;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Selected items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {getLabel(item)}
              <button
                type="button"
                onClick={() => removeOption(item)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full px-4 py-3 text-left bg-white border rounded-lg transition-all duration-200',
            'hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            error ? 'border-red-300' : 'border-gray-300',
            value.length === 0 ? 'text-gray-400' : 'text-gray-900'
          )}
        >
          {value.length === 0 ? placeholder : `${value.length} selected`}
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    'w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                    value.includes(option.value) && 'bg-blue-50'
                  )}
                >
                  <span className={cn(
                    value.includes(option.value) ? 'text-blue-700 font-medium' : 'text-gray-700'
                  )}>
                    {option.label}
                  </span>
                  {value.includes(option.value) && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
