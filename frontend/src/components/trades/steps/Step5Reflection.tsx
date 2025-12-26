import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { SectionHeader } from "../SectionHeader";
import { RangeSlider } from "../RangeSlider";
import { MultiSelect } from "../MultiSelect";
import { SelectField } from "../SelectField";
import { CheckboxField } from "../CheckboxField";
import { ImageUpload } from "../ImageUpload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Lightbulb, ThumbsUp } from "lucide-react";

interface Step5Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: any;
  screenshots: File[];
  setScreenshots: (files: File[]) => void;
}

export function Step5Reflection({ register, watch, setValue, screenshots, setScreenshots }: Step5Props) {
  const mistakesOptions = [
    { value: "OVERLEVERAGED", label: "⚠️ Overleveraged" },
    { value: "POOR_ENTRY", label: "❌ Poor Entry" },
    { value: "NO_STOP_LOSS", label: "🚫 No Stop Loss" },
    { value: "EMOTIONAL_EXIT", label: "😰 Emotional Exit" },
    { value: "IGNORED_SIGNALS", label: "🙈 Ignored Signals" },
    { value: "FOMO", label: "😱 FOMO" },
    { value: "REVENGE_TRADING", label: "😤 Revenge Trading" },
    { value: "OVERTRADING", label: "🔄 Overtrading" },
    { value: "POOR_RISK_MANAGEMENT", label: "⚡ Poor Risk Management" },
  ];

  const physicalStateOptions = [
    { value: "WELL_RESTED", label: "😊 Well-rested" },
    { value: "TIRED", label: "😴 Tired" },
    { value: "SICK", label: "🤒 Sick" },
    { value: "ENERGETIC", label: "⚡ Energetic" },
  ];

  const mentalStateOptions = [
    { value: "FOCUSED", label: "🎯 Focused" },
    { value: "DISTRACTED", label: "😵 Distracted" },
    { value: "STRESSED", label: "😰 Stressed" },
    { value: "CALM", label: "😌 Calm" },
    { value: "ANXIOUS", label: "😟 Anxious" },
  ];

  const externalFactorsOptions = [
    { value: "WORK_STRESS", label: "💼 Work Stress" },
    { value: "PERSONAL_ISSUES", label: "👨‍👩‍👧 Personal Issues" },
    { value: "FINANCIAL_PRESSURE", label: "💰 Financial Pressure" },
    { value: "NONE", label: "✅ None" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<FileText />}
        title="Reflection & Context"
        description="Learn from this trade and document the context"
        color="pink"
        tooltip="Reflection is key to continuous improvement as a trader"
      />

      {/* Key Learnings */}
      <div className="space-y-6">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Key Learnings
        </h4>

        <div className="space-y-2">
          <Label htmlFor="keyLesson">
            What was the key lesson from this trade?
          </Label>
          <Textarea
            id="keyLesson"
            {...register("keyLesson")}
            placeholder="What did you learn? What will you remember from this trade..."
            rows={3}
            className="resize-none"
          />
        </div>

        <MultiSelect
          value={watch("mistakesMade") || []}
          onChange={(value) => setValue("mistakesMade", value)}
          options={mistakesOptions}
          label="Mistakes Made (if any)"
          placeholder="Select any mistakes"
        />

        <div className="space-y-2">
          <Label htmlFor="whatWentWell">
            What went well?
          </Label>
          <Textarea
            id="whatWentWell"
            {...register("whatWentWell")}
            placeholder="What did you do right? What should you repeat..."
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
          <CheckboxField
            label="Market conditions matched my expectations"
            checked={watch("conditionsMatchExpectation") || false}
            onChange={(checked) => setValue("conditionsMatchExpectation", checked)}
          />
        </div>
      </div>

      {/* Session Quality */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6">
        <RangeSlider
          value={watch("sessionQuality") || 5}
          onChange={(value) => setValue("sessionQuality", value)}
          label="Overall Session Quality"
          min={1}
          max={10}
          labels={{ min: "Poor Session", max: "Excellent Session" }}
        />
      </div>

      {/* Personal Context */}
      <div className="space-y-6">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-pink-600" />
          Personal Context
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Physical State"
            value={watch("physicalState")}
            onChange={(value) => setValue("physicalState", value)}
            options={physicalStateOptions}
            placeholder="How did you feel physically?"
          />

          <SelectField
            label="Mental State"
            value={watch("mentalState")}
            onChange={(value) => setValue("mentalState", value)}
            options={mentalStateOptions}
            placeholder="How was your mental state?"
          />
        </div>

        <MultiSelect
          value={watch("externalFactors") || []}
          onChange={(value) => setValue("externalFactors", value)}
          options={externalFactorsOptions}
          label="External Factors"
          placeholder="Any external influences?"
        />
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="initialNotes">
          Additional Notes
        </Label>
        <Textarea
          id="initialNotes"
          {...register("initialNotes")}
          placeholder="Any other thoughts, observations, or details about this trade..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Screenshots */}
      <div className="space-y-2">
        <Label>Trade Screenshots (Optional)</Label>
        <ImageUpload
          files={screenshots}
          onChange={setScreenshots}
          maxFiles={5}
        />
        <p className="text-xs text-gray-500">
          📸 Upload charts, entry/exit points, or any relevant screenshots
        </p>
      </div>

      {/* Completion Message */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <h4 className="font-bold text-lg mb-2">🎉 Almost Done!</h4>
        <p className="text-green-50">
          You've documented all the important details. Click "Submit Trade" to save your journal entry.
        </p>
      </div>
    </div>
  );
}
