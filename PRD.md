# Planning Guide

A Solana token scanner and price monitoring platform that provides real-time market insights, watchlist management, and smart alert systems with a futuristic digital aesthetic.

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
- Progression: App loads → Fetch token data → Display in sortable table → Auto-refresh every 30s → User can sort/filter
- Success criteria: Table displays accurate mock data, sorting works, refresh indicator shows updates

**Watchlist Management**
- Functionality: Users can add/remove tokens to personal watchlist with persistent storage
- Purpose: Allows traders to track specific tokens of interest without scanning the entire market
- Trigger: Click star icon on any token row
- Progression: User views token → Clicks star → Token added to watchlist → Toast confirmation → Persists across sessions
- Success criteria: Watchlist saves to useKV, toggle works instantly, filtered view shows only watched tokens

**Smart Alert System**
- Functionality: Configure price alerts with conditions (above/below, % change, volume spike)
- Purpose: Enables automated monitoring so users don't miss important market movements
- Trigger: Click "Create Alert" button or alert icon on token
- Progression: User selects token → Opens alert modal → Sets condition & threshold → Saves alert → System checks on refresh → Notification on trigger
- Success criteria: Alerts persist in useKV, modal form validates input, alerts display in dedicated panel

**Role-Based Panels**
- Functionality: Three distinct interfaces (User Dashboard, Admin Panel, Developer Tools)
- Purpose: Separates concerns and provides appropriate tools for different user types
- Trigger: Role selector in header or user profile setting
- Progression: User selects role → Interface updates → Role-specific features appear → Previous role features hidden
- Success criteria: Each role shows unique content, admin sees user management, developer sees API tools

**Token Detail View**
- Functionality: Comprehensive analytics for individual tokens including price history, metadata, and risk metrics
- Purpose: Deep-dive analysis for informed decision-making
- Trigger: Click on token row in scanner
- Progression: User clicks token → Detail view slides in → Loads token analytics → Shows chart & metrics → User can set alerts
- Success criteria: Detail panel displays rich token data, chart renders, back navigation works

## Edge Case Handling

- **No Tokens Available** - Display empty state with helpful message and action to refresh or check connection
- **Network Errors** - Show error toast, retry button, and graceful degradation to last known data
- **Invalid Alert Configuration** - Form validation prevents saving alerts with missing/invalid threshold values
- **Role Permission Mismatch** - Gracefully hide features not available to current role without breaking UI
- **Watchlist Limit** - Optional cap at reasonable number (e.g., 50 tokens) with warning message
- **Concurrent Updates** - Handle race conditions when multiple tabs modify watchlist/alerts using functional updates

## Design Direction

The design should evoke the feeling of a high-tech command center for crypto trading - think cyberpunk meets professional terminal interfaces. Users should feel like they're interfacing with advanced blockchain technology through glowing data streams, smooth transitions, and a sophisticated color palette that balances readability with visual excitement.

## Color Selection

The color scheme draws inspiration from Solana's signature purple/teal palette mixed with Neo-Tokyo cyberpunk aesthetics, using high-contrast glowing accents against deep backgrounds.

- **Primary Color**: Deep purple (oklch(0.38 0.19 300)) - Represents premium blockchain technology, creates sophisticated foundation
- **Secondary Colors**: 
  - Dark background (oklch(0.12 0.01 285)) - Almost black with subtle purple tint for depth
  - Card surface (oklch(0.18 0.03 290)) - Slightly lighter than background for layering
- **Accent Color**: Electric cyan (oklch(0.75 0.15 195)) - High-energy glow for CTAs, price increases, and interactive elements
- **Foreground/Background Pairings**: 
  - Primary purple (oklch(0.38 0.19 300)): White text (oklch(0.98 0 0)) - Ratio 5.2:1 ✓
  - Dark background (oklch(0.12 0.01 285)): Light gray text (oklch(0.85 0.02 290)) - Ratio 12.1:1 ✓
  - Accent cyan (oklch(0.75 0.15 195)): Dark text (oklch(0.12 0.01 285)) - Ratio 10.3:1 ✓
  - Success green (oklch(0.65 0.18 150)): Dark background - Ratio 8.1:1 ✓
  - Danger red (oklch(0.60 0.22 25)): Dark background - Ratio 6.8:1 ✓

