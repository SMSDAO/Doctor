# Jupiter Scan - Complete Workflow Guide

## Overview

Jupiter Scan is a sophisticated Solana token monitoring platform with advanced charting, real-time price tracking, intelligent alert management, and sound notifications. The application features three distinct user roles (User, Admin, Developer) with dedicated panels and workflows.

---

## 🎨 Visual Design

### Blue-Purple Glow Aesthetic
- **Primary Color**: Vivid purple (oklch(0.50 0.25 285))
- **Accent Color**: Electric blue-purple (oklch(0.65 0.20 240))
- **Background**: Deep blue-black (oklch(0.10 0.03 270))
- **Effects**: Enhanced glow effects with `glow-blue`, `glow-purple`, `glow-accent` classes
- **Animations**: Pulsing glow backgrounds, smooth transitions, hover states

---

## 👤 User Role Workflow

### Dashboard Access
1. **Default View**: User dashboard with four metric cards
   - Total Market Cap (all tracked tokens)
   - 24h Volume (aggregate trading volume)
   - Avg Price Change (market sentiment indicator)
   - Active Alerts (monitoring status)

2. **Navigation Tabs**:
   - **All Tokens**: Complete token scanner
   - **Watchlist**: Starred favorites
   - **Charts**: Historical price visualization
   - **Alerts**: Price alert management

### Token Scanner Workflow
1. View real-time token prices in sortable table
2. Sort by: Token, Price, 24h Change, Volume, Market Cap
3. Hover over rows for quick actions:
   - **Star Icon**: Add/remove from watchlist
   - **Bell Icon**: Create price alert
   - **Eye Icon**: View detailed analytics

### Watchlist Management
1. Click star icon on any token to add to watchlist
2. Access watchlist via dedicated tab
3. Remove tokens by clicking star again
4. Persists across sessions using `useKV`

### Alert Creation Workflow
1. Click bell icon or "Create Alert" button
2. Dialog opens with alert configuration:
   - **Condition**: Above, Below, % Increase, % Decrease, Volume Spike
   - **Threshold**: Numeric value or percentage
   - **Sound Notification**: Enable/disable audio alerts
   - **Test Sound**: Preview alert sound before saving
3. Save alert → Appears in Alerts tab
4. Real-time monitoring begins automatically

### Alert Monitoring Workflow
1. Active alerts shown in header badge (pulsing bell icon)
2. Background monitor checks prices every update (30s)
3. When condition met:
   - **Visual**: Toast notification appears (top-right)
   - **Audio**: Sound plays (if enabled) - 440Hz beep for 0.3s
   - **Status**: Alert marked as triggered with timestamp
   - **Auto-deactivation**: Alert deactivates to prevent spam
4. View triggered alerts in Alert History panel
5. Toggle alerts on/off or delete as needed

### Historical Charts Workflow
1. Navigate to **Charts** tab
2. Select token from dropdown
3. Choose timeframe: 1H, 24H, 7D, 30D, 90D, 1Y
4. Switch between **Line Chart** and **Candlestick Chart**
5. Toggle overlays:
   - **Volume bars** (bottom panel)
   - **Moving Average** (7, 14, or 30 day)
6. Hover for detailed data points with tooltip
7. Charts generated with D3.js for smooth interactions

### Token Detail Workflow
1. Click any token row in scanner
2. Detail dialog opens with:
   - Large interactive price chart
   - Token metadata (address, holders, liquidity)
   - Quick actions: Add to watchlist, Create alert
   - All timeframe options
   - Chart type switching
3. Close dialog to return to main view

---

## 🛡️ Admin Role Workflow

### Admin Panel Access
1. Switch role to "Admin" in header dropdown
2. Dashboard changes to admin-specific view

### System Monitoring
1. **Metric Cards**:
   - Active Users (with growth percentage)
   - RPC Endpoints (active/total ratio)
   - Avg Response Time (performance indicator)
   - Success Rate (reliability metric)

2. **System Status Panel**:
   - Database health check
   - Cache status
   - API availability
   - Background jobs status

3. **Recent Activity Panel**:
   - New users today
   - Alerts triggered (24h)
   - API calls (24h)
   - Failed requests

### RPC Endpoint Management
1. View all configured Solana RPC endpoints
2. Each endpoint shows:
   - Name and URL
   - Active/Inactive status badge
   - Response time (ms)
   - Success rate (%)
3. **Actions**:
   - Enable/Disable endpoints
   - Monitor performance metrics
   - Configure failover settings

### Configuration Workflow
1. Monitor endpoint health in real-time
2. Disable underperforming endpoints
3. Enable backup endpoints as needed
4. View aggregated performance metrics
5. Toast notifications confirm changes

---

## 💻 Developer Role Workflow

### Developer Panel Access
1. Switch role to "Developer" in header dropdown
2. Access API management tools

### API Key Management Workflow
1. **Create API Key**:
   - Enter descriptive name (e.g., "Production", "Testing")
   - Click "Create" button
   - Key instantly generated: `jsk_` prefix + random string
   - Displayed with copy button
   - Toast confirms creation

