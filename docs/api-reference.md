# API Reference

Complete API documentation for AlgoBrainDoctor. This document covers all available endpoints, authentication, request/response formats, and examples.

> **API status:** AlgoBrainDoctor is currently a browser-only application. The HTTP API described in this document is **not yet available** and is planned for a future server-backed version. Endpoints, authentication, and rate limits documented here are **subject to change**.
## Base URL

```
https://api.algobraindoctor.io/v1
```

## Authentication

All API requests require authentication using an API key.

### API Key Format

API keys follow the format: `jsk_` followed by a random string.

Example: `jsk_1a2b3c4d5e6f7g8h9i0j`

### Authentication Header

Include your API key in the `Authorization` header:

```
Authorization: Bearer jsk_1a2b3c4d5e6f7g8h9i0j
```

### Example Request

```bash
curl -X GET "https://api.algobraindoctor.io/v1/repositories" \
  -H "Authorization: Bearer jsk_1a2b3c4d5e6f7g8h9i0j"
```

## Rate Limiting

API requests are rate limited based on your tier:

| Tier | Requests/Hour | Requests/Day |
|------|---------------|--------------|
| Free | 100 | 1,000 |
| Pro | 5,000 | 50,000 |
| Enterprise | Unlimited | Unlimited |

### Rate Limit Headers

```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
X-RateLimit-Reset: 1609459200
```

### Rate Limit Exceeded

**Status Code:** `429 Too Many Requests`

```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded your rate limit of 5000 requests per hour",
  "retryAfter": 3600
}
```

## Error Handling

### Error Response Format

```json
{
  "error": "ErrorType",
  "message": "Human-readable error description",
  "details": {
    "field": "specific field with error",
    "reason": "why it failed"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

## Endpoints

### Repositories

#### List Repositories

Get a list of all monitored repositories.

**Endpoint:** `GET /repositories`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 50, max: 100) |
| sort | string | No | Sort field (name, healthScore, updatedAt) |
| order | string | No | Sort order (asc, desc) |
| status | string | No | Filter by status (healthy, warning, critical) |
| language | string | No | Filter by language |

**Example Request:**

```bash
curl -X GET "https://api.algobraindoctor.io/v1/repositories?page=1&limit=20&sort=healthScore&order=asc" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "repo_123456",
      "name": "example/repository",
      "healthScore": 85,
      "status": "healthy",
      "language": "TypeScript",
      "lastUpdated": "2024-01-15T10:30:00.000Z",
      "metrics": {
        "stars": 1234,
        "forks": 456,
        "openIssues": 12,
        "pullRequests": 3
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8
  }
}
```

---

#### Get Repository

Get detailed information about a specific repository.

**Endpoint:** `GET /repositories/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Repository ID |

**Example Request:**

```bash
curl -X GET "https://api.algobraindoctor.io/v1/repositories/repo_123456" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`

```json
{
  "id": "repo_123456",
  "name": "example/repository",
  "fullName": "github/example",
  "url": "https://github.com/example/repository",
  "healthScore": 85,
  "status": "healthy",
  "language": "TypeScript",
  "description": "A sample repository",
  "metrics": {
    "codeQuality": 90,
    "issueResolution": 85,
    "prActivity": 80,
    "contributors": 85,
    "documentation": 75,
    "testCoverage": 88
  },
  "trend": {
    "change24h": 2,
    "change7d": 5,
    "direction": "up"
  },
  "lastScan": "2024-01-15T10:30:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### Get Repository Health History

Get historical health score data for a repository.

**Endpoint:** `GET /repositories/{id}/health/history`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Repository ID |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from | string | No | Start date (ISO 8601) |
| to | string | No | End date (ISO 8601) |
| interval | string | No | Data interval (hour, day, week) |

**Example Request:**

```bash
curl -X GET "https://api.algobraindoctor.io/v1/repositories/repo_123456/health/history?from=2024-01-01&to=2024-01-15&interval=day" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`

```json
{
  "repositoryId": "repo_123456",
  "from": "2024-01-01T00:00:00.000Z",
  "to": "2024-01-15T23:59:59.000Z",
  "interval": "day",
  "data": [
    {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "healthScore": 82
    },
    {
      "timestamp": "2024-01-02T00:00:00.000Z",
      "healthScore": 83
    }
  ]
}
```

---

### Workers

#### List Workers

Get the status of all workers.

**Endpoint:** `GET /workers`

**Example Request:**

```bash
curl -X GET "https://api.algobraindoctor.io/v1/workers" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "worker_index_01",
      "type": "IndexWorker",
      "status": "running",
      "heartbeat": "2024-01-15T10:30:00.000Z",
      "successRate": 99.5,
      "jobsProcessed": 1234,
      "lastJob": "2024-01-15T10:29:45.000Z"
    }
  ]
}
```

---

#### Get Worker

Get detailed information about a specific worker.

**Endpoint:** `GET /workers/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Worker ID |

