# Emotion Analysis UI Components

This directory contains the UI components for displaying AI-powered emotion analysis insights.

## Components

### 1. EmotionTimeline
Displays the emotional journey of a trade across three phases:
- **Pre-Trade**: Shows confidence, hesitation, and emotional state before entry
- **During Trade**: Displays stress level and emotional state during the trade
- **Post-Trade**: Shows satisfaction and key insights after exit

**Usage:**
```tsx
import { EmotionTimeline } from '@/components/emotion';

<EmotionTimeline timeline={emotionTimelineData} />
```

### 2. EmotionPatternCard
Displays a detected emotional pattern with:
- Pattern type and icon
- Frequency and impact score
- Description and recommendation
- Examples from trades

**Usage:**
```tsx
import { EmotionPatternCard } from '@/components/emotion';

<EmotionPatternCard pattern={patternData} />
```

### 3. EmotionPerformanceChart
Shows correlation between emotional states and trading performance:
- Bar chart of average P&L by emotion
- Win rate by emotion
- Recommendations for each emotional state

**Usage:**
```tsx
import { EmotionPerformanceChart } from '@/components/emotion';

<EmotionPerformanceChart correlations={correlationData} />
```

### 4. EmotionInsights
Comprehensive emotion analysis dashboard that combines:
- Emotion performance chart
- Stress analysis
- Detected patterns
- Recommendations

**Usage:**
```tsx
import { EmotionInsights } from '@/components/emotion';

<EmotionInsights startDate="2024-01-01" endDate="2024-12-31" />
```

### 5. EmotionWarnings (Dashboard)
Displays the most impactful negative emotional pattern on the dashboard:
- Shows only if negative patterns are detected
- Displays the pattern with highest impact
- Provides actionable recommendations

**Usage:**
```tsx
import EmotionWarnings from '@/components/dashboard/EmotionWarnings';

<EmotionWarnings />
```

## Integration Points

### Trade Detail Page
- Shows EmotionTimeline for individual trades
- Displays the emotional journey from pre-trade to post-trade
- Located after the Reflection & Learning section

### Dashboard
- Shows EmotionWarnings component
- Alerts users to concerning emotional patterns
- Only displays if patterns are detected (minimum 5 trades)

### Analytics Page
- Shows full EmotionInsights component
- Requires minimum 10 trades for analysis
- Includes all charts and pattern detection
- Respects date range filters

## Data Flow

1. **Backend**: AI service analyzes trade data and generates emotion insights
2. **API**: Endpoints at `/api/ai/emotion-*` provide the data
3. **Hooks**: `useEmotionTimeline` and `useEmotionPatterns` fetch the data
4. **Components**: Display the insights with appropriate visualizations

## Requirements Satisfied

- ✅ 5.4: Display emotion trends and correlations
- ✅ 5.5: Provide actionable insights based on emotional patterns
