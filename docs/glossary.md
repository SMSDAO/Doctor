# Glossary

Definitions of terms and concepts used in AlgoBrainDoctor.

## A

**Alert**  
A monitoring rule that triggers notifications when a repository's health score meets specified conditions (e.g., drops below a threshold).

**AlertWorker**  
Worker responsible for checking active alerts and sending notifications when conditions are met.

**API Key**  
Authentication credential used to access the AlgoBrainDoctor API. Currently generated in the format `bdh_v4_` followed by a random string. Older or planned documentation may reference `jsk_` as an API key prefix; treat those as equivalent API keys.

**AuditWorker**  
Worker that logs all system changes and user actions for compliance and troubleshooting purposes.

**AuraFX**  
The custom design system used by AlgoBrainDoctor, featuring a neo-glow cyberpunk aesthetic with GitHub Dark as the base theme.

**Auto-Healing**  
The autonomous recovery process managed by the Healdec engine that detects and remediates failures without human intervention.

## B

**BackfillWorker**  
Worker that populates historical data for repositories, filling in missing metrics from past time periods.

**Base URL**  
The root URL for API requests: `https://api.algobraindoctor.io/v1`

**Batch Processing**  
Processing multiple items together for efficiency, used by workers to handle large datasets.

## C

**Code Quality**  
A metric measuring the technical quality of code, including complexity, maintainability, and adherence to best practices. Weighted at 25% in health scores.

**Contributor Engagement**  
A metric tracking the number and activity level of repository contributors. Weighted at 15% in health scores.

**Critical Status**  
Health status indicating severe issues (score 0-49). Requires immediate attention.

## D

**Dashboard**  
The main interface showing key metrics, repository health, and system status. Different dashboards exist for each role.

**Developer Identity**  
A unified profile linking a developer's various email addresses and GitHub accounts across repositories.

**Documentation Completeness**  
A metric assessing the quality and completeness of repository documentation. Weighted at 10% in health scores.

## E

**Escalate Strategy**  
Healdec recovery strategy that creates an incident and pages the on-call engineer for critical failures.

**Event-Driven**  
Architecture pattern where workers respond to events (like webhooks) rather than running on a schedule.

**ExportWorker**  
Worker that generates reports and exports data in various formats (CSV, JSON, PDF).

## G

**GCWorker (Garbage Collection Worker)**  
Worker that removes stale data, archives old logs, and optimizes storage.

**GitHub API**  
RESTful API provided by GitHub for accessing repository data, used by AlgoBrainDoctor to fetch metrics.

**GitOps**  
Practice of managing infrastructure and applications using Git as the single source of truth.

## H

**Healdec**  
Short for "Health Decision" - the autonomous auto-healing engine that detects and recovers from system failures.

**Health Score**  
A numerical value (0-100) representing the overall health of a repository, calculated from multiple weighted metrics.

**Health Status**  
Categorical indicator of repository health: Healthy (green), Warning (yellow), or Critical (red).

**Healthy Status**  
Health status indicating good condition (score 80-100). Repository is functioning well.

**Heartbeat**  
Regular signal sent by workers to indicate they're alive and functioning. Typically every 30 seconds.

**HMR (Hot Module Replacement)**  
Vite feature that updates code in the browser without full page reload during development.

## I

**IdentityWorker**  
Worker that extracts developer identities from commits and links emails to GitHub accounts.

**IndexWorker**  
Worker that discovers and catalogs repositories, maintaining the searchable repository index.

**IngestWorker**  
Worker that processes incoming GitHub webhooks in real-time, updating repository state.

**Issue Resolution**  
A metric measuring how quickly and effectively issues are resolved. Weighted at 20% in health scores.

## J

**Job**  
A unit of work assigned to a worker for processing. Contains job ID, type, payload, and metadata.

**Job Queue**  
List of pending jobs waiting to be processed by workers. Target queue depth is <100 jobs.

## K

**KV Storage**  
Key-value storage system using browser localStorage, accessed via the `useKV` hook for data persistence.

## L

**localStorage**  
Browser storage mechanism used to persist user data (watchlist, alerts, preferences) across sessions.

## M

**MaintenanceWorker**  
Worker that performs database optimization, index rebuilding, and other maintenance tasks weekly.

**Mean Time To Recovery (MTTR)**  
Average time taken by Healdec to recover from failures. Target is <2 minutes.

**Metric Card**  
UI component displaying a key performance indicator with value, label, and optional trend.

## O

