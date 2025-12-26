import { useState } from "react";
import { Label } from "@/components/ui/label";

interface NoteInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  required?: boolean;
}

export const NoteInput: React.FC<NoteInputProps> = ({
  label = "Notes",
  value,
  onChange,
  placeholder = "Add any additional notes about this trade...",
  maxLength = 2000,
  error,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value?.length || 0;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <span
          className={`text-xs ${
            isOverLimit
              ? "text-red-500 font-semibold"
              : isNearLimit
              ? "text-yellow-600"
              : "text-gray-500"
          }`}
        >
          {characterCount} / {maxLength}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`flex min-h-[100px] w-full rounded-md border ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2"
            : "border-gray-300"
        } bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all`}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
