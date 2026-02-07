# Development Guide

Comprehensive guide for setting up your development environment and contributing to AlgoBrainDoctor.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Building & Testing](#building--testing)
- [Debugging](#debugging)
- [Tools & Extensions](#tools--extensions)

## Prerequisites

### Required

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** 2.30.0 or higher
- Modern code editor (VS Code recommended)
- Modern web browser (Chrome/Firefox recommended)

### Recommended

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

### Verify Prerequisites

```bash
node --version    # Should be 18+
npm --version     # Should be 8+
git --version     # Should be 2.30+
```

## Development Setup

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/SMSDAO/Doctor.git
cd Doctor

# Or via SSH
git clone git@github.com:SMSDAO/Doctor.git
cd Doctor
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- React 19 and related packages
- TypeScript and type definitions
- Tailwind CSS and plugins
- Vite build tool
- Development tools (ESLint, etc.)

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at:
```
http://localhost:5173
```

Hot Module Replacement (HMR) is enabled - changes appear instantly.

### 4. Verify Setup

1. Open http://localhost:5173 in browser
2. Check browser console for errors
3. Try switching between roles
4. Verify UI renders correctly

## Project Structure

```
Doctor/
├── .github/              # GitHub workflows and templates
├── docs/                 # Documentation
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── MetricCard.tsx
│   │   ├── RepositoryCard.tsx
│   │   ├── TokenTable.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   ├── useKV.ts     # Key-value storage hook
│   │   └── ...
│   ├── lib/             # Utility functions
│   │   ├── utils.ts     # General utilities
│   │   └── ...
│   ├── styles/          # Global styles
│   │   └── ...
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── App.tsx          # Main app component
│   ├── HospitalApp.tsx  # Hospital dashboard
│   ├── main.tsx         # Entry point
│   └── ...
├── .gitignore           # Git ignore rules
├── components.json      # shadcn/ui config
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # Project readme
```

### Key Files

- **`src/App.tsx`** - Main application component
- **`src/HospitalApp.tsx`** - Hospital dashboard implementation
- **`src/hooks/useKV.ts`** - Persistent storage hook
- **`src/components/ui/`** - Reusable UI components
- **`tailwind.config.js`** - Theme and style configuration
- **`vite.config.ts`** - Build tool configuration

## Development Workflow

### Starting a New Feature

1. **Create a branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes:**
   - Edit files in `src/`
   - Add new components as needed
   - Update types in `src/types/`

3. **Test locally:**
```bash
npm run dev
# Test in browser
```

4. **Commit changes:**
```bash
git add .
git commit -m "feat: add your feature"
```

5. **Push and create PR:**
```bash
git push origin feature/your-feature-name
# Create PR on GitHub
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Optimize dependencies
npm run optimize
```

### Hot Module Replacement

Vite provides instant HMR:
- CSS changes apply immediately
- Component changes preserve state
- Errors show in browser overlay

## Building & Testing

### Production Build

```bash
# Create optimized build
npm run build

# Output in dist/ directory
ls -la dist/
```

Build artifacts:
```
dist/
├── assets/
│   ├── index-[hash].js    # Minified JavaScript
│   ├── index-[hash].css   # Minified CSS
│   └── ...
└── index.html              # Entry HTML
```

### Preview Build

```bash
# Preview production build locally
npm run preview

# Access at http://localhost:4173
```

### Linting

```bash
# Check code style
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Type Checking

```bash
# Type check without building
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Manual Testing

Test these scenarios:
- [ ] Role switching (Operator, Admin, Analyst, Developer)
- [ ] Repository list loads and displays correctly
- [ ] Worker status updates
- [ ] Healdec log shows actions
- [ ] Watchlist add/remove
- [ ] Alert creation and management
- [ ] Charts render correctly
- [ ] Data persists across refresh
- [ ] Responsive design on mobile
- [ ] No console errors

## Debugging

### Browser DevTools

**Open DevTools:** F12 or Right-click → Inspect

**Console Tab:**
- View JavaScript errors
- Check log messages
- Run debug commands

**Network Tab:**
- Monitor API requests
- Check response times
- Inspect payloads

**Performance Tab:**
- Record performance profile
- Identify bottlenecks
- Analyze render times

**React DevTools:**
- Inspect component tree
- View props and state
- Profile component renders

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

Set breakpoints in VS Code, press F5 to start debugging.

### Debug Logging

Add debug logs:

```typescript
// Development only
if (import.meta.env.DEV) {
  console.log('Debug:', data);
}

// Always log errors
console.error('Error:', error);
```

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

**Module not found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npx tsc --build --clean
```

## Tools & Extensions

### VS Code Extensions

**Essential:**
- ESLint - Code linting
- Prettier - Code formatting
- TypeScript - TypeScript support
- Tailwind CSS IntelliSense - Tailwind autocomplete

**Recommended:**
- ES7+ React/Redux Snippets - React snippets
- Auto Rename Tag - Rename paired HTML tags
- Path Intellisense - Autocomplete file paths
- GitLens - Enhanced Git integration
- Error Lens - Inline error messages

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Browser Extensions

**React Developer Tools:**
- Chrome: [Install](https://chrome.google.com/webstore/detail/react-developer-tools/)
- Firefox: [Install](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

**Redux DevTools** (if using Redux):
- Chrome: [Install](https://chrome.google.com/webstore/detail/redux-devtools/)

### Command Line Tools

**GitHub CLI:**
```bash
# Install gh
brew install gh  # macOS
# Or download from https://cli.github.com/

# Create PR from command line
gh pr create --title "feat: add feature" --body "Description"
```

**Prettier CLI:**
```bash
# Format all files
npx prettier --write .

# Check formatting
npx prettier --check .
```

## Code Style

### TypeScript

- Use TypeScript for all files
- Define types/interfaces explicitly
- Avoid `any` type
- Use const assertions where appropriate

### React

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components small (<200 lines)
- Use proper prop typing

### Naming Conventions

- **Components:** PascalCase (`RepositoryCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useKV.ts`)
- **Utilities:** camelCase (`utils.ts`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces:** PascalCase (`HealthScore`)

### File Organization

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import type { Repository } from '@/types';

// 2. Types
interface Props {
  repository: Repository;
}

// 3. Constants
const MAX_STARS = 1000;

// 4. Component
export function RepositoryCard({ repository }: Props) {
  // Hooks
  const [expanded, setExpanded] = useState(false);
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    setExpanded(!expanded);
  };
  
  // Render
  return (
    <Card>
      {/* ... */}
    </Card>
  );
}
```

## Performance Tips

### Optimization Techniques

1. **Lazy Loading:**
```typescript
const Charts = lazy(() => import('./components/Charts'));
```

2. **Memoization:**
```typescript
const expensive = useMemo(() => 
  computeExpensive(data),
  [data]
);
```

3. **Callback Optimization:**
```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

4. **Debouncing:**
```typescript
const debouncedSearch = useMemo(
  () => debounce(search, 300),
  []
);
```

### Bundle Size

Check bundle size:
```bash
npm run build
npx vite-bundle-visualizer
```

Reduce bundle size:
- Use code splitting
- Import only needed modules
- Remove unused dependencies
- Enable tree shaking

## Related Documentation

- [Contributing Guidelines](./contributing.md)
- [Architecture Overview](./architecture.md)
- [Troubleshooting](./troubleshooting.md)
- [API Reference](./api-reference.md)

---

**Happy coding!** 🚀
