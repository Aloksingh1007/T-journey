# Performance Quick Reference

Quick reference guide for maintaining optimal performance in the Trading Journal app.

## 🚀 Quick Commands

```bash
# Development
npm run dev                 # Start dev server with performance monitoring

# Build & Analysis
npm run build              # Production build
npm run build:analyze      # Build with bundle analysis
npm run preview            # Preview production build

# Performance Testing
npm run perf:build         # Build and start preview server
npm run lighthouse         # Run Lighthouse audit
```

## 📦 Import Patterns

### ✅ DO: Use Lazy Loading for Routes
```tsx
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
```

### ✅ DO: Use OptimizedImage Component
```tsx
import { OptimizedImage } from '@/components/common/OptimizedImage';

<OptimizedImage src={url} alt="Description" loading="lazy" />
```

### ✅ DO: Compress Images Before Upload
```tsx
import { compressImage } from '@/utils/imageOptimization';

const compressed = await compressImage(file, 1920, 1080, 0.85);
```

### ❌ DON'T: Import Heavy Libraries Directly
```tsx
// Bad
import * as recharts from 'recharts';

// Good
import { LineChart, Line } from 'recharts';
```

## 🔄 React Query Patterns

### ✅ DO: Configure Appropriate Cache Times
```tsx
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 2 * 60 * 1000,  // How long data is fresh
  gcTime: 10 * 60 * 1000,    // How long to keep in cache
});
```

### ✅ DO: Use Placeholder Data for Smooth Transitions
```tsx
useQuery({
  queryKey: ['data', filters],
  queryFn: () => fetchData(filters),
  placeholderData: (previousData) => previousData,
});
```

### ❌ DON'T: Refetch on Every Mount
```tsx
// Bad
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  refetchOnMount: true, // Unnecessary if data is fresh
});

// Good - uses global config
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  // refetchOnMount: false is set globally
});
```

## 🎨 Component Optimization

### ✅ DO: Memoize Expensive Calculations
```tsx
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);
```

### ✅ DO: Memoize Callbacks
```tsx
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

### ✅ DO: Use React.memo for Pure Components
```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Render logic */}</div>;
});
```

### ✅ DO: Debounce User Input
```tsx
import { debounce } from '@/utils/performance';

const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    performSearch(value);
  }, 300),
  []
);
```

## 📊 Cache Time Guidelines

| Data Type | Stale Time | GC Time | Reasoning |
|-----------|------------|---------|-----------|
| Dashboard Stats | 2 min | 15 min | Updates infrequently |
| Calendar Data | 2 min | 15 min | Historical data |
| Recent Trades | 1 min | 10 min | Updates more often |
| Trades List | 1 min | 5 min | User may add/edit |
| Analytics | 3 min | 15 min | Computed data |
| Trade Detail | 5 min | 10 min | Rarely changes |

## 🖼️ Image Guidelines

| Aspect | Guideline | Reason |
|--------|-----------|--------|
| Max Width | 1920px | Sufficient for most displays |
| Max Height | 1080px | Standard HD resolution |
| Quality | 85% | Good balance of quality/size |
| Format | JPEG | Best compression for photos |
| Max Size | 5 MB | Before compression |
| Loading | lazy | Defer offscreen images |

## 🎯 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Initial Bundle | < 500 KB | ~450 KB ✅ |
| Route Chunks | < 100 KB | ~40-70 KB ✅ |
| LCP | < 2.5s | ~1.8s ✅ |
| FID | < 100ms | ~50ms ✅ |
| CLS | < 0.1 | ~0.05 ✅ |

## 🔍 Debugging Performance

### Check Bundle Size
```bash
npm run build:analyze
```
Look for:
- Large chunks that can be split
- Duplicate dependencies
- Unused code

### Check Runtime Performance
1. Open Chrome DevTools
2. Go to Performance tab
3. Record page load
4. Look for:
   - Long tasks (>50ms)
   - Layout shifts
   - Slow network requests

### Check React Performance
1. Install React DevTools
2. Go to Profiler tab
3. Record interaction
4. Look for:
   - Unnecessary re-renders
   - Slow components
   - Large render times

## ⚠️ Common Pitfalls

### 1. Not Using Lazy Loading
```tsx
// Bad - loads all routes upfront
import { Dashboard } from './pages/Dashboard';

// Good - loads on demand
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

### 2. Uploading Large Images
```tsx
// Bad - uploads original file
await uploadImage(file);

// Good - compresses first
const compressed = await compressImage(file);
await uploadImage(compressed);
```

### 3. Aggressive Refetching
```tsx
// Bad - refetches too often
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  refetchInterval: 1000, // Every second!
});

// Good - reasonable interval
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 60000, // 1 minute
});
```

### 4. Not Memoizing Callbacks
```tsx
// Bad - creates new function on every render
<Component onClick={() => handleClick(id)} />

// Good - memoized callback
const handleClickMemo = useCallback(() => handleClick(id), [id]);
<Component onClick={handleClickMemo} />
```

## 📚 Learn More

- [Full Performance Guide](./PERFORMANCE.md)
- [Performance Checklist](./PERFORMANCE_CHECKLIST.md)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [React Query Performance](https://tanstack.com/query/latest/docs/react/guides/performance)
- [Web.dev Performance](https://web.dev/performance/)

---

💡 **Tip:** Run `npm run lighthouse` regularly to catch performance regressions early!
