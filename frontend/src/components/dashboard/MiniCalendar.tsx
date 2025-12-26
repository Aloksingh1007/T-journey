import { useMemo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CalendarData {
  date: string;
  pnl: number;
  tradeCount: number;
}

interface MiniCalendarProps {
  data: CalendarData[];
  onClick: () => void;
}

export function MiniCalendar({ data, onClick }: MiniCalendarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get last 12 months of data
  const monthsData = useMemo(() => {
    const months = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = monthDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      
      // Get all days in this month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const dayData = data.find(d => d.date === dateString);
        
        days.push({
          date: dateString,
          pnl: dayData?.pnl || 0,
          tradeCount: dayData?.tradeCount || 0,
        });
      }
      
      months.push({
        label: monthKey,
        days,
      });
    }
    
    return months;
  }, [data]);

  // Scroll to show current month on mount
  useEffect(() => {
    if (scrollContainerRef.current && monthsData.length > 0) {
      // Scroll to show the last few months (current month should be visible)
      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollWidth - container.clientWidth;
      container.scrollLeft = scrollPosition;
    }
  }, [monthsData]);

  const getDayColor = (pnl: number, tradeCount: number) => {
    if (tradeCount === 0) return 'bg-gray-100';
    if (pnl > 0) {
      // Different shades of green based on profit amount
      if (pnl > 5000) return 'bg-green-600';
      if (pnl > 2000) return 'bg-green-500';
      if (pnl > 500) return 'bg-green-400';
      return 'bg-green-300';
    }
    if (pnl < 0) {
      // Different shades of red based on loss amount
      if (pnl < -5000) return 'bg-red-600';
      if (pnl < -2000) return 'bg-red-500';
      if (pnl < -500) return 'bg-red-400';
      return 'bg-red-300';
    }
    return 'bg-gray-200';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200 cursor-pointer hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trading Activity</h3>
        <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors font-medium">
          Click to expand →
        </span>
      </div>
      
      {/* Mini calendar grid */}
      <div className="space-y-3">
        <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto pb-2 scroll-smooth scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
          {monthsData.map((month, monthIndex) => (
            <div key={monthIndex} className="flex-shrink-0">
              <div className="text-xs font-semibold text-gray-600 mb-2 text-center">{month.label}</div>
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      'w-3.5 h-3.5 rounded transition-all duration-200',
                      getDayColor(day.pnl, day.tradeCount),
                      'group-hover:scale-110 hover:ring-2 hover:ring-blue-400'
                    )}
                    title={day.tradeCount > 0 ? `${day.date}: ${day.tradeCount} trades, P&L: ${day.pnl > 0 ? '+' : ''}${day.pnl}` : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-500">Less</span>
          <div className="flex gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-gray-100 border border-gray-200"></div>
            <div className="w-3.5 h-3.5 rounded bg-green-300"></div>
            <div className="w-3.5 h-3.5 rounded bg-green-400"></div>
            <div className="w-3.5 h-3.5 rounded bg-green-500"></div>
            <div className="w-3.5 h-3.5 rounded bg-green-600"></div>
          </div>
          <span className="text-xs font-medium text-gray-500">More</span>
        </div>
      </div>
    </div>
  );
}
