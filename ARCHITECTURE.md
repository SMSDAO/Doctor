# Jupiter Scan - PHP 8 Hybrid Architecture Design

## Overview
Scalable Solana explorer + analytics SaaS with role-based access, API monetization, and shared hosting compatibility.

---

## 1. FOLDER STRUCTURE

```
jupiter-scan-php/
├── public/
│   ├── index.php              # Entry point
│   ├── .htaccess              # Apache rewrites
│   └── assets/                # Static files
│
├── app/
│   ├── Core/                  # Framework core
│   │   ├── App.php
│   │   ├── Router.php
│   │   ├── Database.php
│   │   └── Auth.php
│   │
│   ├── Controllers/           # Request handlers
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   └── Api/
│   │       └── V1/
│   │           ├── TokenController.php
│   │           ├── AlertController.php
│   │           └── RpcController.php
│   │
│   ├── Services/              # Business logic
│   │   ├── Solana/
│   │   │   ├── RpcClient.php
│   │   │   ├── PriceScanner.php
│   │   │   └── AlertEngine.php
│   │   └── Billing/
│   │       ├── SubscriptionService.php
│   │       └── UsageTracker.php
│   │
│   ├── Repositories/          # Data access
│   │   ├── UserRepository.php
│   │   ├── TokenRepository.php
│   │   └── ApiKeyRepository.php
│   │
│   ├── Middleware/            # Request filters
│   │   ├── AuthMiddleware.php
│   │   ├── RoleMiddleware.php
│   │   └── RateLimitMiddleware.php
│   │
│   └── Models/                # Data entities
│       ├── User.php
│       ├── Token.php
│       └── Alert.php
│
├── config/
│   ├── app.php                # App settings
│   ├── database.php           # DB config
│   └── solana.php             # RPC endpoints
│
├── database/
│   └── migrations/            # SQL schemas
│
├── install/                   # Web installer
│   └── index.php
│
├── cron/                      # Background jobs
│   ├── scan_prices.php
│   └── process_alerts.php
│
├── storage/
│   ├── logs/
│   └── cache/
│
└── .env                       # Environment vars
```

---

## 2. MODULE RESPONSIBILITIES

### Core Modules
- **Router**: Routes HTTP requests to controllers (supports `/api/v1/`, `/admin/`, `/user/`)
- **Auth**: Session + JWT authentication, password hashing (bcrypt)
- **Database**: PDO wrapper with prepared statements, connection pooling
- **Validator**: Input sanitization, XSS/SQL injection prevention

### Service Layer
- **SolanaRpcClient**: Handles RPC calls to Solana nodes (retry logic, failover)
- **PriceScanner**: Polls Jupiter/Raydium for token prices (cron-based)
- **AlertEngine**: Monitors price thresholds, sends notifications
- **SubscriptionService**: Manages user plans (Free/Pro/Enterprise)
- **UsageTracker**: Tracks API calls per user/key

### Repository Layer
- Abstracts MySQL queries
- Returns domain models
- Handles pagination, filtering

---

## 3. ROLE-BASED ACCESS DESIGN

### Roles Hierarchy
```
SUPERADMIN (role_id: 1)
  └── Manage admins, system config, billing

ADMIN (role_id: 2)
  └── User management, RPC monitoring, logs

DEVELOPER (role_id: 3)
  └── API keys, RPC endpoint testing, docs

USER (role_id: 4)
  └── Watchlist, alerts, basic dashboard
```

### Permission Matrix
| Feature              | User | Developer | Admin | SuperAdmin |
|---------------------|------|-----------|-------|------------|
| View Tokens         | ✓    | ✓         | ✓     | ✓          |
| Create Alerts       | ✓    | ✓         | ✓     | ✓          |
| API Access          | ✗    | ✓         | ✓     | ✓          |
| Manage Users        | ✗    | ✗         | ✓     | ✓          |
| Manage RPC Nodes    | ✗    | ✓         | ✓     | ✓          |
| Billing Config      | ✗    | ✗         | ✗     | ✓          |

### Implementation
```php
// Middleware checks role
if (!Auth::hasRole(['admin', 'superadmin'])) {
    return response()->json(['error' => 'Forbidden'], 403);
}
```

---

## 4. API LAYOUT

### Endpoints Structure
```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /register
│   └── POST /refresh-token
│
├── tokens/
│   ├── GET /list?page=1&limit=20
│   ├── GET /{address}
│   └── GET /{address}/price-history
│
├── alerts/
│   ├── GET /list
│   ├── POST /create
│   ├── PUT /{id}
│   └── DELETE /{id}
│
├── rpc/
│   ├── POST /proxy              # Proxies RPC calls
│   └── GET /endpoints/status
│
└── admin/
    ├── GET /users
    ├── GET /stats
    └── POST /users/{id}/suspend
```

### Authentication
- **Sessions**: For web dashboard (cookie-based)
- **JWT**: For API clients (Bearer token in header)
- **API Keys**: For developer tier (`X-API-Key` header)

### Rate Limiting
- Free: 100 requests/hour
- Pro: 5,000 requests/hour
- Enterprise: Unlimited

---

## 5. MONETIZATION HOOKS

### Subscription Tiers
```php
// config/billing.php
return [
    'tiers' => [
        'free' => [
            'price' => 0,
            'alerts' => 5,
            'api_calls' => 100,
            'features' => ['basic_scan']
        ],
        'pro' => [
            'price' => 29,
            'alerts' => 50,
            'api_calls' => 5000,
            'features' => ['basic_scan', 'advanced_analytics', 'priority_support']
        ],
        'enterprise' => [
            'price' => 299,
            'alerts' => 'unlimited',
            'api_calls' => 'unlimited',
            'features' => ['all', 'custom_rpc', 'dedicated_support']
        ]
    ]
];
```

