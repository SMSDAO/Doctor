# Contributing Guidelines

Thank you for your interest in contributing to AlgoBrainDoctor! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- Be respectful and constructive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or intimidation
- Trolling, insulting comments, or personal attacks
- Public or private harassment
- Publishing others' private information without permission

## Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- Git
- Familiarity with React, TypeScript, and Tailwind CSS
- GitHub account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/Doctor.git
cd Doctor
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/SMSDAO/Doctor.git
```

4. Install dependencies:

```bash
npm install
```

5. Start development server:

```bash
npm run dev
```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow the [Coding Standards](#coding-standards)
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and focused

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Build the project
npm run build

# Test in browser
npm run dev
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add repository filtering by language"
```

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `test` - Adding missing tests
- `chore` - Maintain, dependencies, build process

Examples:
```
feat(workers): add BackfillWorker for historical data

Implements new worker that populates historical health scores
for existing repositories. Configurable batch size and date range.

Closes #123
```

```
fix(charts): resolve memory leak in PriceChart component

Added cleanup function to useEffect hook that properly
removes D3 event listeners when component unmounts.

Fixes #456
```

### 5. Keep Your Branch Updated

Regularly sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push Changes

```bash
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all props and state
- Avoid `any` type; use proper types or `unknown`
- Use type inference where appropriate

```typescript
// Good
interface Repository {
  id: string;
  name: string;
  healthScore: number;
}

function getRepository(id: string): Repository {
  // ...
}

// Bad
function getRepository(id: any): any {
  // ...
}
```

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper component naming (PascalCase)

```typescript
// Good
export function RepositoryCard({ repository }: RepositoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card>
      {/* ... */}
    </Card>
  );
}

// Bad
export default function card(props: any) {
  // ...
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow the AuraFX design system
- Keep custom CSS minimal
- Use semantic class names

```tsx
// Good
<div className="rounded-lg border border-violet-500/30 bg-gray-900/50 p-6">
  <h2 className="text-xl font-semibold text-violet-300">Title</h2>
</div>

// Avoid custom CSS unless necessary
<div className="custom-card">
  <h2 className="custom-title">Title</h2>
</div>
```

### File Organization

```
src/
├── components/        # React components
│   ├── ui/           # shadcn/ui components
│   ├── RepositoryCard.tsx
│   └── WorkerStatus.tsx
├── hooks/            # Custom React hooks
│   ├── useKV.ts
│   └── useRepository.ts
├── lib/              # Utilities and helpers
│   ├── utils.ts
│   └── healdec.ts
├── types/            # TypeScript type definitions
│   └── index.ts
└── App.tsx           # Main app component
```

### Code Quality

- **DRY (Don't Repeat Yourself)** - Extract repeated logic
- **SOLID Principles** - Single responsibility, open/closed, etc.
- **Keep It Simple** - Avoid premature optimization
- **Self-Documenting** - Code should be readable without comments
- **Add Comments** - When complexity is necessary

```typescript
// Good: Self-documenting
function calculateHealthScore(metrics: HealthMetrics): number {
  const weights = {
    codeQuality: 0.25,
    issueResolution: 0.20,
    prActivity: 0.20,
    contributors: 0.15,
    documentation: 0.10,
    testCoverage: 0.10,
  };
  
  return Object.entries(weights).reduce(
    (score, [key, weight]) => score + metrics[key] * weight,
    0
  );
}
```

### Testing

- Write tests for new features
- Maintain test coverage >80%
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('HealthScoreCalculator', () => {
  it('should calculate correct health score with all metrics', () => {
    // Arrange
    const metrics = {
      codeQuality: 90,
      issueResolution: 85,
      prActivity: 80,
      contributors: 85,
      documentation: 75,
      testCoverage: 88,
    };
    
    // Act
    const score = calculateHealthScore(metrics);
    
    // Assert
    expect(score).toBeCloseTo(84.25, 2);
  });
});
```

## Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Add/update API documentation
   - Update changelog

2. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out PR template

3. **PR Title Format**
   ```
   <type>: <description>
   ```
   
   Examples:
   - `feat: add repository filtering`
   - `fix: resolve chart rendering issue`
   - `docs: update API reference`

4. **PR Description**
   Include:
   - What changed and why
   - Related issues (Closes #123)
   - Screenshots (for UI changes)
   - Testing instructions
   - Breaking changes (if any)

5. **Review Process**
   - Maintainers will review your PR
   - Address feedback promptly
   - Make requested changes
   - Push updates to your branch

6. **Merge**
   - Once approved, maintainers will merge
   - Your contribution will be credited
   - Branch can be deleted

### PR Template

```markdown
## Description
Brief description of changes

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Screenshots (if applicable)
Add screenshots here

## Testing
How to test the changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
```

## Reporting Bugs

### Before Reporting

1. Check [existing issues](https://github.com/SMSDAO/Doctor/issues)
2. Try latest version
3. Search [troubleshooting guide](./troubleshooting.md)

### Bug Report Template

```markdown
**Describe the Bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
Add screenshots if applicable

**Environment**
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 120, Firefox 119]
- Version: [e.g., 4.0.0]

**Additional Context**
Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, references
```

### Feature Discussions

1. Open a [Discussion](https://github.com/SMSDAO/Doctor/discussions)
2. Tag it as "Feature Request"
3. Engage with community feedback
4. Wait for maintainer approval before implementing

## Documentation

### Documentation Standards

- Clear and concise writing
- Use examples
- Include code snippets
- Add diagrams when helpful
- Keep up-to-date

### Updating Documentation

When making changes that affect documentation:

1. Update relevant `.md` files in `docs/`
2. Update inline code comments
3. Update README if needed
4. Update API reference
5. Add to changelog

### Documentation Structure

```
docs/
├── README.md              # Table of contents
├── getting-started.md     # Quick start guide
├── architecture.md        # System design
├── api-reference.md       # API docs
├── deployment.md          # Deployment guide
├── troubleshooting.md     # Common issues
└── contributing.md        # This file
```

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commit history
- Invited to maintainer team (for significant contributions)

## Questions?

- Open a [Discussion](https://github.com/SMSDAO/Doctor/discussions)
- Ask in comments on related issues
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

**Thank you for contributing to AlgoBrainDoctor!** 🧠⚡