**Example Request:**

```bash
curl -X GET "https://api.algobraindoctor.io/v1/workers/worker_index_01" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`

```json
{
  "id": "worker_index_01",
  "type": "IndexWorker",
  "status": "running",
  "heartbeat": "2024-01-15T10:30:00.000Z",
  "successRate": 99.5,
  "metrics": {
    "jobsProcessed": 1234,
    "jobsSucceeded": 1228,
    "jobsFailed": 6,
    "avgProcessingTime": 1250,
    "queueDepth": 3
  },
  "lastJob": {
    "id": "job_789",
    "type": "index_repos",
    "startTime": "2024-01-15T10:29:00.000Z",
    "endTime": "2024-01-15T10:29:45.000Z",
    "status": "completed"
  }
}
```

---

### Alerts

#### List Alerts

Get all configured alerts.

**Endpoint:** `GET /alerts`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by status (active, triggered, inactive) |
| repositoryId | string | No | Filter by repository |

**Example Request:**

```bash
curl -X GET "https://api.algobraindoctor.io/v1/alerts?status=active" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "alert_123",
      "repositoryId": "repo_123456",
      "repositoryName": "example/repository",
      "condition": "below",
      "threshold": 50,
      "status": "active",
      "createdAt": "2024-01-10T10:00:00.000Z",
      "lastChecked": "2024-01-15T10:30:00.000Z",
      "triggeredCount": 0
    }
  ]
}
```

---

#### Create Alert

Create a new alert for a repository.

**Endpoint:** `POST /alerts`

**Request Body:**

```json
{
  "repositoryId": "repo_123456",
  "condition": "below",
  "threshold": 50,
  "notificationEnabled": true
}
```

**Example Request:**

```bash
curl -X POST "https://api.algobraindoctor.io/v1/alerts" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryId": "repo_123456",
    "condition": "below",
    "threshold": 50,
    "notificationEnabled": true
  }'
```

**Response:** `201 Created`

```json
{
  "id": "alert_456",
  "repositoryId": "repo_123456",
  "condition": "below",
  "threshold": 50,
  "status": "active",
  "notificationEnabled": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### Update Alert

Update an existing alert.

**Endpoint:** `PUT /alerts/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Alert ID |

**Request Body:**

```json
{
  "threshold": 40,
  "status": "inactive"
}
```

**Example Request:**

```bash
curl -X PUT "https://api.algobraindoctor.io/v1/alerts/alert_456" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "threshold": 40,
    "status": "inactive"
  }'
```

**Response:** `200 OK`

```json
{
  "id": "alert_456",
  "repositoryId": "repo_123456",
  "condition": "below",
  "threshold": 40,
  "status": "inactive",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

---

#### Delete Alert

Delete an alert.

**Endpoint:** `DELETE /alerts/{id}`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Alert ID |

**Example Request:**

```bash
curl -X DELETE "https://api.algobraindoctor.io/v1/alerts/alert_456" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `204 No Content`

---

### Healdec Actions

#### List Healdec Actions

Get the auto-healing action log.

**Endpoint:** `GET /healdec/actions`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 50) |
| strategy | string | No | Filter by strategy |
| workerId | string | No | Filter by worker |
| outcome | string | No | Filter by outcome (success, failed) |

**Example Request:**

