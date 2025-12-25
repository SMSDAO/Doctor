# Planning Guide

Jupiter Scan is a sophisticated Solana token monitoring platform with advanced charting, real-time price tracking, and intelligent alert management.

**Experience Qualities**: 
1. **Precise** - Data-dense interfaces with accurate metrics and clear visual hierarchies that help users make informed trading decisions
2. **Electrifying** - High-energy digital aesthetic with glowing accents and smooth animations that evoke blockchain technology
3. **Professional** - Enterprise-grade UI with sophisticated data visualization and role-based access control

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)

This is a sophisticated platform requiring multiple role-based panels (User, Admin, Developer), real-time data visualization, alert management, token analytics, and comprehensive state management across various features.

## Essential Features

**Token Price Scanner**
- Functionality: Displays real-time token prices, 24h changes, volume, and market cap with live updates
- Purpose: Core feature providing instant market visibility for Solana ecosystem tokens
- Trigger: Automatic on app load, with configurable refresh intervals
- Progression: User loads app → Token scanner fetches data → Price table renders → Auto-refresh every 30s → User can manually refresh
- Success criteria: Tokens load correctly, prices update smoothly, sorting works, data persists across sessions

**Watchlist Management**
- Functionality: Users can star tokens to add them to a personal watchlist for quick access
- Purpose: Allows traders to track specific tokens of interest without scanning the entire market
- Progression: User views token → Clicks star → Token added to watchlist → Toast confirmation → Persists in useKV
- Success criteria: Watchlist syncs across sessions, star icons reflect state, watchlist tab shows correct tokens

**Smart Alert System**
- Functionality: Configure price alerts with conditions (above/below threshold, % change, volume spike) and real-time sound notifications when alerts trigger
- Purpose: Automated monitoring that notifies users both visually and audibly when market conditions match their criteria, ensuring critical price movements aren't missed
- Trigger: Click "Create Alert" button or alert icon on token
- Progression: User clicks alert → Modal opens → Selects condition & threshold → Enables/disables sound notification → Tests sound → Saves → Alert appears in dashboard → Real-time monitor checks prices every update → When condition met → Plays sound (if enabled) + toast notification → Alert marked as triggered with timestamp → Auto-deactivates
- Success criteria: Alerts persist in useKV, modal form validates input, sound notifications work reliably, alerts display in dedicated tab with trigger history, can toggle on/off and delete, triggered alerts show in history panel, sound test button works

**Advanced Historical Charts**
- Functionality: Interactive D3-powered charts showing historical price data with multiple timeframes (1H, 24H, 7D, 30D, 90D, 1Y), volume bars, moving averages, and two chart types (line and candlestick)
- Purpose: Professional-grade technical analysis tools for understanding price trends and patterns
- Trigger: Navigate to Charts tab or click token details
- Progression: User selects Charts tab → Selects token from dropdown → Chooses timeframe → Chart renders with smooth animations → Hover shows detailed data → Can toggle volume/MA → Switch between line and candlestick views
- Success criteria: Charts render smoothly, data updates when timeframe changes, hover interactions work, responsive on mobile

**Role-Based Panels**
- Functionality: Three distinct interfaces (User Dashboard, Admin Panel, Developer Tools)
- Purpose: Separates concerns and provides appropriate tools for different user types
- Trigger: Role selector in header or user profile setting
- Progression: User selects role → Interface updates → Role-specific features appear → Previous role features hidden
- Success criteria: Each role shows unique content, admin sees user management, developer sees API tools

**Token Detail View**
- Functionality: Comprehensive analytics for individual tokens including advanced price charts, metadata, and risk metrics
- Purpose: Deep-dive analysis for informed decision-making
- Trigger: Click on token row in scanner
- Progression: User clicks token → Detail dialog opens → Loads historical data → Renders interactive chart → Shows metrics → User can set alerts or add to watchlist
- Success criteria: Detail panel displays rich token data, chart renders with all timeframes, back navigation works

## Edge Case Handling

- **No Tokens Available** - Display empty state with helpful message and action to refresh or check connection
- **Network Errors** - Show error toast, retry button, and graceful degradation to last known data
- **Invalid Alert Configuration** - Form validation prevents saving alerts with missing/invalid threshold values
- **Alert Sound Failure** - Gracefully degrade to visual-only notifications if Web Audio API is unavailable
- **Multiple Simultaneous Alerts** - Queue sound notifications to prevent audio overlap, show combined toast
- **Alert Cooldown** - Prevent alert from re-triggering for 60 seconds after first trigger to avoid notification spam
- **Role Permission Mismatch** - Gracefully hide features not available to current role without breaking UI
- **Watchlist Limit** - Optional cap at reasonable number (e.g., 50 tokens) with warning message
- **Concurrent Updates** - Handle race conditions when multiple tabs modify watchlist/alerts using functional updates
- **Chart Rendering Issues** - Fallback to simpler bar chart if D3 fails, show loading state during data generation
- **Empty Chart Data** - Display message when no historical data available for selected timeframe

## Design Direction

The design should evoke the feeling of a high-tech command center for crypto trading - think cyberpunk meets professional terminal interfaces. Users should feel like they're interfacing with advanced blockchain technology through glowing data streams, smooth transitions, and a sophisticated color palette that balances readability with visual excitement.

## Color Selection

