# Planning Guide

AlgoBrainDoctor Hospital V4 is a production-ready repository health monitoring and auto-healing platform with real-time scoring, identity tracking, and autonomous recovery.

**Experience Qualities**: 
1. **Precise** - Data-dense interfaces with accurate metrics and clear visual hierarchies that help users make informed trading decisions
2. **Electrifying** - High-energy digital aesthetic with glowing accents and smooth animations that evoke blockchain technology
3. **Professional** - Enterprise-grade UI with sophisticated data visualization and role-based access control

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)

This is a sophisticated platform requiring multiple role-based panels (User, Admin, Developer), real-time data visualization, alert management, token analytics, and comprehensive state management across various features.

## Essential Features

**GitHub OAuth Integration**
- Functionality: Authenticate users with GitHub via Spark's built-in OAuth to access their real repositories for scanning and health monitoring
- Purpose: Enable the platform to scan actual GitHub repositories instead of mock data, providing personalized repository health insights
- Trigger: Automatic authentication via Spark runtime using spark.user() API
- Progression: User opens app → Spark handles GitHub OAuth automatically → User info fetched from spark.user() → Real repositories fetched via GitHub API → Dashboard populates with actual repo data → Data persists in KV storage
- Success criteria: User info displays correctly, real repositories are fetched from GitHub API using Octokit, repository metrics calculated from actual data, persists across sessions

**Real Repository Scanner**
- Functionality: Fetches and displays real GitHub repositories with health scores calculated from actual metrics (issues, PRs, commits, contributors)
- Purpose: Provides actionable insights on actual user repositories rather than simulated data
- Trigger: Automatic after GitHub authentication, with manual refresh option
- Progression: User authenticates → Repositories fetched via GitHub API → Health scores calculated from real metrics → Repository list populates → Auto-refresh every 5 minutes → User can manually refresh
- Success criteria: Real repos load correctly, health scores reflect actual repository state, sorting works, data persists across sessions

**Repository Admonition Scanner**
- Functionality: AI-powered scanner that analyzes code repositories to find and categorize code comment markers (TODO, FIXME, HACK, WARNING, NOTE, OPTIMIZE) with file locations and context
- Purpose: Provides visibility into technical debt, unfinished work, and code quality issues marked by developers in comments
- Trigger: Click "Analyze" button on any repository card
- Progression: User clicks Analyze → AI scans repository for admonition markers → Results categorized by type → Display summary counts → Show detailed list with file paths and line numbers → Filter by marker type → Sort by priority (FIXME highest, NOTE lowest)
- Success criteria: Admonitions are accurately detected, categorized correctly, display file locations, can filter by type, shows author when available

**AI-Powered PR Suggestion Generator**
- Functionality: Generates actionable Pull Request suggestions based on repository health metrics, including title, description, priority, category, effort estimate, impact assessment, and affected files
- Purpose: Provides concrete, prioritized recommendations for improving repository health through specific code changes
- Trigger: Click "Analyze" button on repository card, view in PR Suggestions tab
- Progression: User initiates analysis → AI analyzes repo health metrics → Generates 4-7 targeted PR suggestions → Categorizes by type (bug-fix, feature, refactor, documentation, testing, performance) → Assigns priority and effort → Lists affected files → Displays in priority order → User can review suggestions → Optional "Create Draft PR" action
- Success criteria: Suggestions are relevant to repository status, properly prioritized, include realistic effort estimates, show impacted files, sorted by priority/impact score

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
- Functionality: Interactive D3-powered charts showing historical price data with multiple timeframes (1H, 24H, 7D, 30D, 90D, 1Y), volume bars, moving averages (SMA/EMA), and multiple chart types (line, candlestick, and technical indicators including RSI, MACD, Bollinger Bands, support/resistance levels)
- Purpose: Professional-grade technical analysis tools for understanding price trends, momentum, volatility, and key price levels
- Trigger: Navigate to Charts tab or click token details
- Progression: User selects Charts tab → Selects token from dropdown → Chooses timeframe → Chart renders with smooth animations → Hover shows detailed data → Can toggle indicators (volume/MA/EMA/S&R) → Switch between line, candlestick, and indicators views → Analyze RSI for overbought/oversold conditions → Review MACD for trend changes → Examine Bollinger Bands for volatility → Identify support/resistance levels
- Success criteria: Charts render smoothly, data updates when timeframe changes, hover interactions work, indicators calculate correctly, responsive on mobile

**Role-Based Panels**
- Functionality: Three distinct interfaces (User Dashboard, Admin Panel, Developer Tools)
- Purpose: Separates concerns and provides appropriate tools for different user types
- Trigger: Role selector in header or user profile setting
- Progression: User selects role → Interface updates → Role-specific features appear → Previous role features hidden
- Success criteria: Each role shows unique content, admin sees user management, developer sees API tools

**Token Detail View**
- Functionality: Comprehensive analytics for individual tokens including advanced price charts with technical indicators, volume analysis, metadata, and risk metrics
- Purpose: Deep-dive analysis with professional trading tools for informed decision-making
- Trigger: Click on token row in scanner
- Progression: User clicks token → Detail dialog opens → Loads historical data → Renders interactive chart with indicators → Shows metrics → User can set alerts or add to watchlist
- Success criteria: Detail panel displays rich token data, chart renders with all indicators and timeframes, back navigation works

