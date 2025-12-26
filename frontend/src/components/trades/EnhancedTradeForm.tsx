import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StepWizard } from "./StepWizard";
import { WizardNavigation } from "./WizardNavigation";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2PreTrade } from "./steps/Step2PreTrade";
import { Step3EntryManagement } from "./steps/Step3EntryManagement";
import { Step4ExitDetails } from "./steps/Step4ExitDetails";
import { Step5Reflection } from "./steps/Step5Reflection";
import { 
  BarChart3, Target, Rocket, Film, FileText
} from "lucide-react";
import type { CreateTradeDTO } from "@/types";
import { calculatePnL } from "@/utils/pnl-calculator";

// Enhanced validation schema with all new fields
const enhancedTradeSchema = z.object({
  // Basic Info
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
  
  // Pre-Trade
  setupConfidence: z.number().min(1).max(10).optional(),
  marketCondition: z.string().optional(),
  timeOfDay: z.string().optional(),
  newsImpact: z.string().optional(),
  strategy: z.string().optional(),
  stopLossPrice: z.number().optional(),
  takeProfitPrice: z.number().optional(),
  positionSizingReason: z.string().optional(),
  
  // Entry
  entryTrigger: z.string().optional(),
  hadHesitation: z.boolean().optional(),
  deviatedFromPlan: z.boolean().optional(),
  deviationReason: z.string().optional(),
  monitoringFrequency: z.string().optional(),
  stressLevel: z.number().min(1).max(10).optional(),
  
  // Exit
  exitReason: z.string().optional(),
  exitSatisfaction: z.number().min(1).max(10).optional(),
  consideredEarlyExit: z.boolean().optional(),
  earlyExitReason: z.string().optional(),
  wouldDoDifferently: z.string().optional(),
  
  // Reflection
  keyLesson: z.string().optional(),
  mistakesMade: z.array(z.string()).optional(),
  whatWentWell: z.string().optional(),
  conditionsMatchExpectation: z.boolean().optional(),
  sessionQuality: z.number().min(1).max(10).optional(),
  physicalState: z.string().optional(),
  mentalState: z.string().optional(),
  externalFactors: z.array(z.string()).optional(),
  initialNotes: z.string().optional(),
});

type EnhancedTradeFormData = z.infer<typeof enhancedTradeSchema>;

interface EnhancedTradeFormProps {
  onSubmit: (data: CreateTradeDTO, screenshots?: File[]) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CreateTradeDTO>;
  mode?: 'create' | 'edit';
}

