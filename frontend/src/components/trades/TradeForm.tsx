import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";
import { SelectField } from "./SelectField";
import { NumberInput } from "./NumberInput";
import { CurrencySelector } from "./CurrencySelector";
import { CheckboxField } from "./CheckboxField";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CreateTradeDTO, TradeType, TradeDirection, OptionType, EmotionalState } from "@/types";

const tradeSchema = z.object({
  tradeDate: z.string().min(1, "Trade date is required"),
  entryTime: z.string().min(1, "Entry time is required"),
  exitTime: z.string().min(1, "Exit time is required"),
  tradeType: z.enum(["CRYPTO", "STOCK", "FUTURES", "OPTIONS", "FUNDED_ACCOUNT"]),
  instrument: z.string().min(1, "Instrument is required"),
  tradeDirection: z.enum(["BUY_LONG", "SELL_SHORT"]),
  optionType: z.enum(["CALL", "PUT"]).optional(),
  avgBuyPrice: z.number().positive("Buy price must be positive"),
  avgSellPrice: z.number().positive("Sell price must be positive"),
  positionSize: z.number().positive("Position size must be positive"),
  leverage: z.number().positive().optional(),
  baseCurrency: z.enum(["INR", "USD"]),
  emotionalState: z.enum(["CONFIDENT", "FEARFUL", "GREEDY", "ANXIOUS", "NEUTRAL", "EXCITED", "FRUSTRATED"]),
  isImpulsive: z.boolean(),
  initialNotes: z.string().optional(),
}).refine((data) => {
  if (data.tradeType === "OPTIONS" && !data.optionType) {
    return false;
  }
  return true;
}, {
  message: "Option type is required for options trades",
  path: ["optionType"],
});

type TradeFormData = z.infer<typeof tradeSchema>;

interface TradeFormProps {
  onSubmit: (data: CreateTradeDTO, screenshots?: File[]) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CreateTradeDTO>;
  mode?: 'create' | 'edit';
}

