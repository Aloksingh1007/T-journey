# Performance Optimization Guide

This document outlines the performance optimizations implemented in the Trading Journal application.

## Implemented Optimizations

### 1. Code Splitting & Lazy Loading

**Route-based code splitting:**
- All page components are lazy-loaded using React.lazy()
- Reduces initial bundle size by loading routes on-demand
- Suspense boundaries provide loading states

**Benefits:**
- Faster initial page load
- Smaller initial JavaScript bundle
- Better user experience with progressive loading

### 2. Bundle Optimization

**Vite build configuration:**
- Manual chunk splitting for vendor libraries
- Separate chunks for React, React Query, Forms, and UI libraries
- Terser minification with console.log removal in production
- Optimized dependency pre-bundling

**Chunk strategy:**
```
- react-vendor: React core libraries
- query-vendor: React Query
- form-vendor: Form handling libraries
- ui-vendor: UI components and charts
```

### 3. Image Optimization

**Implemented features:**
- Automatic image compression before upload (max 1920x1080, 85% quality)
- Lazy loading for images with loading="lazy" attribute
- Blur placeholder while images load
- Error handling with fallback UI
- Image validation (type and size)

**Usage:**
```tsx
import { OptimizedImage } from '@/components/common/OptimizedImage';

<OptimizedImage
  src={imageUrl}
  alt="Trade screenshot"
  loading="lazy"
  className="w-full h-auto"
/>
```

### 4. React Query Caching Strategy

**Optimized cache times:**
- Dashboard stats: 2 minutes stale time, 15 minutes cache
- Calendar data: 2 minutes stale time, 15 minutes cache
- Recent trades: 1 minute stale time, 10 minutes cache
- Trades list: 1 minute stale time, 5 minutes cache
- Analytics: 3 minutes stale time, 15 minutes cache

**Benefits:**
- Reduced API calls
- Faster page navigation
- Better offline experience
- Lower server load

### 5. Performance Monitoring

**Development tools:**
- Automatic performance metrics logging in dev mode
- TTFB, DOM Content Loaded, and Total Load Time tracking
- Component render time warnings (>16ms)

**Utilities available:**
- `debounce()` - Delay function execution
- `throttle()` - Limit function execution rate
- `measureRenderTime()` - Track component performance
- `isSlowConnection()` - Detect slow networks

## Running Performance Audits

### Lighthouse Audit

Run a Lighthouse audit on the production build:

```bash
# Build and preview the app
npm run perf:build

# In another terminal, run Lighthouse
npm run lighthouse
```

### Bundle Analysis

Analyze the bundle size and composition:

```bash
npm run build:analyze
```

This will:
1. Build the production bundle
2. Generate a visual report (dist/stats.html)
3. Open the report in your browser

### Performance Budgets

The following budgets are configured in `lighthouse.config.js`:

**Resource Sizes:**
- JavaScript: 300 KB
- CSS: 50 KB
- Images: 200 KB
- Total: 800 KB

**Timing Metrics:**
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Best Practices

### 1. Component Optimization

```tsx
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### 2. Image Handling

```tsx
// Always compress images before upload
import { compressImage } from '@/utils/imageOptimization';

const handleImageUpload = async (file: File) => {
  const compressed = await compressImage(file);
  await uploadImage(compressed);
};
```

### 3. Query Optimization

```tsx
// Use appropriate stale times based on data freshness needs
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000, // 5 minutes for relatively static data
  gcTime: 10 * 60 * 1000,   // 10 minutes cache
});

// Use placeholderData for smoother transitions
useQuery({
  queryKey: ['data', filters],
  queryFn: () => fetchData(filters),
  placeholderData: (previousData) => previousData,
});
```

### 4. Debouncing User Input

```tsx
import { debounce } from '@/utils/performance';

// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    performSearch(value);
  }, 300),
  []
);
```

## Monitoring in Production

### Key Metrics to Track

1. **Core Web Vitals:**
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

2. **Custom Metrics:**
   - API response times
   - Query cache hit rate
   - Image load times
   - Route transition times

### Tools

- Chrome DevTools Performance tab
- Lighthouse CI for automated audits
- React DevTools Profiler
- Network tab for API monitoring

## Future Optimizations

1. **Service Worker:**
   - Implement offline support
   - Cache API responses
   - Background sync for failed requests

2. **Virtual Scrolling:**
   - Implement for large trade lists
   - Reduce DOM nodes for better performance

3. **Progressive Web App:**
   - Add PWA manifest
   - Enable install prompt
   - Improve offline experience

4. **CDN Integration:**
   - Serve static assets from CDN
   - Optimize image delivery
   - Edge caching for API responses

## Troubleshooting

### Slow Initial Load

1. Check bundle size with `npm run build:analyze`
2. Verify code splitting is working
3. Check network tab for large resources
4. Run Lighthouse audit to identify issues

### Slow Navigation

1. Check React Query cache configuration
2. Verify lazy loading is working
3. Check for unnecessary re-renders
4. Use React DevTools Profiler

### High Memory Usage

1. Check for memory leaks in useEffect
2. Verify query cache is being garbage collected
3. Check for large data structures in state
4. Monitor with Chrome DevTools Memory tab

## Resources

- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Query Performance](https://tanstack.com/query/latest/docs/react/guides/performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