**Orchestrator**  
Central system component that schedules jobs, supervises workers, and manages resource allocation.

**Operator**  
User role focused on monitoring repository health, tracking workers, and managing alerts.

## P

**PR Activity**  
A metric measuring pull request creation, review, and merge rates. Weighted at 20% in health scores.

## Q

**Quarantine Strategy**  
Healdec recovery strategy that isolates corrupted jobs for manual review instead of retrying.

**Queue Depth**  
Number of jobs waiting in the queue. Target is <100 pending jobs.

## R

**Rate Limiting**  
Restriction on the number of API requests allowed per time period to prevent abuse and ensure fair usage.

**Recovery Strategy**  
One of five Healdec approaches to handling failures: Retry, Restart, Quarantine, Rollback, or Escalate.

**RepairWorker**  
Worker that fixes data inconsistencies, validates relationships, and corrects errors every 6 hours.

**Repository**  
A Git repository being monitored by AlgoBrainDoctor, typically hosted on GitHub.

**Restart Strategy**  
Healdec recovery strategy that gracefully stops and restarts a crashed worker.

**Retry Strategy**  
Healdec recovery strategy that retries failed operations with exponential backoff for transient errors.

**RBAC (Role-Based Access Control)**  
Security model where permissions are assigned based on user roles (Operator, Admin, Analyst, Developer).

**Rollback Strategy**  
Healdec recovery strategy that undoes partial transactions using compensating actions.

## S

**ScoreWorker**  
Worker that computes repository health scores every 30 minutes using weighted metrics.

**shadcn/ui**  
Component library based on Radix UI, providing accessible and customizable React components.

**Success Rate**  
Percentage of jobs completed successfully by a worker. Target is >99%.

**SyncWorker**  
Worker that synchronizes repository metadata (stars, forks, language) every 15 minutes.

## T

**Tailwind CSS**  
Utility-first CSS framework used for styling AlgoBrainDoctor's interface.

**Test Coverage**  
A metric measuring the percentage of code covered by automated tests. Weighted at 10% in health scores.

**Transient Error**  
Temporary failure (like network timeout) that may succeed if retried.

**TypeScript**  
Strongly-typed programming language that builds on JavaScript, used throughout AlgoBrainDoctor.

## U

**useKV Hook**  
Custom React hook providing key-value storage interface using browser localStorage.

## V

**Vite**  
Modern build tool providing fast development server with HMR and optimized production builds.

**Volume Profile**  
Chart showing the distribution of trading volume across price levels (used in analytics).

## W

**Warning Status**  
Health status indicating issues that need attention (score 50-79). Repository requires monitoring.

**Watchlist**  
User-curated list of starred repositories for quick access and monitoring.

**Webhook**  
HTTP callback triggered by events, allowing real-time notifications of repository changes.

**Worker**  
Specialized background process handling specific tasks like indexing, scoring, or maintenance.

**Worker Pool**  
Collection of 12 parallel workers processing jobs concurrently.

**Workflow**  
Sequence of steps performed to accomplish a task, documented for each user role.

## Acronyms

- **API** - Application Programming Interface
- **CORS** - Cross-Origin Resource Sharing
- **CSS** - Cascading Style Sheets
- **CSV** - Comma-Separated Values
- **DOM** - Document Object Model
- **GC** - Garbage Collection
- **HMR** - Hot Module Replacement
- **HTML** - HyperText Markup Language
- **HTTP** - HyperText Transfer Protocol
- **JSON** - JavaScript Object Notation
- **JWT** - JSON Web Token
- **KV** - Key-Value
- **ML** - Machine Learning
- **MTTR** - Mean Time To Recovery
- **OAuth** - Open Authorization
- **PDF** - Portable Document Format
- **PR** - Pull Request
- **RBAC** - Role-Based Access Control
- **REST** - Representational State Transfer
- **RPC** - Remote Procedure Call
- **SPA** - Single Page Application
- **SQL** - Structured Query Language
- **SSL/TLS** - Secure Sockets Layer / Transport Layer Security
- **TTL** - Time To Live
- **UI** - User Interface
- **URL** - Uniform Resource Locator
- **UX** - User Experience
- **WebSocket** - Full-duplex communication protocol

## Related Documentation

- [FAQ](./faq.md) - Frequently asked questions
- [Architecture](./architecture.md) - System architecture
- [Getting Started](./getting-started.md) - Quick start guide

---

**Note:** This glossary is continuously updated as the project evolves.