export const EnhancedTradeForm: React.FC<EnhancedTradeFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [screenshots, setScreenshots] = useState<File[]>([]);

  const steps = [
    { id: 1, title: "Basic Info", description: "Trade details", icon: <BarChart3 /> },
    { id: 2, title: "Pre-Trade", description: "Setup & planning", icon: <Target /> },
    { id: 3, title: "Entry & Management", description: "Execution", icon: <Rocket /> },
    { id: 4, title: "Exit Details", description: "Close & results", icon: <Film /> },
    { id: 5, title: "Reflection", description: "Learning & context", icon: <FileText /> },
  ];

  const getDefaultValues = (): Partial<EnhancedTradeFormData> => {
    if (initialData) {
      const tradeDate = initialData.tradeDate 
        ? new Date(initialData.tradeDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      
      return {
        ...initialData,
        tradeDate,
        leverage: initialData.leverage || 1,
        setupConfidence: initialData.setupConfidence || 5,
        stressLevel: initialData.stressLevel || 5,
        exitSatisfaction: initialData.exitSatisfaction || 5,
        sessionQuality: initialData.sessionQuality || 5,
        mistakesMade: initialData.mistakesMade || [],
        externalFactors: initialData.externalFactors || [],
      };
    }
    
    return {
      tradeDate: new Date().toISOString().split("T")[0],
      entryTime: "09:30",
      exitTime: "15:30",
      baseCurrency: "INR",
      isImpulsive: false,
      tradeType: "STOCK",
      tradeDirection: "BUY_LONG",
      emotionalState: "NEUTRAL",
      leverage: 1,
      setupConfidence: 5,
      stressLevel: 5,
      exitSatisfaction: 5,
      sessionQuality: 5,
      hadHesitation: false,
      deviatedFromPlan: false,
      consideredEarlyExit: false,
      conditionsMatchExpectation: true,
      mistakesMade: [],
      externalFactors: [],
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<EnhancedTradeFormData>({
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  const tradeType = watch("tradeType");
  const avgBuyPrice = watch("avgBuyPrice");
  const avgSellPrice = watch("avgSellPrice");
  const stopLossPrice = watch("stopLossPrice");
  const takeProfitPrice = watch("takeProfitPrice");
  const deviatedFromPlan = watch("deviatedFromPlan");
  const consideredEarlyExit = watch("consideredEarlyExit");

  // Auto-calculate Risk-Reward Ratio
  const riskRewardRatio = useMemo(() => {
    if (avgBuyPrice && stopLossPrice && takeProfitPrice) {
      const risk = Math.abs(avgBuyPrice - stopLossPrice);
      const reward = Math.abs(takeProfitPrice - avgBuyPrice);
      return risk > 0 ? (reward / risk).toFixed(2) : "0";
    }
    return "N/A";
  }, [avgBuyPrice, stopLossPrice, takeProfitPrice]);

  // Auto-calculate P&L using shared utility
  const calculatedPnL = useMemo(() => {
    if (avgBuyPrice && avgSellPrice) {
      const positionSize = watch("positionSize") || 0;
      const tradeDirection = watch("tradeDirection");
      
      try {
        const pnl = calculatePnL({
          tradeDirection,
          avgBuyPrice,
          avgSellPrice,
          positionSize
        });
        return pnl.toFixed(2);
      } catch (error) {
        console.error('P&L calculation error:', error);
        return "0.00";
      }
    }
    return "0.00";
  }, [avgBuyPrice, avgSellPrice, watch("positionSize"), watch("tradeDirection")]);

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as any);
    
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (data: EnhancedTradeFormData) => {
    // Only allow submission on step 5
    if (currentStep !== 5) {
      return;
    }
    
    try {
      
      // Helper function to clean null/empty values
      const cleanValue = (value: any) => {
        if (value === null || value === undefined || value === '') {
          return undefined;
        }
        return value;
      };
      
      // Clean up the data - remove null/empty values and convert to proper types
      const tradeData: any = {
        tradeDate: new Date(data.tradeDate).toISOString(),
        entryTime: data.entryTime,
        exitTime: data.exitTime,
        tradeType: data.tradeType,
        instrument: data.instrument,
        tradeDirection: data.tradeDirection,
        avgBuyPrice: Number(data.avgBuyPrice),
        avgSellPrice: Number(data.avgSellPrice),
        positionSize: Number(data.positionSize),
        leverage: data.leverage ? Number(data.leverage) : 1,
        baseCurrency: data.baseCurrency,
        emotionalState: data.emotionalState,
        isImpulsive: data.isImpulsive,
      };
      
      // Add optional fields only if they have values
      if (cleanValue(data.optionType)) tradeData.optionType = data.optionType;
      if (cleanValue(data.setupConfidence)) tradeData.setupConfidence = data.setupConfidence;
      if (cleanValue(data.marketCondition)) tradeData.marketCondition = data.marketCondition;
      if (cleanValue(data.timeOfDay)) tradeData.timeOfDay = data.timeOfDay;
      if (cleanValue(data.newsImpact)) tradeData.newsImpact = data.newsImpact;
      if (cleanValue(data.strategy)) tradeData.strategy = data.strategy;
      if (riskRewardRatio !== "N/A") tradeData.riskRewardRatio = Number(riskRewardRatio);
      if (data.stopLossPrice) tradeData.stopLossPrice = Number(data.stopLossPrice);
      if (data.takeProfitPrice) tradeData.takeProfitPrice = Number(data.takeProfitPrice);
      if (cleanValue(data.positionSizingReason)) tradeData.positionSizingReason = data.positionSizingReason;
      if (cleanValue(data.entryTrigger)) tradeData.entryTrigger = data.entryTrigger;
      if (data.hadHesitation !== undefined) tradeData.hadHesitation = data.hadHesitation;
      if (data.deviatedFromPlan !== undefined) tradeData.deviatedFromPlan = data.deviatedFromPlan;
      if (cleanValue(data.deviationReason)) tradeData.deviationReason = data.deviationReason;
      if (cleanValue(data.monitoringFrequency)) tradeData.monitoringFrequency = data.monitoringFrequency;
      if (cleanValue(data.stressLevel)) tradeData.stressLevel = data.stressLevel;
      if (data.consideredEarlyExit !== undefined) tradeData.consideredEarlyExit = data.consideredEarlyExit;
      if (cleanValue(data.earlyExitReason)) tradeData.earlyExitReason = data.earlyExitReason;
      if (cleanValue(data.exitReason)) tradeData.exitReason = data.exitReason;
      if (cleanValue(data.exitSatisfaction)) tradeData.exitSatisfaction = data.exitSatisfaction;
      if (cleanValue(data.wouldDoDifferently)) tradeData.wouldDoDifferently = data.wouldDoDifferently;
      if (cleanValue(data.keyLesson)) tradeData.keyLesson = data.keyLesson;
      if (data.mistakesMade && data.mistakesMade.length > 0) tradeData.mistakesMade = data.mistakesMade;
      if (cleanValue(data.whatWentWell)) tradeData.whatWentWell = data.whatWentWell;
      if (data.conditionsMatchExpectation !== undefined) tradeData.conditionsMatchExpectation = data.conditionsMatchExpectation;
      if (cleanValue(data.sessionQuality)) tradeData.sessionQuality = data.sessionQuality;
      if (cleanValue(data.physicalState)) tradeData.physicalState = data.physicalState;
      if (cleanValue(data.mentalState)) tradeData.mentalState = data.mentalState;
      if (data.externalFactors && data.externalFactors.length > 0) tradeData.externalFactors = data.externalFactors;
      if (cleanValue(data.initialNotes)) tradeData.initialNotes = data.initialNotes;
      
      await onSubmit(tradeData as CreateTradeDTO, screenshots);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['tradeDate', 'entryTime', 'exitTime', 'instrument', 'tradeType', 'tradeDirection', 
                'avgBuyPrice', 'avgSellPrice', 'positionSize', 'baseCurrency'];
      case 2:
        return []; // Make step 2 optional for now
      case 3:
        return []; // Make step 3 optional for now
      case 4:
        return []; // Exit details are all optional
      case 5:
        return []; // Make step 5 optional for now
      default:
        return [];
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <StepWizard
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      >
        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[600px]">
          {currentStep === 1 && (
            <Step1BasicInfo
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              tradeType={tradeType}
              calculatedPnL={calculatedPnL}
            />
          )}
          
          {currentStep === 2 && (
            <Step2PreTrade
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              riskRewardRatio={riskRewardRatio}
            />
          )}
          
          {currentStep === 3 && (
            <Step3EntryManagement
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              deviatedFromPlan={deviatedFromPlan ?? false}
              consideredEarlyExit={consideredEarlyExit ?? false}
            />
          )}
          
          {currentStep === 4 && (
            <Step4ExitDetails
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              consideredEarlyExit={consideredEarlyExit ?? false}
            />
          )}
          
          {currentStep === 5 && (
            <Step5Reflection
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              screenshots={screenshots}
              setScreenshots={setScreenshots}
            />
          )}
        </div>

        {/* Navigation */}
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={5}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isLastStep={currentStep === 5}
          isFirstStep={currentStep === 1}
          isSubmitting={isLoading}
          canProceed={true}
        />
      </StepWizard>
    </form>
  );
};
