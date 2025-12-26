import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
  required?: boolean;
  id?: string;
}

export function EnhancedDatePicker({
  value,
  onChange,
  label,
  error,
  required = false,
  id,
}: EnhancedDatePickerProps) {
  const inputId = id || `date-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
        
        <input
          id={inputId}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={cn(
            'w-full pl-12 pr-4 py-3',
            'bg-white border rounded-lg transition-all duration-200',
            'hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'text-gray-900 cursor-pointer',
            error ? 'border-red-300' : 'border-gray-300',
            // Custom date input styling
            '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
            '[&::-webkit-calendar-picker-indicator]:opacity-100'
          )}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
