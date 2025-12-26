import { cn } from '@/lib/utils';

interface CurrencyToggleProps {
  selected: 'INR' | 'USD';
  onChange: (currency: 'INR' | 'USD') => void;
}

export function CurrencyToggle({ selected, onChange }: CurrencyToggleProps) {
  const options: Array<{ value: 'INR' | 'USD'; label: string }> = [
    { value: 'INR', label: 'INR' },
    { value: 'USD', label: 'USD' },
  ];

  return (
    <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
            selected === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
