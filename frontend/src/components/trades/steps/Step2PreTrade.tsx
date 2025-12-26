import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { SectionHeader } from "../SectionHeader";
import { RangeSlider } from "../RangeSlider";
import { SelectField } from "../SelectField";
import { NumberInput } from "../NumberInput";
import { Target, TrendingUp, Shield } from "lucide-react";

interface Step2Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: any;
  riskRewardRatio: string;
}

export function Step2PreTrade({ watch, setValue, riskRewardRatio }: Step2Props) {
  const marketConditionOptions = [
    { value: "TRENDING_UP", label: "📈 Trending Up" },
    { value: "TRENDING_DOWN", label: "📉 Trending Down" },
    { value: "SIDEWAYS", label: "↔️ Sideways" },
    { value: "VOLATILE", label: "⚡ Volatile" },
    { value: "CALM", label: "😌 Calm" },
  ];

  const timeOfDayOptions = [
    { value: "PRE_MARKET", label: "🌅 Pre-Market" },
    { value: "MARKET_OPEN", label: "🔔 Market Open" },
    { value: "MID_DAY", label: "☀️ Mid-Day" },
    { value: "MARKET_CLOSE", label: "🌆 Market Close" },
    { value: "AFTER_HOURS", label: "🌙 After-Hours" },
  ];

  const newsImpactOptions = [
    { value: "MAJOR_NEWS", label: "📰 Major News" },
    { value: "EARNINGS", label: "💰 Earnings" },
    { value: "ECONOMIC_DATA", label: "📊 Economic Data" },
    { value: "TECHNICAL_SETUP", label: "📈 Technical Setup" },
    { value: "NONE", label: "❌ None" },
  ];

  const strategyOptions = [
    { value: "BREAKOUT", label: "🚀 Breakout" },
    { value: "PULLBACK", label: "↩️ Pullback" },
    { value: "REVERSAL", label: "🔄 Reversal" },
    { value: "MOMENTUM", label: "⚡ Momentum" },
    { value: "MEAN_REVERSION", label: "📊 Mean Reversion" },
    { value: "SCALPING", label: "⚡ Scalping" },
    { value: "SWING", label: "🎯 Swing" },
    { value: "POSITION", label: "📍 Position" },
  ];

  const positionSizingOptions = [
    { value: "RISK_MANAGEMENT", label: "🛡️ Risk Management" },
    { value: "ACCOUNT_SIZE", label: "💰 Account Size" },
    { value: "VOLATILITY", label: "📊 Volatility" },
    { value: "CONVICTION_LEVEL", label: "💪 Conviction Level" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Target />}
        title="Pre-Trade Setup & Planning"
        description="Document your preparation and strategy before entering the trade"
        color="purple"
        tooltip="Understanding your pre-trade mindset helps identify patterns in successful trades"
      />

      {/* Setup Confidence */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
        <RangeSlider
          value={watch("setupConfidence") || 5}
          onChange={(value) => setValue("setupConfidence", value)}
          label="Setup Confidence Level"
          min={1}
          max={10}
          labels={{ min: "Not Confident", max: "Very Confident" }}
        />
      </div>

      {/* Market Context */}
      <div className="space-y-6">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Market Context
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Market Condition"
            value={watch("marketCondition")}
            onChange={(value) => setValue("marketCondition", value)}
            options={marketConditionOptions}
            placeholder="Select market condition"
          />

          <SelectField
            label="Time of Day"
            value={watch("timeOfDay")}
            onChange={(value) => setValue("timeOfDay", value)}
            options={timeOfDayOptions}
            placeholder="Select time of day"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="News/Events Impact"
            value={watch("newsImpact")}
            onChange={(value) => setValue("newsImpact", value)}
            options={newsImpactOptions}
            placeholder="Select news impact"
          />

          <SelectField
            label="Strategy Used"
            value={watch("strategy")}
            onChange={(value) => setValue("strategy", value)}
            options={strategyOptions}
            placeholder="Select strategy"
          />
        </div>
      </div>

      {/* Risk Management */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 space-y-6">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Risk Management
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Stop Loss Price"
            value={watch("stopLossPrice")}
            onChange={(value) => setValue("stopLossPrice", value === '' ? undefined : parseFloat(value))}
            step="0.01"
            placeholder="Enter stop loss"
          />

          <NumberInput
            label="Take Profit Target"
            value={watch("takeProfitPrice")}
            onChange={(value) => setValue("takeProfitPrice", value === '' ? undefined : parseFloat(value))}
            step="0.01"
            placeholder="Enter take profit"
          />
        </div>

        {/* Risk-Reward Ratio Display */}
        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Risk-Reward Ratio:</span>
            <span className={`text-2xl font-bold font-mono ${
              parseFloat(riskRewardRatio) >= 2 ? "text-green-600" : 
              parseFloat(riskRewardRatio) >= 1 ? "text-yellow-600" : "text-red-600"
            }`}>
              {riskRewardRatio !== "N/A" ? `1:${riskRewardRatio}` : "N/A"}
            </span>
          </div>
          {riskRewardRatio !== "N/A" && (
            <p className="text-xs text-gray-500 mt-2">
              {parseFloat(riskRewardRatio) >= 2 ? "✅ Excellent risk-reward ratio" :
               parseFloat(riskRewardRatio) >= 1 ? "⚠️ Acceptable risk-reward ratio" :
               "❌ Poor risk-reward ratio"}
            </p>
          )}
        </div>

        <SelectField
          label="Position Sizing Reason"
          value={watch("positionSizingReason")}
          onChange={(value) => setValue("positionSizingReason", value)}
          options={positionSizingOptions}
          placeholder="Why this position size?"
        />
      </div>
    </div>
  );
}
