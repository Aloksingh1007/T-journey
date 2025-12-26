import * as React from "react";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  id?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  required = false,
  id,
}) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={selectId}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select 
        id={selectId}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        required={required}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
