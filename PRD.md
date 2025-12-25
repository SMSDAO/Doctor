# Planning Guide

**Experience Qualities**: 

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
- Purpose: Allows traders to track specific tokens of interest without scanning the entire market
- Progression: User views token → Clicks star → Token added to watchlist → Toast confirmation → Persi

- Functionality: Configu
- Trigger: Click "Create Alert" button or alert icon on token
- Success criteria: Alerts persist in useKV, modal form validates input, alerts display in dedica
**Role-Based Panels**
- Purpose: Separates concerns and provides appropriate tools for different user types
- Progression: User selects role → Interface updates → Role-specific features appear → Previous role features

- Functionality: Compr
- Trigger: Click on token row in scanner
- Success criteria: Detail panel displays rich token data, chart renders, back navigat
## Edge Case Handling
- **No Tokens Available** - Display empty state with helpful message and action to refresh or check connection
- **Invalid Alert Configuration** - Form validation prevents saving alerts with missing/invalid threshold 


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


  - Table: Custom sortable table with hover states and row actions (not shadcn due to com
  - Dialog: shadcn Dialog for alert creation and token details
  - Badge: shadcn Badge for status indicators (online, price change %

  - Switch: shadc

  - Custom PriceChart component using D3 for historical price visualization

  
  - Buttons: Default has subtle border glow, hover brightens accent color, active sca
  - Table rows: Hover adds subtle background glow and left border accent, selected adds stro
- **Icon Selection**: 
  - Bell for alert creation
  - Eye for viewing details
  - ChartBar for analytics

  

  - Table cell padding: px-4 py-3

- **Mobile**: 

  - Reduce padding to 















































  - Tab navigation becomes scrollable horizontal strip
  - Sticky header with condensed navigation
  - Hide secondary columns in tables, show on row expand
