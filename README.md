# DataLens

[![CI](https://github.com/leowai1986/datalens/actions/workflows/ci.yml/badge.svg)](https://github.com/leowai1986/datalens/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)

&gt; Analytics Workbench for exploring large-scale datasets directly in the browser. Drop a CSV, filter, sort, visualize, and export — no backend required.

[Live Demo](https://data-lens-pearl.vercel.app/) · [Report Bug](https://github.com/leowai1986/datalens/issues) · [Request Feature](https://github.com/leowai1986/datalens/issues)

---

## Features

| Feature | Description |
|---------|-------------|
| **CSV Ingestion** | Drag & drop CSV files with automatic type inference (string, number, boolean, date) |
| **Virtualized Grid** | Smooth scrolling through 100k+ rows using `@tanstack/react-virtual` |
| **Visual Query Builder** | Add multiple filters with 9 operators (`eq`, `gt`, `contains`, `startsWith`, etc.) |
| **Interactive Charts** | Bar, line, area, and pie charts with configurable aggregations (sum, avg, count, min, max) |
| **Web Worker Processing** | Heavy computations offloaded to Web Workers for datasets &gt;50k rows |
| **Export** | Download filtered results as CSV or JSON |
| **Column Management** | Show/hide columns, resize widths, persisted in localStorage |
| **Dark Mode** | Toggle between light and dark themes |
| **Keyboard Shortcuts** | `Ctrl+O` to open file, `Ctrl+R` to reset |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.7 (strict mode) |
| Build Tool | Vite 6 |
| State (Server) | TanStack Query v5 |
| State (Client) | Zustand + persist middleware |
| Styling | Tailwind CSS v3 |
| Tables | TanStack Virtual + headless |
| Charts | Recharts |
| Testing | Vitest + React Testing Library + MSW |
| E2E | Playwright |
| CI/CD | GitHub Actions + Husky + lint-staged |

---

## Architecture
src/
├── core/                    # Domain types & pure utilities
│   ├── types/
│   ├── lib/                 # FP utilities, CSV parser, ID generator
│   └── config/
├── features/                # Feature-based modules
│   └── data-explorer/       # Self-contained: API, components, hooks, store, utils, workers
├── shared/                  # Cross-cutting concerns
│   ├── ui/                  # Design system (Button, Input, Modal, etc.)
│   ├── hooks/               # useDebounce, useLocalStorage, useMediaQuery
│   └── utils/               # cn (clsx + tailwind-merge), formatters
└── test/                    # Test setup & MSW server

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/tuusuario/datalens.git

# Navigate to project
cd datalens

# Install dependencies
npm install

# Start development server
npm run dev

Open http://localhost:5173 in your browser.

Build for Production

npm run build

Available Scripts

| Script               | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start Vite dev server               |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Preview production build locally    |
| `npm run test`       | Run unit tests (Vitest)             |
| `npm run test:watch` | Run tests in watch mode             |
| `npm run e2e`        | Run E2E tests (Playwright)          |
| `npm run lint`       | Lint with ESLint 9 (flat config)    |
| `npm run format`     | Format with Prettier                |
| `npm run typecheck`  | Type-check without emitting         |

Testing

# Unit tests
npm run test

# E2E tests (requires build first)
npm run build
npm run e2e

# With UI
npm run test:ui

# Sample Data
Use the included ./e2e/fixtures/sample.csv or create your own:

name,age,city,salary
Alice,30,New York,85000
Bob,25,Los Angeles,62000
Charlie,35,Chicago,94000

For stress testing, duplicate rows to reach 100k+ and verify Web Worker activation.

# CI/CD
Every push and PR triggers:
Type checking (tsc --noEmit)
Linting (ESLint 9 flat config)
Unit tests (Vitest)
E2E tests (Playwright, Chromium/Firefox/WebKit)
Pre-commit hooks run lint-staged to ensure code quality.

# Keyboard Shortcuts
| Shortcut   | Action           |
| ---------- | ---------------- |
| `Ctrl + O` | Open file dialog |
| `Ctrl + R` | Reset dataset    |

# Roadmap
[ ] JSON file support
[ ] Parquet ingestion via WASM
[ ] SQL-like query interface
[ ] Collaborative sessions (WebRTC)
[ ] Plugin system for custom visualizations

# Contributing
Contributions are welcome. Please follow the existing code style and ensure all tests pass.
Fork the repository
Create your feature branch (git checkout -b feat/amazing-feature)
Commit your changes (git commit -m 'feat: add amazing feature')
Push to the branch (git push origin feat/amazing-feature)
Open a Pull Request
