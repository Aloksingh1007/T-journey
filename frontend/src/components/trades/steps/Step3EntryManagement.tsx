import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { SectionHeader } from "../SectionHeader";
import { RangeSlider } from "../RangeSlider";
import { SelectField } from "../SelectField";
import { CheckboxField } from "../CheckboxField";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Rocket, AlertCircle } from "lucide-react";

interface Step3Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: any;
  deviatedFromPlan: boolean;
  consideredEarlyExit: boolean;
}

export function Step3EntryManagement({ register, watch, setValue, deviatedFromPlan, consideredEarlyExit }: Step3Props) {
  const entryTriggerOptions = [
    { value: "TECHNICAL_SIGNAL", label: "📊 Technical Signal" },
    { value: "PRICE_ACTION", label: "📈 Price Action" },
    { value: "INDICATOR", label: "🎯 Indicator" },
    { value: "NEWS", label: "📰 News" },
    { value: "FOMO", label: "😰 FOMO" },
    { value: "REVENGE_TRADING", label: "😤 Revenge Trading" },
    { value: "PLANNED", label: "✅ Planned" },
  ];

  const monitoringFrequencyOptions = [
    { value: "CONSTANTLY", label: "👀 Constantly" },
    { value: "EVERY_HOUR", label: "⏰ Every Hour" },
    { value: "FEW_TIMES", label: "🔄 Few Times" },
    { value: "SET_AND_FORGET", label: "😌 Set and Forget" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Rocket />}
        title="Entry & Trade Management"
        description="How did you enter and manage this trade?"
        color="green"
        tooltip="Understanding your execution helps identify emotional patterns"
      />

      {/* Entry Decision */}
      <div className="space-y-6">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-green-600" />
          Entry Decision
        </h4>

        <SelectField
          label="Entry Trigger"
          value={watch("entryTrigger")}
          onChange={(value) => setValue("entryTrigger", value)}
          options={entryTriggerOptions}
          placeholder="What triggered your entry?"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4">
            <CheckboxField
              label="I hesitated before entering"
              checked={watch("hadHesitation") || false}
              onChange={(checked) => setValue("hadHesitation", checked)}
            />
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4">
            <CheckboxField
              label="I deviated from my plan"
              checked={watch("deviatedFromPlan") || false}
              onChange={(checked) => setValue("deviatedFromPlan", checked)}
            />
          </div>
        </div>

        {deviatedFromPlan && (
          <div className="space-y-2 animate-slide-down">
            <Label htmlFor="deviationReason">Why did you deviate from your plan?</Label>
            <Textarea
              id="deviationReason"
              {...register("deviationReason")}
              placeholder="Explain what made you change your original plan..."
              rows={3}
              className="resize-none"
            />
          </div>
        )}
      </div>

      {/* During Trade */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
        <h4 className="font-semibold text-gray-900">During the Trade</h4>

        <SelectField
          label="Monitoring Frequency"
          value={watch("monitoringFrequency")}
          onChange={(value) => setValue("monitoringFrequency", value)}
          options={monitoringFrequencyOptions}
          placeholder="How often did you check?"
        />

        <RangeSlider
          value={watch("stressLevel") || 5}
          onChange={(value) => setValue("stressLevel", value)}
          label="Stress Level During Trade"
          min={1}
          max={10}
          labels={{ min: "Calm & Relaxed", max: "Extremely Stressed" }}
        />

        <div className="space-y-4">
          <CheckboxField
            label="I considered exiting early"
            checked={watch("consideredEarlyExit") || false}
            onChange={(checked) => setValue("consideredEarlyExit", checked)}
          />

          {consideredEarlyExit && (
            <div className="space-y-2 animate-slide-down ml-6">
              <Label htmlFor="earlyExitReason">Why did you consider exiting early?</Label>
              <Textarea
                id="earlyExitReason"
                {...register("earlyExitReason")}
                placeholder="What made you think about exiting before your target..."
                rows={3}
                className="resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