The color scheme draws inspiration from Solana's signature purple/blue palette mixed with Neo-Tokyo cyberpunk aesthetics, using high-contrast glowing accents against deep backgrounds with enhanced blue-purple saturation.

- **Primary Color**: Vivid purple (oklch(0.50 0.25 285)) - Represents premium blockchain technology, creates sophisticated foundation with intense glow
- **Secondary Colors**: 
  - Dark background (oklch(0.10 0.03 270)) - Deep blue-black with purple tint for maximum depth
  - Card surface (oklch(0.15 0.05 275)) - Slightly lighter than background with stronger purple hue for layering
- **Accent Color**: Electric blue-purple (oklch(0.65 0.20 240)) - High-energy glow for CTAs, price increases, and interactive elements
- **Success Color**: Vibrant green (oklch(0.65 0.18 150)) - For positive price changes and bullish indicators
- **Destructive Color**: Warm red (oklch(0.58 0.24 25)) - For negative price changes and bearish indicators
- **Foreground/Background Pairings**: 
  - Background (oklch(0.10 0.03 270)): Foreground text (oklch(0.90 0.02 280)) - Ratio 16.8:1 ✓
  - Card (oklch(0.15 0.05 275)): Card text (oklch(0.90 0.02 280)) - Ratio 12.4:1 ✓
  - Primary (oklch(0.50 0.25 285)): White text (oklch(0.98 0 0)) - Ratio 6.8:1 ✓
  - Accent (oklch(0.65 0.20 240)): White text (oklch(0.98 0 0)) - Ratio 7.5:1 ✓

## Font Selection

Technical precision meets futuristic aesthetics through a pairing of Space Grotesk for UI elements and JetBrains Mono for data display.

- **Typographic Hierarchy**: 
  - H1 (Page Title): Space Grotesk Bold/36px/tight letter spacing (-0.02em)
  - H2 (Section Title): Space Grotesk Bold/24px/normal
  - H3 (Card Title): Space Grotesk Semibold/18px/normal
  - Body Text: Space Grotesk Regular/14px/relaxed line height (1.6)
  - Data/Prices: JetBrains Mono Medium/14px/tabular-nums/tight tracking
  - Small Labels: Space Grotesk Medium/12px/uppercase/wide tracking (0.05em)

## Animations

Animations should feel snappy and purposeful - like data flowing through a high-speed network. Use micro-interactions to confirm actions and guide attention.

- **Price Updates**: Subtle flash animation (150ms) when values change, green for increase, red for decrease
- **Chart Rendering**: Smooth path animation (500ms ease-out) as lines draw from left to right
- **Hover States**: Quick scale (100ms) and glow effect on interactive elements
- **Tab Transitions**: Fade content (200ms) while sliding indicator moves smoothly (300ms ease-in-out)
- **Modal Entry**: Scale from 95% to 100% (200ms) with backdrop fade (150ms)
- **Loading States**: Pulsing glow effect on skeleton loaders
- **Alert Notification**: Toast slides in from top-right with bounce effect (300ms), sound plays simultaneously
- **Active Alert Indicator**: Subtle pulse animation on bell icon in header when alerts are monitoring

## Component Selection

- **Components**: 
  - Tabs: shadcn Tabs for main navigation between All Tokens/Watchlist/Charts/Alerts
  - Card: shadcn Card for metric displays and content containers
  - Table: Custom sortable table with hover states and row actions
  - Dialog: shadcn Dialog for alert creation and token details
  - Badge: shadcn Badge for status indicators (price change %, alert status)
  - Button: shadcn Button with glow effects on primary actions
  - Switch: shadcn Switch for alert toggles and chart options
  - Select: shadcn Select for token selection and MA period
  - Custom PriceChart: D3-powered line chart with area fill, gridlines, and interactive crosshair
  - Custom CandlestickChart: D3-powered OHLC visualization with volume bars
  - Custom ChartView: Container component with chart type switching and controls

- **Customizations**: 
  - Add glow effects using box-shadow on accent-colored elements
  - Custom data-font class applying JetBrains Mono to numerical displays
  - Gradient backgrounds on chart areas for depth
  - Custom crosshair interaction on chart hover

- **States**: 
  - Buttons: Default has subtle border glow, hover brightens accent color, active scales down 98%
  - Table rows: Hover adds subtle background glow and left border accent
  - Chart elements: Hover highlights data point with tooltip and crosshair
  - Inputs: Focus adds accent-colored glow ring

- **Icon Selection**: 
  - Lightning for refresh/updates (brand icon)
  - Star for watchlist
  - Bell for alerts and active monitoring indicator
  - SpeakerHigh/SpeakerSlash for sound notification toggle
  - ChartLine for analytics/charts
  - ChartLineUp for candlestick charts
  - User/ShieldCheck/Code for role selection
  - TrendUp/TrendDown for price changes

- **Spacing**: 
  - Page padding: px-4 lg:px-6, py-8
  - Card padding: p-6
  - Table cell padding: px-4 py-3
  - Gap between metric cards: gap-4
  - Section spacing: space-y-6

- **Mobile**: 
  - Tabs become scrollable horizontal strip
  - Sticky header with condensed navigation
  - Reduce chart height for better viewport fit
  - Stack metric cards in single column
  - Timeframe buttons wrap into multiple rows
  - Chart controls stack vertically
