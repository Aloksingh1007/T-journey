import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  id?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  error,
  id,
}) => {
  const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          id={checkboxId}
        />
        <Label htmlFor={checkboxId} className="cursor-pointer">
          {label}
        </Label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
