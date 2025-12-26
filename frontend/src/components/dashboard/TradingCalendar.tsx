import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarData {
  date: string;
  pnl: number;
  tradeCount: number;
}

interface TradingCalendarProps {
  data: CalendarData[];
  onDateClick?: (date: string) => void;
}

export function TradingCalendar({ data, onDateClick }: TradingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get calendar data for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Create array of days
    const days: Array<{
      date: Date;
      dateString: string;
      pnl: number;
      tradeCount: number;
      isCurrentMonth: boolean;
    }> = [];
    
    // Add previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        dateString: date.toISOString().split('T')[0],
        pnl: 0,
        tradeCount: 0,
        isCurrentMonth: false,
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayData = data.find(d => d.date === dateString);
      
      days.push({
        date,
        dateString,
        pnl: dayData?.pnl || 0,
        tradeCount: dayData?.tradeCount || 0,
        isCurrentMonth: true,
      });
    }
    
    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        dateString: date.toISOString().split('T')[0],
        pnl: 0,
        tradeCount: 0,
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [currentDate, data]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDayColor = (pnl: number, tradeCount: number) => {
    if (tradeCount === 0) return 'bg-gray-100 text-gray-400';
    if (pnl > 0) return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (pnl < 0) return 'bg-red-100 text-red-800 hover:bg-red-200';
    return 'bg-gray-200 text-gray-700';
  };

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{monthYear}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => day.tradeCount > 0 && onDateClick?.(day.dateString)}
            className={cn(
              'relative aspect-square rounded-lg p-2 transition-all duration-200',
              'flex flex-col items-center justify-center',
              day.isCurrentMonth ? getDayColor(day.pnl, day.tradeCount) : 'bg-gray-50 text-gray-300',
              day.tradeCount > 0 && 'cursor-pointer hover:scale-105 hover:shadow-md',
              !day.isCurrentMonth && 'opacity-50'
            )}
            title={
              day.tradeCount > 0
                ? `${day.tradeCount} trade${day.tradeCount > 1 ? 's' : ''} • ${formatCurrency(day.pnl)}`
                : undefined
            }
          >
            <span className="text-sm font-semibold">{day.date.getDate()}</span>
            {day.tradeCount > 0 && (
              <span className="text-xs font-mono mt-1">
                {formatCurrency(day.pnl)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
          <span className="text-sm text-gray-600">Profitable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
          <span className="text-sm text-gray-600">Loss</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
          <span className="text-sm text-gray-600">No Trades</span>
        </div>
      </div>
    </div>
  );
}
