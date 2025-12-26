import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { SectionHeader } from "../SectionHeader";
import { EnhancedDatePicker } from "../EnhancedDatePicker";
import { EnhancedTimePicker } from "../EnhancedTimePicker";
import { SelectField } from "../SelectField";
import { NumberInput } from "../NumberInput";
import { CheckboxField } from "../CheckboxField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, DollarSign, IndianRupee } from "lucide-react";

interface Step1Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: any;
  tradeType: string;
  calculatedPnL: string;
}

export function Step1BasicInfo({ register, watch, setValue, errors, tradeType, calculatedPnL }: Step1Props) {
  const tradeTypeOptions = [
    { value: "CRYPTO", label: "Crypto" },
    { value: "STOCK", label: "Stock" },
    { value: "FUTURES", label: "Futures" },
    { value: "OPTIONS", label: "Options" },
    { value: "FUNDED_ACCOUNT", label: "Funded Account" },
  ];

  const tradeDirectionOptions = [
    { value: "BUY_LONG", label: "📈 Buy/Long" },
    { value: "SELL_SHORT", label: "📉 Sell/Short" },
  ];

  const emotionalStateOptions = [
    { value: "CONFIDENT", label: "😎 Confident" },
    { value: "FEARFUL", label: "😰 Fearful" },
    { value: "GREEDY", label: "🤑 Greedy" },
    { value: "ANXIOUS", label: "😟 Anxious" },
    { value: "NEUTRAL", label: "😐 Neutral" },
    { value: "EXCITED", label: "🤩 Excited" },
    { value: "FRUSTRATED", label: "😤 Frustrated" },
  ];

  const optionTypeOptions = [
    { value: "CALL", label: "Call" },
    { value: "PUT", label: "Put" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<BarChart3 />}
        title="Basic Trade Information"
        description="Enter the core details of your trade"
        color="blue"
        tooltip="This information is required to record your trade"
      />

      {/* Date & Time Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EnhancedDatePicker
          value={watch("tradeDate")}
          onChange={(value) => setValue("tradeDate", value)}
          label="Trade Date"
          error={errors.tradeDate?.message as string}
          required
        />
        
        <EnhancedTimePicker
          value={watch("entryTime")}
          onChange={(value) => setValue("entryTime", value)}
          label="Entry Time"
          error={errors.entryTime?.message as string}
          required
        />
        
        <EnhancedTimePicker
          value={watch("exitTime")}
          onChange={(value) => setValue("exitTime", value)}
          label="Exit Time"
          error={errors.exitTime?.message as string}
          required
        />
      </div>

      {/* Instrument & Type Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="instrument">
            Instrument <span className="text-red-500">*</span>
          </Label>
          <Input
            id="instrument"
            {...register("instrument")}
            placeholder="e.g., BTCUSD, AAPL, NIFTY"
            className="h-12"
          />
          {errors.instrument && (
            <p className="text-sm text-red-600">{errors.instrument.message as string}</p>
          )}
        </div>

        <SelectField
          label="Trade Type"
          value={watch("tradeType")}
          onChange={(value) => setValue("tradeType", value)}
          options={tradeTypeOptions}
          error={errors.tradeType?.message as string}
          required
        />
      </div>

      {/* Direction & Option Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Trade Direction"
          value={watch("tradeDirection")}
          onChange={(value) => setValue("tradeDirection", value)}
          options={tradeDirectionOptions}
          error={errors.tradeDirection?.message as string}
          required
        />

        {tradeType === "OPTIONS" && (
          <SelectField
            label="Option Type"
            value={watch("optionType")}
            onChange={(value) => setValue("optionType", value)}
            options={optionTypeOptions}
            error={errors.optionType?.message as string}
            required
          />
        )}
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 space-y-6">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Pricing & Position
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NumberInput
            label="Average Buy Price"
            value={watch("avgBuyPrice")}
            onChange={(value) => setValue("avgBuyPrice", value === '' ? 0 : parseFloat(value))}
            error={errors.avgBuyPrice?.message as string}
            required
            step="0.01"
          />
          
          <NumberInput
            label="Average Sell Price"
            value={watch("avgSellPrice")}
            onChange={(value) => setValue("avgSellPrice", value === '' ? 0 : parseFloat(value))}
            error={errors.avgSellPrice?.message as string}
            required
            step="0.01"
          />
          
          <NumberInput
            label="Position Size"
            value={watch("positionSize")}
            onChange={(value) => setValue("positionSize", value === '' ? 0 : parseFloat(value))}
            error={errors.positionSize?.message as string}
            required
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Leverage"
            value={watch("leverage")}
            onChange={(value) => setValue("leverage", value === '' ? 1 : parseFloat(value))}
            error={errors.leverage?.message as string}
            step="0.1"
          />

          <div className="space-y-2">
            <Label>Currency</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setValue("baseCurrency", "INR")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  watch("baseCurrency") === "INR"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <IndianRupee className="h-5 w-5" />
                INR
              </button>
              <button
                type="button"
                onClick={() => setValue("baseCurrency", "USD")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  watch("baseCurrency") === "USD"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                USD
              </button>
            </div>
          </div>
        </div>

        {/* Calculated P&L Display */}
        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Calculated P&L:</span>
            <span className={`text-2xl font-bold font-mono ${
              parseFloat(calculatedPnL) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {watch("baseCurrency") === "INR" ? "₹" : "$"}{calculatedPnL}
            </span>
          </div>
        </div>
      </div>

      {/* Emotional State */}
      <div className="space-y-4">
        <SelectField
          label="Emotional State"
          value={watch("emotionalState")}
          onChange={(value) => setValue("emotionalState", value)}
          options={emotionalStateOptions}
          error={errors.emotionalState?.message as string}
          required
        />

        <CheckboxField
          label="This was an impulsive trade"
          checked={watch("isImpulsive")}
          onChange={(checked) => setValue("isImpulsive", checked)}
        />
      </div>
    </div>
  );
}