export const TradeForm: React.FC<TradeFormProps> = ({ onSubmit, isLoading = false, initialData, mode = 'create' }) => {
  const [screenshots, setScreenshots] = useState<File[]>([]);
  
  // Prepare default values based on mode
  const getDefaultValues = (): Partial<TradeFormData> => {
    if (initialData) {
      // Convert ISO date to YYYY-MM-DD format for date input
      const tradeDate = initialData.tradeDate 
        ? new Date(initialData.tradeDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      
      return {
        ...initialData,
        tradeDate,
        leverage: initialData.leverage || 1,
      };
    }
    
    return {
      tradeDate: new Date().toISOString().split("T")[0],
      entryTime: new Date().toTimeString().slice(0, 5),
      exitTime: new Date().toTimeString().slice(0, 5),
      baseCurrency: "INR",
      isImpulsive: false,
      tradeType: "STOCK",
      tradeDirection: "BUY_LONG",
      emotionalState: "NEUTRAL",
      leverage: 1,
    };
  };
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TradeFormData>({
    resolver: zodResolver(tradeSchema),
    defaultValues: getDefaultValues(),
  });

  const tradeType = watch("tradeType");
  const baseCurrency = watch("baseCurrency");
  const isImpulsive = watch("isImpulsive");

  const tradeTypeOptions = [
    { value: "CRYPTO", label: "Crypto" },
    { value: "STOCK", label: "Stock" },
    { value: "FUTURES", label: "Futures" },
    { value: "OPTIONS", label: "Options" },
    { value: "FUNDED_ACCOUNT", label: "Funded Account" },
  ];

  const tradeDirectionOptions = [
    { value: "BUY_LONG", label: "Buy/Long" },
    { value: "SELL_SHORT", label: "Sell/Short" },
  ];

  const optionTypeOptions = [
    { value: "CALL", label: "Call" },
    { value: "PUT", label: "Put" },
  ];

  const emotionalStateOptions = [
    { value: "CONFIDENT", label: "Confident" },
    { value: "FEARFUL", label: "Fearful" },
    { value: "GREEDY", label: "Greedy" },
    { value: "ANXIOUS", label: "Anxious" },
    { value: "NEUTRAL", label: "Neutral" },
    { value: "EXCITED", label: "Excited" },
    { value: "FRUSTRATED", label: "Frustrated" },
  ];

  const handleFormSubmit = async (data: TradeFormData) => {
    const tradeData: CreateTradeDTO = {
      ...data,
      tradeDate: new Date(data.tradeDate).toISOString(),
      avgBuyPrice: Number(data.avgBuyPrice),
      avgSellPrice: Number(data.avgSellPrice),
      positionSize: Number(data.positionSize),
      leverage: data.leverage ? Number(data.leverage) : 1,
    };
    await onSubmit(tradeData, screenshots);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date and Time */}
        <DatePicker
          label="Trade Date"
          value={watch("tradeDate")}
          onChange={(value) => setValue("tradeDate", value)}
          error={errors.tradeDate?.message}
          required
        />
        <TimePicker
          label="Entry Time"
          value={watch("entryTime")}
          onChange={(value) => setValue("entryTime", value)}
          error={errors.entryTime?.message}
          required
        />
        <TimePicker
          label="Exit Time"
          value={watch("exitTime")}
          onChange={(value) => setValue("exitTime", value)}
          error={errors.exitTime?.message}
          required
        />

        {/* Trade Type and Direction */}
        <SelectField
          label="Trade Type"
          value={watch("tradeType")}
          onChange={(value) => setValue("tradeType", value as TradeType)}
          options={tradeTypeOptions}
          error={errors.tradeType?.message}
          required
        />
        <SelectField
          label="Trade Direction"
          value={watch("tradeDirection")}
          onChange={(value) => setValue("tradeDirection", value as TradeDirection)}
          options={tradeDirectionOptions}
          error={errors.tradeDirection?.message}
          required
        />

        {/* Instrument */}
        <div className="space-y-2 md:col-span-2">
          <Label>
            Instrument <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            {...register("instrument")}
            placeholder="e.g., AAPL, BTC/USD, NIFTY"
          />
          {errors.instrument && (
            <p className="text-sm text-red-500">{errors.instrument.message}</p>
          )}
        </div>

        {/* Conditional Option Type */}
        {tradeType === "OPTIONS" && (
          <SelectField
            label="Option Type"
            value={watch("optionType") || ""}
            onChange={(value) => setValue("optionType", value as OptionType)}
            options={optionTypeOptions}
            error={errors.optionType?.message}
            required
          />
        )}

        {/* Prices */}
        <NumberInput
          label="Average Buy Price"
          value={watch("avgBuyPrice") || ""}
          onChange={(value) => setValue("avgBuyPrice", parseFloat(value) || 0)}
          placeholder="0.00"
          min={0}
          step="0.01"
          error={errors.avgBuyPrice?.message}
          required
        />
        <NumberInput
          label="Average Sell Price"
          value={watch("avgSellPrice") || ""}
          onChange={(value) => setValue("avgSellPrice", parseFloat(value) || 0)}
          placeholder="0.00"
          min={0}
          step="0.01"
          error={errors.avgSellPrice?.message}
          required
        />

        {/* Position Size */}
        <NumberInput
          label="Position Size"
          value={watch("positionSize") || ""}
          onChange={(value) => setValue("positionSize", parseFloat(value) || 0)}
          placeholder="0"
          min={0}
          error={errors.positionSize?.message}
          required
        />

        {/* Leverage */}
        <NumberInput
          label="Leverage (Optional)"
          value={watch("leverage") || ""}
          onChange={(value) => setValue("leverage", value ? parseFloat(value) : undefined)}
          placeholder="1"
          min={1}
          error={errors.leverage?.message}
        />

        {/* Currency */}
        <CurrencySelector
          label="Base Currency"
          value={baseCurrency}
          onChange={(value) => setValue("baseCurrency", value)}
          error={errors.baseCurrency?.message}
        />

        {/* Emotional State */}
        <SelectField
          label="Emotional State"
          value={watch("emotionalState")}
          onChange={(value) => setValue("emotionalState", value as EmotionalState)}
          options={emotionalStateOptions}
          error={errors.emotionalState?.message}
          required
        />

        {/* Impulsive Trade */}
        <div className="md:col-span-2">
          <CheckboxField
            label="This was an impulsive trade"
            checked={isImpulsive}
            onChange={(checked) => setValue("isImpulsive", checked)}
            error={errors.isImpulsive?.message}
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <Label htmlFor="initialNotes">Notes (Optional)</Label>
          <textarea
            id="initialNotes"
            {...register("initialNotes")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Add any notes about this trade..."
            maxLength={2000}
          />
          {errors.initialNotes && (
            <p className="mt-1 text-sm text-red-600">{errors.initialNotes.message}</p>
          )}
        </div>

        {/* Screenshots */}
        <div className="md:col-span-2">
          <ImageUpload
            label="Screenshots (Optional)"
            images={screenshots}
            onImagesChange={setScreenshots}
            maxFiles={5}
            maxSize={5}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading 
            ? (mode === 'edit' ? "Updating Trade..." : "Creating Trade...") 
            : (mode === 'edit' ? "Update Trade" : "Create Trade")
          }
        </Button>
      </div>
    </form>
  );
};