2. **View API Keys**:
   - List of all created keys
   - Shows: Name, Key string, Request count, Last used date
   - Each key has copy and delete actions

3. **Copy Key**:
   - Click copy icon
   - Key copied to clipboard
   - Toast notification confirms

4. **Delete Key**:
   - Click delete button
   - Key immediately removed
   - Persists using `useKV`

### API Playground Workflow
1. **Test Endpoints**:
   - Enter endpoint name (e.g., `getAccountInfo`)
   - Add JSON parameters
   - Click "Test Request"
   - View formatted response below

2. **Example Request**:
   ```json
   {
     "address": "11111111111111111111111111111111"
   }
   ```

3. **Example Response**:
   ```json
   {
     "success": true,
     "data": {
       "lamports": 1000000000,
       "owner": "11111...",
       "executable": false
     },
     "timestamp": "2024-01-15T10:30:00.000Z"
   }
   ```

### API Documentation Panel
1. **Authentication Guide**:
   - Header-based authentication
   - Example curl commands
   - Key usage patterns

2. **Available Endpoints**:
   - `GET /v1/tokens` - List all tokens
   - `GET /v1/tokens/:address` - Get token details
   - `GET /v1/prices` - Get current prices
   - `POST /v1/alerts` - Create price alert

3. **Rate Limiting**:
   - 1000 requests/minute per key
   - Displayed in metrics

---

## 🔄 Data Persistence

All user data persists across sessions using `useKV`:

### Stored Data
- **Watchlist**: Array of token IDs (`watchlist`)
- **Alerts**: Array of alert objects (`alerts`)
- **API Keys**: Array of key objects (`api-keys`)
- **User Role**: Selected role preference (`user-role`)

### Data Safety
- Functional updates prevent race conditions
- Multi-tab synchronization supported
- No data loss on refresh

---

## 🎯 Key Features Summary

### Real-Time Monitoring
- 30-second automatic price updates
- Manual refresh button with loading state
- Live alert condition checking

### Sound Notifications
- Configurable per-alert
- Test before enabling
- 440Hz beep (0.3s duration)
- Prevents audio overlap with cooldown

### Advanced Analytics
- D3-powered charts
- Multiple timeframes
- Candlestick and line views
- Moving average overlays
- Volume visualization

### Multi-Role Support
- **User**: Trading and monitoring
- **Admin**: System management
- **Developer**: API integration

### Visual Excellence
- Blue-purple glow aesthetic
- Smooth animations
- Hover effects on all interactive elements
- Responsive design (mobile-friendly)
- Gradient backgrounds with blur effects

---

## 🚀 Quick Start Guide

1. **First Time User**:
   - App loads with default User role
   - View all tokens in scanner
   - Star favorites to build watchlist
   - Create alerts for price movements

2. **Admin Setup**:
   - Switch to Admin role
   - Review RPC endpoint health
   - Monitor system metrics
   - Check recent activity

3. **Developer Integration**:
   - Switch to Developer role
   - Create API key
   - Test endpoints in playground
   - Review documentation
   - Integrate with external apps

---

## 📊 Data Flow

### Token Data
1. Mock data generated on app load
2. Prices update every 30 seconds
3. Sort and filter in real-time
4. No external API calls (demo mode)

### Alert System
1. User creates alert
2. Saved to persistent storage
3. Background monitor checks conditions
4. Triggers notification when met
5. Updates alert status
6. Logs trigger timestamp

### Role Switching
1. User selects role from dropdown
2. Preference saved to `useKV`
3. Main content swaps to role panel
4. Header updates to show role
5. Persists on refresh

---

## 🎨 Visual Effects Guide

### Glow Classes
- `.glow-text` - Text glow (title elements)
- `.glow-border` - Border glow (cards, inputs)
- `.glow-accent` - Blue glow (CTAs, active states)
- `.glow-purple` - Purple glow (badges, highlights)
- `.glow-blue` - Electric blue glow (hover states)
- `.glow-intense` - Strong glow (important elements)
- `.animate-pulse-glow` - Animated pulsing glow (backgrounds)

### Component Enhancements
- Metric cards: Gradient backgrounds + hover glow
- Table rows: Left border accent on hover
- Buttons: Glow effect on primary actions
- Inputs: Focus glow rings
- Badges: Role-based glow colors
- Charts: Gradient fills and smooth animations

---

## 🔧 Technical Architecture

### Frontend Stack
- React 19.2.0
- TypeScript
- Tailwind CSS (v4)
- shadcn/ui components
- Phosphor Icons
- Framer Motion (animations)
- D3.js (charts)
- Sonner (toasts)

### State Management
- React hooks (useState, useEffect)
- useKV for persistence
- Functional updates for safety

### Sound System
- Web Audio API
- OscillatorNode for tones
- GainNode for volume control
- Graceful degradation if unavailable

---

## 📝 Future Enhancements

- Real Solana RPC integration
- WebSocket price streams
- User authentication
- Portfolio tracking
- Advanced charting indicators
- Export alerts/watchlist
- Email notifications
- Mobile app

---

**Built with ⚡ and 💜 for the Solana ecosystem**
