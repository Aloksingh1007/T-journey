import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  isSubmitting?: boolean;
  canProceed?: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSaveDraft,
  isLastStep,
  isFirstStep,
  isSubmitting = false,
  canProceed = true,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      {/* Left side - Previous button */}
      <div>
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={isSubmitting}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
              'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            )}
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </button>
        )}
      </div>

      {/* Center - Progress indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
        )}
      </div>

      {/* Right side - Next/Submit button */}
      <div>
        <button
          type={isLastStep ? 'submit' : 'button'}
          onClick={!isLastStep ? (e) => {
            e.preventDefault();
            e.stopPropagation();
            onNext();
          } : undefined}
          disabled={!canProceed || isSubmitting}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200',
            'shadow-lg hover:shadow-xl hover:scale-105',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            isLastStep
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
          )}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Submitting...
            </>
          ) : isLastStep ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Submit Trade
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