### Database Schema for Billing
```sql
CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    tier ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
    status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
    expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE usage_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    endpoint VARCHAR(255),
    response_time INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (user_id, created_at)
);
```

### Usage Enforcement
```php
// In ApiMiddleware
$usage = UsageTracker::getDailyCount($userId);
$limit = SubscriptionService::getLimit($userId, 'api_calls');

if ($usage >= $limit) {
    return response()->json([
        'error' => 'Rate limit exceeded',
        'upgrade_url' => '/pricing'
    ], 429);
}
```

---

## 6. SECURITY BOUNDARIES

### Layer 1: Input Validation
```php
// All inputs sanitized
$address = Validator::sanitize($_POST['address']);
$address = Validator::validateSolanaAddress($address);
```

### Layer 2: Authentication
```php
// JWT with short expiry
$token = JWT::encode([
    'user_id' => $user->id,
    'role' => $user->role,
    'exp' => time() + 3600  // 1 hour
], env('JWT_SECRET'));
```

### Layer 3: Authorization
```php
// Role middleware on sensitive routes
Router::group(['middleware' => ['auth', 'role:admin']], function() {
    Router::get('/admin/users', 'AdminController@users');
});
```

### Layer 4: Data Access
```php
// Repository filters by user ownership
public function getUserAlerts($userId) {
    return $this->db->query(
        "SELECT * FROM alerts WHERE user_id = ? AND deleted_at IS NULL",
        [$userId]
    );
}
```

### Layer 5: Environment Isolation
```
.env (not in git)
  └── DB_PASSWORD=xxx
  └── JWT_SECRET=xxx
  └── RPC_KEY=xxx
```

### CSRF Protection
```php
// All POST/PUT/DELETE require CSRF token
if (!CSRF::validate($_POST['csrf_token'])) {
    throw new SecurityException('Invalid CSRF token');
}
```

### SQL Injection Prevention
```php
// Always use prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
```

### XSS Prevention
```php
// Escape output in views
echo htmlspecialchars($user->name, ENT_QUOTES, 'UTF-8');
```

---

## 7. DEPLOYMENT FLOW

### Installation (domain.com/install)
1. Check PHP >= 8.1, MySQL, PDO, cURL extensions
2. Test file permissions on `/storage`, `/cache`
3. Collect DB credentials
4. Write `.env` file
5. Run migrations
6. Create default admin (email: admin@example.com, password: auto-generated)
7. Lock installer (creates `.installed` file)

### Shared Hosting Compatibility
- No composer dependencies at runtime (bundle all)
- `.htaccess` for Apache mod_rewrite
- PHP sessions (no Redis/Memcached required)
- File-based cache fallback

### Cron Jobs (via cPanel or system cron)
```bash
# Every 30 seconds (price scanning)
*/1 * * * * php /path/to/cron/scan_prices.php

# Every 5 minutes (alert processing)
*/5 * * * * php /path/to/cron/process_alerts.php

# Daily (cleanup old logs)
0 0 * * * php /path/to/cron/cleanup.php
```

---

## 8. SCALABILITY CONSIDERATIONS

### Database Optimization
- Index on `tokens.address`, `alerts.user_id`, `usage_logs.created_at`
- Archive old price data (keep 90 days hot, rest in archive table)
- Use `SELECT *` sparingly, specify columns

### Caching Strategy
```php
// Cache token list for 60 seconds
$tokens = Cache::remember('tokens.list', 60, function() {
    return TokenRepository::getAll();
});
```

### RPC Failover
```php
// config/solana.php
return [
    'rpc_endpoints' => [
        'primary' => 'https://api.mainnet-beta.solana.com',
        'backup' => [
            'https://rpc.ankr.com/solana',
            'https://solana-api.projectserum.com'
        ]
    ]
];
```

### Horizontal Scaling
- Stateless API (JWT tokens, no server-side sessions for API)
- Load balancer ready (health check endpoint: `/api/v1/health`)
- Separate read replicas for heavy analytics queries

---

## 9. KEY ARCHITECTURAL DECISIONS

### Why PHP 8?
- Widely available on shared hosting
- No build process needed
- Strong typing (PHP 8+ features)
- Fast enough for I/O-bound blockchain operations

### Why Custom Framework?
- Lightweight (no Laravel/Symfony overhead)
- Full control over routing, auth, caching
- Easy to understand for contributors

### Why File-Based Sessions?
- Works on any hosting (no Redis requirement)
- Can upgrade to Redis/Memcached later via config

### Why Cron-Based Scanning?
- Shared hosting doesn't support long-running processes
- Cron is universally available
- Can migrate to queues (RabbitMQ/SQS) on VPS

---

## 10. CONTRIBUTOR GUIDELINES

### Adding New Features
1. Create service in `app/Services/`
2. Add repository in `app/Repositories/`
3. Create controller in `app/Controllers/Api/V1/`
4. Register route in `app/Core/Router.php`
5. Add migration in `database/migrations/`

### Code Style
- PSR-12 compliant
- Type hints on all methods
- DocBlocks for public methods

### Testing
- PHPUnit for unit tests
- Integration tests for API endpoints
- Mock Solana RPC calls in tests

---

## NEXT STEPS
1. Scaffold folder structure
2. Build core framework (Router, Auth, Database)
3. Implement Solana RPC client
4. Create web installer
5. Build role-based dashboards
6. Add billing/usage tracking
7. Deploy and test on shared hosting

---

**Architecture Status**: ✅ Design Complete | Ready for Implementation
