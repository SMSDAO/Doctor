# Frequently Asked Questions (FAQ)

Common questions about AlgoBrainDoctor answered. If you don't find your answer here, check the [Troubleshooting Guide](./troubleshooting.md) or open a discussion.

## General Questions

### What is AlgoBrainDoctor?

AlgoBrainDoctor is an advanced GitOps health monitoring system that continuously scans repositories, tracks developer identities, computes health scores, and automatically remediates issues through intelligent auto-healing strategies.

### Is AlgoBrainDoctor free to use?

Yes, the application is open source under the MIT License. You can use it freely for personal and commercial projects.

### Does it require a backend server?

No! AlgoBrainDoctor runs entirely in the browser using React and modern web technologies. All data is stored locally in your browser's localStorage.

### What browsers are supported?

AlgoBrainDoctor works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Can I use it on mobile devices?

Yes, the UI is responsive and works on tablets and smartphones, though the experience is optimized for desktop use.

## Features & Functionality

### How are repository health scores calculated?

Health scores (0-100) are computed using a weighted formula:

```
Health Score = (
  Code Quality × 0.25 +
  Issue Resolution × 0.20 +
  PR Activity × 0.20 +
  Contributors × 0.15 +
  Documentation × 0.10 +
  Test Coverage × 0.10
) × 100
```

Each metric is scored individually and combined using these weights.

### What do the health status indicators mean?

- 🟢 **Healthy (80-100)** - Repository in good condition
- 🟡 **Warning (50-79)** - Needs attention
- 🔴 **Critical (0-49)** - Requires immediate action

### How often are health scores updated?

Health scores are updated every 30 minutes by the ScoreWorker. You can manually trigger a rescan from the UI.

### Can I customize health score weights?

Currently, weights are fixed in the application. Custom weighting is planned for a future release. Admins will be able to configure weights per repository or globally.

### What is Healdec?

Healdec (Health Decision) is the autonomous auto-healing engine that detects and recovers from failures without human intervention. It uses 5 strategies: Retry, Restart, Quarantine, Rollback, and Escalate.

### How does the watchlist work?

The watchlist lets you star important repositories for quick access. Starred repos appear in a dedicated "Watchlist" tab. Your watchlist persists across sessions using browser localStorage.

### Can I export my data?

Yes, the Export Worker can generate reports in CSV, JSON, or PDF format. You can export:
- Repository health data
- Worker performance metrics
- Healdec action logs
- Alert history

## Workers

### What are workers?

Workers are specialized background processes that handle different tasks like repository indexing, health score calculation, data synchronization, and system maintenance.

### How many workers are there?

There are 12 parallel workers:
1. IndexWorker - Discovers repositories
2. IdentityWorker - Extracts developer identities
3. ScoreWorker - Computes health scores
4. IngestWorker - Processes webhooks
5. SyncWorker - Syncs metadata
6. GCWorker - Garbage collection
7. AlertWorker - Monitors alerts
8. ExportWorker - Generates reports
9. AuditWorker - Compliance logging
10. RepairWorker - Fixes inconsistencies
11. BackfillWorker - Historical data
12. MaintenanceWorker - Database optimization

### Can workers be disabled?

Yes, admins can start/stop individual workers from the Admin panel. However, disabling critical workers (like ScoreWorker) will affect core functionality.

### What happens if a worker crashes?

Healdec automatically detects crashed workers and applies the Restart strategy to recover them. The worker is gracefully stopped, cooled down, and restarted.

### Why is a worker showing low success rate?

Common causes:
- API rate limiting
- Network issues
- Malformed data
- Resource constraints

Check the Healdec log for specific errors and recovery actions.

## Data & Privacy

### Where is my data stored?

All data is stored locally in your browser's localStorage. Nothing is sent to external servers (except GitHub API calls for repository data).

### Is my data secure?

Yes, data never leaves your browser. We don't collect or transmit user data. API keys (if you create them) are stored securely in localStorage and never logged.

### What happens if I clear browser data?

Clearing browser data will remove:
- Your watchlist
- Alert configurations
- Role preferences
- Any custom settings

Repositories and health scores will remain available as they're fetched from GitHub.

### Can I sync data across devices?

Currently, no. Each browser instance maintains its own data. Cross-device sync is planned for a future release with optional cloud backup.

### Do you collect analytics?

The open-source version doesn't include any analytics. If you deploy your own instance, you can optionally add analytics.

## Alerts

### How do alerts work?

Alerts monitor repository health scores. When a condition is met (e.g., score drops below threshold), you receive a notification in the UI and optionally via webhook/email (if configured).

### Can I set multiple alerts per repository?

Yes, you can create multiple alerts with different conditions and thresholds for the same repository.

### Why didn't my alert trigger?

Check:
- Alert status is "Active"
- Current health score meets the condition
- AlertWorker is running
- Last checked timestamp is recent

### Can I get email notifications?

Email notifications require server-side configuration. The browser-only version supports in-app notifications. For email, you'd need to set up webhooks pointing to an email service.

### How do I stop an alert from triggering?

Either:
- Toggle the alert to "Inactive"
- Delete the alert
- Adjust the threshold to a value that won't be met

## Roles

### What are the different roles?

- **Operator** - Monitor repositories and fleet health
- **Admin** - Manage system and workers
- **Analyst** - View analytics and insights
- **Developer** - API integration and testing

