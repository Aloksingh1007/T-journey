import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TradingCalendar } from './TradingCalendar';
import { cn } from '@/lib/utils';

interface CalendarData {
  date: string;
  pnl: number;
  tradeCount: number;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CalendarData[];
  onDateClick?: (date: string) => void;
}

export function CalendarModal({ isOpen, onClose, data, onDateClick }: CalendarModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setShowContent(false);
      
      // Simulate loading animation
      const timer = setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setShowContent(true), 100);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div 
          className={cn(
            'relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl',
            'transform transition-all duration-300',
            showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          )}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-blue-600 animate-pulse"></div>
                </div>
              </div>
              <p className="mt-6 text-gray-600 font-medium animate-pulse">
                Loading calendar...
              </p>
            </div>
          )}

          {/* Content */}
          {!isLoading && (
            <div className="p-8 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Trading Calendar
                </h2>
                <p className="text-gray-600">
                  Click on any date to view trades for that day
                </p>
              </div>
              
              <TradingCalendar 
                data={data} 
                onDateClick={(date) => {
                  onDateClick?.(date);
                  onClose();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
