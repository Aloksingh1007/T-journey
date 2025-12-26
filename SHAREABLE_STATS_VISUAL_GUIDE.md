# Shareable Stats Cards - Visual Guide

## Component Preview

### Modal Layout
```
┌─────────────────────────────────────────────────────────────┐
│  🔵 Share Your Stats                                    ✕   │
│  Choose a card style and share your achievements            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [🎯 Overview] [📈 Performance] [🏆 Achievements]          │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │                                                    │      │
│  │         CARD PREVIEW AREA                         │      │
│  │         (Gradient Background)                     │      │
│  │                                                    │      │
│  │  • Profile Picture                                │      │
│  │  • Name & Trading Style                           │      │
│  │  • Key Statistics                                 │      │
│  │  • Visual Elements                                │      │
│  │                                                    │      │
│  │  Powered by AI Trading Journal                    │      │
│  │                                                    │      │
│  └──────────────────────────────────────────────────┘      │
│                                                              │
│  [📋 Copy Link] [📋 Copy Stats] [⬇️ Download Card]        │
│                                                              │
│  ℹ️ These shareable cards respect your privacy settings.   │
│     Only information you've chosen to share publicly        │
│     will be visible to others.                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Card Types

### 1. Overview Card (Blue → Purple → Pink Gradient)
```
┌────────────────────────────────────┐
│  👤 John Doe                       │
│     Day Trader                     │
│                                    │
│  ┌──────────┐  ┌──────────┐      │
│  │   150    │  │  68.5%   │      │
│  │  Trades  │  │ Win Rate │      │
│  └──────────┘  └──────────┘      │
│                                    │
│  ┌──────────┐  ┌──────────┐      │
│  │ $12,450  │  │    15    │      │
│  │   P&L    │  │  Streak  │      │
│  └──────────┘  └──────────┘      │
│                                    │
│  Powered by AI Trading Journal    │
└────────────────────────────────────┘
```

### 2. Performance Card (Green → Emerald → Teal Gradient)
```
┌────────────────────────────────────┐
│  📈 Performance Metrics            │
│     John Doe                       │
│                                    │
│  Win Rate              68.5%      │
│  ████████████░░░░░░░░             │
│                                    │
│  Longest Win Streak       25      │
│                                    │
│  Total P&L           $12,450      │
│                                    │
│  📅 Best Trading Day              │
│     November 15, 2024             │
│                                    │
│  Powered by AI Trading Journal    │
└────────────────────────────────────┘
```

### 3. Achievements Card (Yellow → Orange → Red Gradient)
```
┌────────────────────────────────────┐
│  🏆 Achievements                   │
│     John Doe                       │
│                                    │
│         12                         │
│    Badges Earned                   │
│                                    │
│  🏅 First Win                      │
│     Your first profitable trade    │
│                                    │
│  🏅 Consistency King               │
│     10 consecutive winning days    │
│                                    │
│  🏅 Risk Manager                   │
│     Perfect risk management        │
│                                    │
│  +9 more badges                    │
│                                    │
│  150 Trades  │  15 Streak         │
│                                    │
│  Powered by AI Trading Journal    │
└────────────────────────────────────┘
```

## User Flow

### Step 1: Access Share Feature
```
Profile Page
├── Header Section
│   ├── Profile Info
│   └── Action Buttons
│       ├── [Share Profile] ← Click here
│       └── [Edit Profile]
```

### Step 2: Select Card Style
```
Modal Opens
├── Three Card Options
│   ├── [Overview] ← Default selected
│   ├── [Performance]
│   └── [Achievements]
└── Live Preview Updates
```

### Step 3: Share
```
Action Buttons
├── Copy Profile Link
│   └── Copies: https://app.com/profile/john-doe
├── Copy Stats Text
│   └── Copies formatted text with stats
└── Download Card (Coming Soon)
    └── Will download as image
```

## Copy Stats Text Format

When user clicks "Copy Stats Text", the following format is copied:

```
🎯 Trading Stats for John Doe

📊 Performance:
• Total Trades: 150
• Win Rate: 68.5%
• Total P&L: $12,450.00
• Current Streak: 15
• Longest Win Streak: 25

🏆 Trading Profile:
• Style: Day Trader
• Experience: Advanced
• Best Trading Day: November 15, 2024

🏅 Achievements: 12 badges earned

View full profile: https://app.com/profile/john-doe
```

## Privacy Integration

### When Stats Sharing is Enabled:
```
User clicks "Share Profile"
    ↓
Fetch shareable stats from API
    ↓
Display modal with cards
    ↓
User can share
```

### When Stats Sharing is Disabled:
```
User clicks "Share Profile"
    ↓
Check privacy settings
    ↓
Show error toast:
"Please enable stats sharing in your privacy settings first"
    ↓
User can go to Settings tab to enable
```

## Responsive Design

### Desktop (1024px+)
- Modal: 896px max width
- Card: 448px width (centered)
- 3 buttons in a row
- Full card details visible

### Tablet (768px - 1023px)
- Modal: 90% width
- Card: 400px width (centered)
- 3 buttons in a row
- Slightly smaller text

### Mobile (< 768px)
- Modal: 95% width
- Card: Full width with padding
- Buttons stack vertically
- Optimized touch targets

## Color Schemes

### Overview Card
- Primary: `from-blue-500`
- Secondary: `via-purple-500`
- Accent: `to-pink-500`

### Performance Card
- Primary: `from-green-500`
- Secondary: `via-emerald-500`
- Accent: `to-teal-500`

### Achievements Card
- Primary: `from-yellow-500`
- Secondary: `via-orange-500`
- Accent: `to-red-500`

## Interactive Elements

### Hover States
- Card selector buttons: Background color change
- Action buttons: Slight scale and shadow
- Close button: Background color change

### Active States
- Selected card type: Blue background with white text
- Copy button after click: Shows checkmark for 2 seconds

### Transitions
- All transitions: 200ms ease
- Smooth color changes
- Smooth scale transforms

## Accessibility Features

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Escape to close modal

2. **Screen Readers**
   - Proper ARIA labels
   - Semantic HTML structure
   - Descriptive button text

3. **Visual Indicators**
   - High contrast text
   - Clear focus states
   - Color is not the only indicator

4. **Touch Targets**
   - Minimum 44px touch targets
   - Adequate spacing between buttons
   - Large close button

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loaded component (only loads when modal opens)
- Optimized gradient rendering
- Minimal re-renders
- Fast clipboard operations
- No external image dependencies

## Future Enhancements Preview

### Image Download (Coming Soon)
```
[Download Card] button will:
1. Convert card HTML to canvas
2. Add watermark
3. Download as PNG (1200x630px)
4. Optimized for social media sharing
```

### Social Media Integration (Planned)
```
Additional buttons:
[Share on Twitter]
[Share on LinkedIn]
[Share on Facebook]

Pre-filled posts with stats and link
```

### QR Code (Planned)
```
Add QR code to bottom of card
Scanning opens profile page
Useful for in-person networking
```