**Volume Profile Analysis**
- Functionality: Horizontal histogram showing volume traded at each price level, highlighting high-volume nodes and price distribution
- Purpose: Identify key price levels where most trading activity occurred, which often act as support/resistance
- Trigger: Navigate to Volume tab in dashboard
- Progression: User clicks Volume tab → Volume profile chart renders → Shows distribution of volume across price levels → Displays total volume, average volume, max volume, and high-volume bar count → Hover shows detailed volume at each price level
- Success criteria: Volume profile renders accurately, shows price levels with highest activity, color intensity reflects volume concentration, tooltip displays detailed information

**AI-Powered Repository Analysis Chat**
- Functionality: Interactive chat interface where users can select specific repositories and receive AI-powered analysis, recommendations, and insights about repository health, code quality, and best practices
- Purpose: Provide personalized, context-aware guidance for improving repository health through conversational AI that understands the specific metrics and context of each repository
- Trigger: Click floating AI chat button in bottom-right corner
- Progression: User clicks AI button → Chat panel opens with greeting → User selects repository from dropdown → User can ask questions or click "Analyze" for automatic analysis → AI receives full repository context (health score, metrics, issues, language, etc.) → Provides tailored recommendations → Conversation persists with repository context displayed → User can switch repositories mid-conversation → Chat remembers conversation history
- Success criteria: Repository selector shows all available repos with health scores, selected repo context is visible in messages, AI responses are relevant to specific repository metrics, analyze button triggers detailed health analysis, conversation flows naturally with context awareness

## Edge Case Handling

- **No Repositories Available** - Display empty state with helpful message and action to connect GitHub account
- **OAuth Flow Interruption** - Handle user canceling OAuth, show message to retry authentication
- **Expired Access Token** - Detect 401 errors and prompt user to re-authenticate
- **GitHub API Rate Limiting** - Display rate limit status, show time until reset, gracefully degrade to cached data
- **Network Errors** - Show error toast, retry button, and graceful degradation to last known data
- **No GitHub Connection** - Show prominent call-to-action to connect GitHub before scanning repositories
- **Invalid Alert Configuration** - Form validation prevents saving alerts with missing/invalid threshold values
- **Alert Sound Failure** - Gracefully degrade to visual-only notifications if Web Audio API is unavailable
- **Multiple Simultaneous Alerts** - Queue sound notifications to prevent audio overlap, show combined toast
- **Alert Cooldown** - Prevent alert from re-triggering for 60 seconds after first trigger to avoid notification spam
- **Role Permission Mismatch** - Gracefully hide features not available to current role without breaking UI
- **Watchlist Limit** - Optional cap at reasonable number (e.g., 50 tokens) with warning message
- **Concurrent Updates** - Handle race conditions when multiple tabs modify watchlist/alerts using functional updates
- **Chart Rendering Issues** - Fallback to simpler bar chart if D3 fails, show loading state during data generation
- **Empty Chart Data** - Display message when no historical data available for selected timeframe
- **Indicator Calculation Errors** - Gracefully handle insufficient data for technical indicators (e.g., need 14+ points for RSI)
- **Volume Profile Binning** - Adjust number of price bins based on data volatility to ensure meaningful distribution
- **Support/Resistance Detection** - Filter out duplicate levels within threshold to prevent cluttered chart display
- **AI Chat Without Repositories** - Show helpful message and general repository advice when no repos are loaded
- **AI Response Errors** - Display error toast and graceful fallback message if LLM call fails
- **Long Chat Conversations** - Auto-scroll to latest message, maintain chat history in state
- **Repository Context Switching** - Clear indication when user switches repository mid-conversation
- **Admonition Scan Failures** - Display error message if scan fails, allow retry, gracefully handle empty results
- **No Admonitions Found** - Show friendly empty state when repository has no code markers
- **PR Suggestion Generation Errors** - Show error toast if AI fails to generate suggestions, allow retry
- **Empty PR Suggestions** - Handle case where AI generates no suggestions for very healthy repos
- **Analysis in Progress** - Show loading state during analysis, prevent duplicate analysis requests
- **Large Admonition Lists** - Implement scrolling and filtering for repos with 100+ markers

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
  - Tabs: shadcn Tabs for main navigation between All Tokens/Watchlist/Charts/Volume/Alerts
  - Card: shadcn Card for metric displays and content containers
  - Table: Custom sortable table with hover states and row actions
  - Dialog: shadcn Dialog for alert creation and token details
  - Badge: shadcn Badge for status indicators (price change %, alert status, RSI conditions)
  - Button: shadcn Button with glow effects on primary actions
  - Switch: shadcn Switch for alert toggles and chart indicator options
  - Select: shadcn Select for token selection and MA period
  - Custom PriceChart: D3-powered line chart with area fill, gridlines, interactive crosshair, EMA overlays, and support/resistance levels
  - Custom CandlestickChart: D3-powered OHLC visualization with volume bars
  - Custom IndicatorChart: Multi-panel chart displaying price with Bollinger Bands, RSI oscillator, and MACD histogram with signal lines
  - Custom VolumeAnalysis: Horizontal volume profile showing price distribution with color-coded intensity
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
  - ChartLine for line charts and analytics
  - ChartLineUp for candlestick charts
  - ChartBar for volume analysis and indicators
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
