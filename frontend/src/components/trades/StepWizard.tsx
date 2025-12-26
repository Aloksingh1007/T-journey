import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: ReactNode;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  children: ReactNode;
}

export function StepWizard({ steps, currentStep, onStepClick, children }: StepWizardProps) {
  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 -z-10" />
        
        {/* Progress line */}
        <div
          className="absolute top-12 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isClickable = onStepClick && (isCompleted || stepNumber === currentStep);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isClickable && onStepClick?.(stepNumber)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center group relative',
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                )}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    'w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative',
                    'border-4 shadow-lg',
                    isCompleted && 'bg-gradient-to-br from-green-400 to-green-600 border-green-500 scale-100',
                    isCurrent && 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 scale-110 shadow-xl',
                    !isCompleted && !isCurrent && 'bg-white border-gray-300 scale-90',
                    isClickable && 'hover:scale-105 hover:shadow-xl'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-10 w-10 text-white animate-scale-in" />
                  ) : (
                    <div className={cn(
                      'text-3xl transition-colors',
                      isCurrent ? 'text-white' : 'text-gray-400'
                    )}>
                      {step.icon}
                    </div>
                  )}

                  {/* Pulse animation for current step */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
                  )}
                </div>

                {/* Step info */}
                <div className="mt-4 text-center max-w-[140px]">
                  <div className={cn(
                    'text-sm font-semibold transition-colors',
                    isCurrent && 'text-blue-600',
                    isCompleted && 'text-green-600',
                    !isCurrent && !isCompleted && 'text-gray-500'
                  )}>
                    {step.title}
                  </div>
                  <div className={cn(
                    'text-xs mt-1 transition-colors',
                    isCurrent && 'text-gray-700',
                    !isCurrent && 'text-gray-500'
                  )}>
                    {step.description}
                  </div>
                </div>

                {/* Step number badge */}
                <div className={cn(
                  'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  'border-2 transition-all duration-300',
                  isCompleted && 'bg-green-500 border-green-600 text-white',
                  isCurrent && 'bg-blue-600 border-blue-700 text-white scale-110',
                  !isCompleted && !isCurrent && 'bg-gray-200 border-gray-300 text-gray-600'
                )}>
                  {stepNumber}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
}
