# UI Component Examples & Code Snippets

## 🎨 Ready-to-Use Component Code

---

## 1. Glassmorphic Stat Card

```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export const GlassStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  description
}) => {
  return (
    <div className="relative group">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl" />
      
      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg">
          {icon}
        </div>
        
        {/* Value */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-4xl font-bold font-mono mt-1 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
        
        {/* Trend */}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.isPositive ? 'text-success-600' : 'text-danger-600'
          }`}>
            {trend.isPositive ? '↑' : '↓'}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-xl -z-10" />
    </div>
  );
};
```

---

## 2. Trade Card with Hover Effects

```tsx
interface TradeCardProps {
  trade: {
    id: string;
    instrument: string;
    tradeDate: string;
    pnl: number;
    pnlPercentage: number;
    tradeType: string;
    emotionalState: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const TradeCard: React.FC<TradeCardProps> = ({ trade, onEdit, onDelete }) => {
  const isProfit = trade.pnl >= 0;
  
  return (
    <div className="group relative">
      {/* Card */}
      <div className={`
        relative bg-white dark:bg-gray-800 rounded-2xl p-6 
        border-2 transition-all duration-300 cursor-pointer
        ${isProfit 
          ? 'border-success-200 hover:border-success-400 hover:shadow-glow-success' 
          : 'border-danger-200 hover:border-danger-400 hover:shadow-glow-danger'
        }
        hover:-translate-y-2 hover:shadow-2xl
      `}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {trade.instrument}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(trade.tradeDate).toLocaleDateString()}
            </p>
          </div>
          
          {/* Quick Actions (visible on hover) */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* P&L Display */}
        <div className="mb-4">
          <div className={`text-3xl font-bold font-mono ${
            isProfit ? 'text-success-600' : 'text-danger-600'
          }`}>
            {isProfit ? '+' : ''}{trade.pnl.toFixed(2)}
          </div>
          <div className={`text-sm font-medium ${
            isProfit ? 'text-success-600' : 'text-danger-600'
          }`}>
            {isProfit ? '+' : ''}{trade.pnlPercentage.toFixed(2)}%
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            {trade.tradeType}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {trade.emotionalState}
          </span>
        </div>
      </div>
      
      {/* Glow effect */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 blur-xl -z-10
        ${isProfit ? 'bg-success-500/30' : 'bg-danger-500/30'}
      `} />
    </div>
  );
};
```

---

## 3. AI Insights Card (Ready for AI)

```tsx
export const AIInsightsCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="relative group">
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 p-[2px] animate-gradient">
        <div className="h-full w-full bg-white dark:bg-gray-800 rounded-2xl" />
      </div>
      
      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              AI Insights
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by GPT-4
            </p>
          </div>
        </div>
        
        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your trading pattern shows a 73% win rate on morning trades. 
              Consider focusing on 9:30-11:00 AM window.
            </p>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View detailed analysis →
            </button>
          </div>
        )}
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
};

// Add to global CSS
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}
```

---

## 4. Animated Number Counter

```tsx
interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeOut);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  return (
    <span className="font-mono font-bold">
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// Usage
<AnimatedNumber value={1234.56} prefix="$" decimals={2} />
```

---

## 5. Floating Action Button (FAB)

```tsx
export const FloatingActionButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Expanded menu */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 space-y-3 animate-slideUp">
          <button className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <span className="text-sm font-medium">Add Trade</span>
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
              <PlusIcon className="w-5 h-5 text-white" />
            </div>
          </button>
          
          <button className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <span className="text-sm font-medium">Voice Note</span>
            <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center">
              <MicIcon className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      )}
      
      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 
          shadow-2xl hover:shadow-glow-primary flex items-center justify-center
          transition-all duration-300 hover:scale-110
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <PlusIcon className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};
```

---

## 6. Command Palette (Cmd+K)

```tsx
export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trades, navigate, or run commands..."
            className="w-full bg-transparent text-lg outline-none"
            autoFocus
          />
        </div>
        
        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          <div className="space-y-1">
            <CommandItem icon={<PlusIcon />} label="Add New Trade" shortcut="⌘N" />
            <CommandItem icon={<ChartIcon />} label="View Dashboard" shortcut="⌘D" />
            <CommandItem icon={<ListIcon />} label="All Trades" shortcut="⌘T" />
            <CommandItem icon={<SettingsIcon />} label="Settings" shortcut="⌘," />
          </div>
        </div>
      </div>
    </div>
  );
};

const CommandItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
}> = ({ icon, label, shortcut }) => (
  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      {icon}
    </div>
    <span className="flex-1 text-left font-medium">{label}</span>
    {shortcut && (
      <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 rounded">
        {shortcut}
      </kbd>
    )}
  </button>
);
```

---

## 7. Skeleton Loader with Shimmer

```tsx
export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-shimmer" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-shimmer" />
        </div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-shimmer" />
      </div>
      
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-shimmer" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-shimmer" />
      </div>
      
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-shimmer" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-shimmer" />
      </div>
    </div>
  );
};

// Add to global CSS
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

---

## 8. Toast Notification (Enhanced)

```tsx
// Using Sonner with custom styling
import { toast } from 'sonner';

// Success with confetti
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    className: 'bg-gradient-to-r from-success-500 to-success-600 text-white',
    icon: '🎉',
  });
  
  // Trigger confetti animation
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

// Error with shake
export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    className: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white animate-shake',
  });
};

// Add to global CSS
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.animate-shake {
  animation: shake 0.5s;
}
```

---

## 9. Dark Mode Toggle

```tsx
export const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };
  
  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
    >
      <div className={`
        absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg
        transition-transform duration-300 flex items-center justify-center
        ${isDark ? 'translate-x-6' : 'translate-x-0'}
      `}>
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
};
```

---

## 10. Empty State

```tsx
export const EmptyState: React.FC<{
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Illustration */}
      <div className="w-64 h-64 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 rounded-full blur-3xl" />
        <div className="relative w-full h-full flex items-center justify-center">
          <ChartIcon className="w-32 h-32 text-gray-300 dark:text-gray-700" />
        </div>
      </div>
      
      {/* Text */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        {description}
      </p>
      
      {/* Action */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
```

---

These components are production-ready and follow the design system. They can be directly integrated into the application! 🚀