## Font Selection

Typography should feel technical and precise while maintaining excellent readability for dense financial data, combining a modern grotesque for UI with a monospace for numerical data.

- **Typographic Hierarchy**: 
  - H1 (Panel Titles): Space Grotesk Bold / 32px / -0.02em tracking / 1.1 line-height
  - H2 (Section Headers): Space Grotesk Semibold / 24px / -0.01em tracking / 1.2 line-height
  - H3 (Card Titles): Space Grotesk Medium / 18px / normal tracking / 1.3 line-height
  - Body (UI Text): Space Grotesk Regular / 15px / normal tracking / 1.5 line-height
  - Data (Prices/Numbers): JetBrains Mono Medium / 14px / normal tracking / 1.4 line-height
  - Caption (Labels): Space Grotesk Regular / 13px / 0.01em tracking / 1.4 line-height

## Animations

Animations should feel snappy and purposeful, reinforcing the high-tech aesthetic without causing delays. Use glowing transitions for state changes and smooth slide-ins for panels.

Motion creates a sense of living data streams and responsive interfaces. Price updates pulse with subtle glow effects. Panel transitions slide smoothly with slight blur. Loading states use animated gradients rather than spinners. Hover states brighten with quick easing. All animations complete within 200-300ms to maintain snappy feel.

## Component Selection

- **Components**: 
  - Table: Custom sortable table with hover states and row actions (not shadcn due to complex customization needs)
  - Card: shadcn Card for stat displays and panel containers
  - Dialog: shadcn Dialog for alert creation and token details
  - Button: shadcn Button with variants for primary/secondary/ghost actions
  - Badge: shadcn Badge for status indicators (online, price change %, role)
  - Tabs: shadcn Tabs for switching between dashboard sections
  - Input/Select: shadcn form components for alert configuration
  - Popover: shadcn Popover for quick actions menu on token rows
  - Switch: shadcn Switch for watchlist toggles and settings
  - Toast: sonner for notifications on alerts, errors, success messages
  
- **Customizations**: 
  - Custom PriceChart component using D3 for historical price visualization
  - Custom GlowingNumber component that animates value changes with color coding
  - Custom TokenIcon component with fallback gradients for missing images
  - Custom MetricCard component with animated counters and trend indicators
  
- **States**: 
  - Buttons: Default has subtle border glow, hover brightens accent color, active scales down slightly (0.97), disabled reduces opacity to 40%
  - Inputs: Default has muted border, focus adds glowing accent ring, error adds red glow, success adds green checkmark
  - Table rows: Hover adds subtle background glow and left border accent, selected adds stronger background, active press darkens slightly
  
- **Icon Selection**: 
  - Star (outline/filled) for watchlist toggle
  - Bell for alert creation
  - TrendUp/TrendDown for price changes
  - Eye for viewing details
  - Gear for settings
  - ChartBar for analytics
  - Lightning for quick actions
  - User/Users for role panels
  - Code for developer tools
  
- **Spacing**: 
  - Page padding: p-6 (24px)
  - Card padding: p-6 interior, gap-6 between cards
  - Table cell padding: px-4 py-3
  - Section gaps: gap-8 for major sections, gap-4 for related items
  - Button padding: px-6 py-2.5 for default, px-4 py-2 for small
  
- **Mobile**: 
  - Stack cards vertically with full width
  - Table becomes card-based list on <768px with key metrics prioritized
  - Side panels slide in from bottom as full-screen modals
  - Reduce padding to p-4 globally
  - Tab navigation becomes scrollable horizontal strip
  - Sticky header with condensed navigation
  - Hide secondary columns in tables, show on row expand
