import * as React from "react";
import { Label } from "@/components/ui/label";

interface CurrencySelectorProps {
  label?: string;
  value: "INR" | "USD";
  onChange: (value: "INR" | "USD") => void;
  error?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="currency"
            value="INR"
            checked={value === "INR"}
            onChange={(e) => onChange(e.target.value as "INR" | "USD")}
            className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm">INR (₹)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="currency"
            value="USD"
            checked={value === "USD"}
            onChange={(e) => onChange(e.target.value as "INR" | "USD")}
            className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm">USD ($)</span>
        </label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
