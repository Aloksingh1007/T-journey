import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { SectionHeader } from "../SectionHeader";
import { RangeSlider } from "../RangeSlider";
import { SelectField } from "../SelectField";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Film, CheckCircle } from "lucide-react";

interface Step4Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: any;
  consideredEarlyExit: boolean;
}

export function Step4ExitDetails({ register, watch, setValue, consideredEarlyExit }: Step4Props) {
  const exitReasonOptions = [
    { value: "HIT_TARGET", label: "🎯 Hit Target" },
    { value: "HIT_STOP_LOSS", label: "🛑 Hit Stop Loss" },
    { value: "TIME_BASED", label: "⏰ Time-Based" },
    { value: "FEAR", label: "😰 Fear" },
    { value: "GREED", label: "🤑 Greed" },
    { value: "NEWS", label: "📰 News" },
    { value: "TECHNICAL_SIGNAL", label: "📊 Technical Signal" },
    { value: "TRAILING_STOP", label: "📈 Trailing Stop" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Film />}
        title="Exit Details"
        description="How and why did you close this trade?"
        color="orange"
        tooltip="Exit decisions reveal your discipline and emotional control"
      />

      {/* Exit Decision */}
      <div className="space-y-6">
        <SelectField
          label="Exit Reason"
          value={watch("exitReason")}
          onChange={(value) => setValue("exitReason", value)}
          options={exitReasonOptions}
          placeholder="Why did you exit?"
        />

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
          <RangeSlider
            value={watch("exitSatisfaction") || 5}
            onChange={(value) => setValue("exitSatisfaction", value)}
            label="Exit Satisfaction"
            min={1}
            max={10}
            labels={{ min: "Very Unsatisfied", max: "Very Satisfied" }}
          />
        </div>
      </div>

      {/* Reflection on Exit */}
      <div className="space-y-6">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-orange-600" />
          Exit Reflection
        </h4>

        <div className="space-y-2">
          <Label htmlFor="wouldDoDifferently">
            What would you do differently next time?
          </Label>
          <Textarea
            id="wouldDoDifferently"
            {...register("wouldDoDifferently")}
            placeholder="Reflect on your exit decision and what you learned..."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            💡 Be honest with yourself - this helps identify patterns
          </p>
        </div>
      </div>

      {/* Exit Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-4">Exit Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Exit Reason:</span>
            <p className="font-medium text-gray-900">
              {watch("exitReason") ? 
                exitReasonOptions.find(opt => opt.value === watch("exitReason"))?.label : 
                "Not selected"}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Satisfaction:</span>
            <p className="font-medium text-gray-900">
              {watch("exitSatisfaction") || 5}/10
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Considered Early Exit:</span>
            <p className="font-medium text-gray-900">
              {consideredEarlyExit ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
