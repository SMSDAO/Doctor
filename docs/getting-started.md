# Quick Start Guide

Get up and running with AlgoBrainDoctor in minutes! This guide will help you understand and use the platform quickly.

## What is AlgoBrainDoctor?

AlgoBrainDoctor is an advanced GitOps health monitoring system that:
- 🔄 **Self-Heals** - Automatically detects and recovers from errors
- ⚡ **Monitors in Real-Time** - Tracks repository health with live scores (0-100)
- 🎛️ **Orchestrates Workers** - Manages 12 parallel specialized workers
- 📊 **Provides Insights** - Offers detailed analytics and health breakdowns
- 🔍 **Tracks Identities** - Monitors developer contributions and claims

## Prerequisites

This is a browser-based Spark application. All you need is:
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (for live updates)

No installation required! 🎉

## First Steps

### 1. Launch the Application

Open the application in your browser. You'll be greeted with the main dashboard.

### 2. Select Your Role

Choose your role from the dropdown in the header:

- **👤 Operator** - Monitor repositories and fleet health
- **⚙️ Admin** - Manage system configuration and workers
- **📊 Analyst** - View analytics and insights
- **💻 Developer** - Access API tools and documentation

Each role provides a tailored interface with specific features.

## Operator Quick Start

As an Operator, you'll focus on monitoring repository health and system performance.

### View Repository Health

1. **Dashboard Overview**
   - See repository health scores (0-100)
   - Monitor health trends (24h changes)
   - Identify critical repositories

2. **Health Status Indicators**
   - 🟢 **Healthy** (80-100) - Repository in good condition
   - 🟡 **Warning** (50-79) - Needs attention
   - 🔴 **Critical** (0-49) - Requires immediate action

### Monitor Worker Status

1. **Worker Dashboard**
   - View all 12 parallel workers
   - Check heartbeat indicators
   - Monitor success rates (>99% target)

2. **Key Workers**
   - **IndexWorker** - Discovers repositories
   - **ScoreWorker** - Computes health scores
   - **AlertWorker** - Sends notifications
   - **RepairWorker** - Fixes data issues

### Review Healdec Actions

1. **Auto-Healing Log**
   - View autonomous recovery actions
   - See strategy badges (Retry, Restart, Rollback, etc.)
   - Track action outcomes

2. **Healdec Strategies**
   - **Retry** - Transient failure recovery
   - **Restart** - Worker process restart
   - **Quarantine** - Isolate problematic jobs
   - **Rollback** - Undo partial changes
   - **Escalate** - Alert on-call team

### Manage Watchlist

1. **Add Repositories**
   - Star important repositories
   - Build your personalized watchlist
   - Track specific repos

2. **Set Alerts**
   - Configure health thresholds
   - Get notified of critical changes
   - Monitor key metrics

## Admin Quick Start

As an Admin, you'll manage system configuration and user access.

### Worker Lifecycle Management

1. **Start/Stop Workers**
   - Control individual workers
   - Monitor worker health
   - View job queues

2. **Monitor Performance**
   - Track API latency (target: <500ms p95)
   - Check queue depth (target: <100 pending)
   - Monitor database connections (target: <80% pool)

### Identity Management

1. **Developer Identities**
   - View contributor profiles
   - Track identity claims
   - Resolve conflicts

2. **Repository Administration**
   - Manage repository metadata
   - Configure health rules
   - Set custom thresholds

## Analyst Quick Start

As an Analyst, you'll explore data and generate insights.

### System Analytics

1. **Health Score Distribution**
   - View overall repository health
   - Identify trends and patterns
   - Generate reports

2. **Healdec Strategy Analysis**
   - Analyze recovery patterns
   - Measure effectiveness
   - Optimize strategies

### Performance Metrics

1. **Worker Performance**
   - Success rates by worker type
   - Processing times
   - Error rates

2. **System Metrics**
   - Overall success rate (>99% target)
   - Healdec action rate (<5% target)
   - API performance trends

## Developer Quick Start

As a Developer, you'll integrate with the API and build tools.

### API Access

1. **Generate API Keys**
   - Create named keys
   - Secure credentials
   - Track usage

2. **Test Endpoints**
   - Use the API playground
   - Send test requests
   - Review responses

### SDK Examples

```bash
# Node.js Example
curl -X GET "https://api.algobraindoctor.io/v1/health/scores" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```python
# Python Example
import requests

headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.get(
    "https://api.algobraindoctor.io/v1/health/scores",
    headers=headers
)
print(response.json())
```

## Understanding Key Concepts

### Repository Health Scores

Health scores (0-100) are calculated based on:
- Code quality metrics
- Issue resolution time
- Pull request activity
- Contributor engagement
- Documentation completeness
- Test coverage

### Worker System

The platform runs 12 specialized workers in parallel:
- **Ingestion Workers** - Process incoming data
- **Analysis Workers** - Compute health metrics
- **Maintenance Workers** - System optimization
- **Alert Workers** - Notifications

### Auto-Healing (Healdec)

The Healdec engine automatically:
- Detects errors and failures
- Selects appropriate recovery strategy
- Executes remediation actions
- Logs all activities
- Escalates when needed

## System Metrics to Watch

Key indicators of system health:

| Metric | Target | Description |
|--------|--------|-------------|
| Worker Success Rate | >99% | Successful job completion rate |
| Healdec Action Rate | <5% | Percentage requiring auto-healing |
| API Latency (p95) | <500ms | 95th percentile response time |
| Queue Depth | <100 | Pending jobs in queue |
| DB Connections | <80% | Database connection pool usage |

## Data Persistence

All critical data is automatically saved:
- ✅ Watchlist (tracked repositories)
- ✅ Alerts (active monitoring rules)
- ✅ User preferences
- ✅ System configuration
- ✅ Role selection

Data persists across browser sessions using the `useKV` hook.

## Common Tasks

### Monitor a Repository
1. Select Operator role
2. Find repository in list
3. Click star to add to watchlist
4. Set alert threshold if needed

### Check Worker Health
1. Navigate to worker status panel
2. View heartbeat indicators
3. Check success rates
4. Review recent job history

### Generate Reports
1. Select Analyst role
2. Choose report type
3. Set date range
4. Export results

## Next Steps

Now that you're familiar with the basics, explore:

- [Architecture Overview](./architecture.md) - Understand the system design
- [Worker System](./workers.md) - Deep dive into worker architecture
- [Healdec Engine](./healdec.md) - Learn about auto-healing strategies
- [API Reference](./api-reference.md) - Complete API documentation

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🐛 [Troubleshooting Guide](./troubleshooting.md)
- ❓ [FAQ](./faq.md)
- 🤝 [Contributing](./contributing.md)

---

**Ready to dive deeper?** Continue with the [Architecture Overview](./architecture.md) to understand how everything works together.