```bash
curl -X GET "https://api.algobraindoctor.io/v1/healdec/actions?strategy=retry&outcome=success" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "action_789",
      "timestamp": "2024-01-15T10:25:00.000Z",
      "strategy": "retry",
      "workerId": "worker_index_01",
      "error": "HTTP 503 Service Unavailable",
      "outcome": "success",
      "attempts": 2,
      "duration": 2000
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 23
  }
}
```

---

### System Metrics

#### Get System Metrics

Get overall system health metrics.

**Endpoint:** `GET /system/metrics`

**Example Request:**

```bash
curl -X GET "https://api.algobraindoctor.io/v1/system/metrics" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:** `200 OK`

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "workers": {
    "total": 12,
    "running": 12,
    "idle": 0,
    "error": 0,
    "successRate": 99.2
  },
  "healdec": {
    "actionRate": 3.5,
    "successRate": 87.3,
    "strategies": {
      "retry": 65,
      "restart": 15,
      "quarantine": 10,
      "rollback": 5,
      "escalate": 5
    }
  },
  "api": {
    "latencyP95": 245,
    "requestsPerMinute": 150,
    "errorRate": 0.8
  },
  "queue": {
    "depth": 23,
    "throughput": 45
  }
}
```

---

## Webhooks

AlgoBrainDoctor can send webhook notifications for various events.

### Configuration

Configure webhooks in the Developer panel or via API.

**Endpoint:** `POST /webhooks`

**Request Body:**

```json
{
  "url": "https://your-app.com/webhooks",
  "events": [
    "repository.health.changed",
    "alert.triggered",
    "worker.failed"
  ],
  "secret": "your_webhook_secret"
}
```

### Event Types

| Event | Description |
|-------|-------------|
| repository.health.changed | Health score changed significantly |
| repository.status.changed | Status changed (healthy → warning → critical) |
| alert.triggered | Alert condition met |
| alert.resolved | Alert condition no longer met |
| worker.failed | Worker entered error state |
| worker.recovered | Worker recovered from error |
| healdec.escalated | Healdec escalated to human |

### Webhook Payload

```json
{
  "event": "repository.health.changed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "repositoryId": "repo_123456",
    "repositoryName": "example/repository",
    "previousScore": 82,
    "currentScore": 75,
    "change": -7
  }
}
```

### Webhook Security

Verify webhook signatures using HMAC-SHA256:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}
```

---

## SDK Examples

### Node.js

```javascript
const axios = require('axios');

const API_KEY = 'jsk_your_api_key';
const BASE_URL = 'https://api.algobraindoctor.io/v1';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Get repositories
async function getRepositories() {
  const response = await client.get('/repositories');
  return response.data;
}

// Create alert
async function createAlert(repositoryId, threshold) {
  const response = await client.post('/alerts', {
    repositoryId,
    condition: 'below',
    threshold,
    notificationEnabled: true
  });
  return response.data;
}
```

### Python

```python
import requests

API_KEY = 'jsk_your_api_key'
BASE_URL = 'https://api.algobraindoctor.io/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Get repositories
def get_repositories():
    response = requests.get(f'{BASE_URL}/repositories', headers=headers)
    return response.json()

# Create alert
def create_alert(repository_id, threshold):
    data = {
        'repositoryId': repository_id,
        'condition': 'below',
        'threshold': threshold,
        'notificationEnabled': True
    }
    response = requests.post(f'{BASE_URL}/alerts', headers=headers, json=data)
    return response.json()
```

### cURL

```bash
# Get repositories
curl -X GET "https://api.algobraindoctor.io/v1/repositories" \
  -H "Authorization: Bearer jsk_your_api_key"

# Create alert
curl -X POST "https://api.algobraindoctor.io/v1/alerts" \
  -H "Authorization: Bearer jsk_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryId": "repo_123456",
    "condition": "below",
    "threshold": 50,
    "notificationEnabled": true
  }'
```

---

## Related Documentation

- [Getting Started](./getting-started.md) - Quick start guide
- [Developer Guide](./development.md) - Development setup
- [Workflows](./workflows.md) - User workflows
- [Troubleshooting](./troubleshooting.md) - Common issues

---

**Questions?** Check the [FAQ](./faq.md) or contact support.