### Can I switch between roles?

Yes! Select your role from the dropdown in the header. Each role provides different features and views.

### Do roles affect permissions?

In the browser version, roles only change the UI view. In a future server-backed version, roles will enforce actual permissions.

### Can I have multiple roles?

You can switch between roles anytime, but you're in one role at a time. Your role preference is saved.

## API

### Is there a public API?

The current version is browser-only without a backend API. The API reference documents the planned API for a future server-backed version.

### How do I get an API key?

In the Developer role, you can generate mock API keys for testing. These are local to your browser and don't authenticate with an actual backend.

### What are the rate limits?

The documented rate limits apply to the future server-backed API. The browser version has no rate limits (other than GitHub API limits).

### Can I use the API in production?

Not yet. The API is currently for demonstration and planning purposes. A production API requires deploying a backend server.

## GitHub Integration

### Do I need a GitHub account?

Not required for the basic version, but recommended for accessing real repository data (planned feature).

### Does it support GitHub Enterprise?

GitHub Enterprise support is planned for a future release.

### Will it work with GitLab or Bitbucket?

Currently designed for GitHub. GitLab and Bitbucket support could be added in the future.

### How does it access my repositories?

In the current version, it uses mock data. The planned GitHub integration will use OAuth to access repositories you grant permission to.

## Technical Questions

### What technologies are used?

- Frontend: React 19, TypeScript, Vite
- UI: Tailwind CSS, shadcn/ui (Radix UI)
- Charts: D3.js, Recharts
- Icons: Phosphor Icons
- State: React hooks + useKV persistence

### Can I self-host it?

Yes! It's a static web app. See the [Deployment Guide](./deployment.md) for instructions.

### Can I customize the theme?

The AuraFX theme is built with Tailwind CSS. You can customize colors and styles in `tailwind.config.js` and `theme.json`.

### Does it support TypeScript?

Yes, the entire codebase is written in TypeScript with full type safety.

### Can I contribute?

Absolutely! See the [Contributing Guide](./contributing.md) for details on how to contribute.

## Performance

### Why is the app slow?

Common causes:
- Large number of repositories (>1000)
- Multiple charts rendering
- Memory leak (restart browser)
- Browser extensions interfering

See [Performance Issues](./troubleshooting.md#performance-issues) for solutions.

### How much data can it handle?

The application is optimized for:
- Up to 1,000 repositories
- 100 active alerts
- 10,000 Healdec actions (with pagination)

Beyond these limits, performance may degrade.

### Can I reduce memory usage?

Yes:
- Close unused tabs
- Disable unnecessary workers
- Reduce chart data points
- Clear old Healdec logs

## Troubleshooting

### The application won't load

1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check console for errors
4. Try in incognito mode

See [Troubleshooting Guide](./troubleshooting.md) for more.

### I'm seeing a blank screen

Usually caused by:
- JavaScript errors (check console)
- Browser incompatibility
- Corrupted localStorage
- Ad blocker interference

### Workers are stuck

Try:
- Restart individual workers
- Reload the application
- Clear worker cache
- Check for JavaScript errors

### Data isn't persisting

Verify:
- localStorage is enabled
- Not in incognito mode
- Browser storage not full
- No extensions blocking storage

## Future Plans

### What's coming next?

Planned features:
- Real GitHub integration with OAuth
- Backend API with database
- Multi-user support
- Email notifications
- Custom health score weights
- ML-powered predictions
- Mobile apps
- Plugin system

### When will feature X be available?

Check the [roadmap](https://github.com/SMSDAO/Doctor/discussions) or project board for planned features and timelines.

### Can I request a feature?

Yes! Open a feature request on GitHub Discussions. Describe:
- What you want
- Why it's useful
- Proposed implementation

### How can I stay updated?

- Watch the GitHub repository
- Join discussions
- Follow release notes
- Subscribe to the newsletter (if available)

## Getting Help

### Where can I get help?

1. Read the [Documentation](./README.md)
2. Check [Troubleshooting Guide](./troubleshooting.md)
3. Search [existing issues](https://github.com/SMSDAO/Doctor/issues)
4. Ask in [Discussions](https://github.com/SMSDAO/Doctor/discussions)
5. Open a new issue

### How do I report a bug?

1. Check it's not already reported
2. Gather information (browser, OS, steps to reproduce)
3. Open an issue with the bug template
4. Include screenshots and console logs

### Can I talk to the team?

Yes! Open a discussion on GitHub or comment on relevant issues. The team actively monitors and responds.

## License & Legal

### What license is AlgoBrainDoctor under?

MIT License - free to use, modify, and distribute.

### Can I use it commercially?

Yes, the MIT License allows commercial use.

### Do I need to credit AlgoBrainDoctor?

Not required, but appreciated! You can include:
```
Powered by AlgoBrainDoctor
```

### Can I rebrand it?

Yes, you can fork and rebrand as you wish under the MIT License terms.

---

## Still Have Questions?

- 📖 [Full Documentation](./README.md)
- 🐛 [Troubleshooting Guide](./troubleshooting.md)
- 💬 [GitHub Discussions](https://github.com/SMSDAO/Doctor/discussions)
- 📝 [Open an Issue](https://github.com/SMSDAO/Doctor/issues/new)

---

**Last Updated:** 2026-02-07  
**Version:** 4.0.0
