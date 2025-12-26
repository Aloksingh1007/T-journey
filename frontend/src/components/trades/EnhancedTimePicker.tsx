import { useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
  required?: boolean;
  id?: string;
}

export function EnhancedTimePicker({
  value,
  onChange,
  label,
  error,
  required = false,
  id,
}: EnhancedTimePickerProps) {
  const [hours, setHours] = useState(value ? value.split(':')[0] : '09');
  const [minutes, setMinutes] = useState(value ? value.split(':')[1] : '00');
  const inputId = id || `time-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleHoursChange = (newHours: string) => {
    setHours(newHours);
    updateTime(newHours, minutes);
  };

  const handleMinutesChange = (newMinutes: string) => {
    setMinutes(newMinutes);
    updateTime(hours, newMinutes);
  };

  const updateTime = (h: string, m: string) => {
    const time = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    onChange(time);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <div className={cn(
          'flex items-center gap-2 px-4 py-3',
          'bg-white border rounded-lg transition-all duration-200',
          'hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent',
          error ? 'border-red-300' : 'border-gray-300'
        )}>
          <Clock className="h-5 w-5 text-gray-400" />
          
          {/* Hours */}
          <input
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={(e) => handleHoursChange(e.target.value)}
            className="w-12 text-center text-gray-900 focus:outline-none"
            placeholder="HH"
          />
          
          <span className="text-gray-500">:</span>
          
          {/* Minutes */}
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => handleMinutesChange(e.target.value)}
            className="w-12 text-center text-gray-900 focus:outline-none"
            placeholder="MM"
          />

          {/* Quick time buttons */}
          <div className="ml-auto flex gap-1">
            <button
              type="button"
              onClick={() => {
                handleHoursChange('09');
                handleMinutesChange('30');
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              9:30
            </button>
            <button
              type="button"
              onClick={() => {
                handleHoursChange('15');
                handleMinutesChange('30');
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              15:30
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
