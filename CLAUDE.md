# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**InvestInsight Portfolio Reporting Platform** - A comprehensive portfolio reporting and data stewardship application designed to help investment teams prepare accurate weekly and monthly reports from multiple data sources.

**Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript 5 (strict) + Tailwind CSS 4 + Shadcn UI

**Backend APIs:** Defined in three OpenAPI specifications:
- `documentation/MonthlyAPIDefinition.yaml` - Monthly process, approvals, data checks, index prices, report comments
- `documentation/FileImporterAPIDefinition.yaml` - File uploads, validations, instruments, durations, betas, credit ratings
- `documentation/DataMaintenanceAPIDefinition.yaml` - Reference data (countries, currencies, portfolios, asset managers, benchmarks, indexes)

**Planned Epics:**
1. Foundation & Start Page - Home page, navigation, batch management
2. File Import Management - Portfolio/other file uploads with validation
3. Data Confirmation & Validation - Multi-tab completeness checks
4. Instruments & Index Prices Maintenance - Core reference data
5. Risk Data Maintenance - Duration, YTM, Beta, Credit Rating screens
6. Report Comments - Commentary capture
7. Multi-Level Approvals - Three-level approval workflow (L1, L2, L3)
8. Process Logs & Administration - Logs, user/role/page access management
9. Reference Data Management - CRUD for countries, currencies, portfolios, indexes, asset managers, benchmarks

**Key Features:**
- Multi-level approval workflow with state-based access control
- Full audit trails for all data changes
- Matrix-based file upload tracking
- Comprehensive data validation and error handling
- Role-based access control

## Repository Structure

```
project-root/
├── .claude/          # Claude Code config and logs (TRACKED - see below)
├── web/              # Next.js frontend
├── documentation/    # Feature specs, OpenAPI specs, and sample datasets
└── generated-docs/   # Auto-generated progress tracking
```

**Session Logs Must Be Committed:** The `.claude/logs/*.md` files are intentionally tracked in Git for traceability. Always include them in commits (`git add .claude/logs/`). Do NOT add `.claude/logs/` to `.gitignore`.

## Development Commands

All commands run from `/web`:

```bash
npm run dev          # Dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Linting
npm run lint:fix     # Auto-fix lint issues
npm test             # Run all tests
npm test -- path/to/file.test.tsx  # Run single test file
npm run test:watch   # Watch mode for development
npm run test:quality # Validate test quality (must pass)
```

## Workflow Commands (Claude Code)

```
/setup          # Initialize project - install deps, verify setup
/start          # Begin TDD workflow from feature spec in documentation/
/status         # Show current workflow progress
/continue       # Resume interrupted workflow
/quality-check  # Validate all 5 quality gates before PR
```

## Critical Rules

### 1. Use Shadcn UI via MCP

Always use Shadcn components (`<Button />`, `<Dialog />`, `<Card />`, etc.). If a component doesn't exist, install it via MCP:

```
mcp__shadcn__add_component
```

Never write "Shadcn-style" components manually.

### 2. Use the API Client

All API calls must use `web/src/lib/api/client.ts`. Never call `fetch()` directly in components.

```typescript
import { get, post, put, del } from '@/lib/api/client';
export const getUsers = () => get<User[]>('/v1/users');
export const createUser = (data: CreateUserRequest) => post<User>('/v1/users', data);
```

**If an OpenAPI spec exists in `documentation/`**, use it as the source of truth for:
- Endpoint paths and HTTP methods
- Request/response types (generate TypeScript types from the spec)
- Query parameters and request bodies
- Error response shapes

**CRITICAL: Before implementing ANY API call, you MUST:**
1. Open the relevant OpenAPI spec file
2. Find the exact endpoint definition
3. List ALL required parameters (check `required: true`)
4. Ensure your implementation includes EVERY required parameter
5. Never assume a single ID parameter is sufficient - verify against the spec

This prevents 400 Bad Request errors from missing required parameters.

### 3. No Error Suppressions

**Never use suppression directives:**
- `// eslint-disable` / `// eslint-disable-next-line`
- `// @ts-expect-error` / `// @ts-ignore` / `// @ts-nocheck`

Fix errors properly. Suppressions hide problems and accumulate technical debt.

### 4. Quality Gates Are Binary

Report actual exit codes truthfully. Never rationalize failures as "expected" or "acceptable." Let the user decide whether to proceed.

### 5. Test Quality Must Pass

`npm run test:quality` must always pass. Anti-patterns in test files (even skipped tests) will fail CI/CD. In TDD, failing tests create expected TypeScript errors, but this still counts as a failed quality gate until implementation is complete.

### 6. Follow TDD Strictly

When implementing or modifying features, **always follow Test-Driven Development**:

1. **Red Phase** - Write failing tests first based on acceptance criteria
2. **Green Phase** - Write minimal code to make tests pass
3. **Refactor Phase** - Improve code while keeping tests green

**Never write implementation code before tests.** This applies to:
- New features
- Bug fixes
- Modifications to existing stories
- Any code that has acceptance criteria

The test file should be created/updated first, tests should fail, then implementation follows.

## Testing Strategy

### Focus on Integration Tests

Test realistic user workflows, not implementation details. Ask: **"Would a user care if this broke?"**

**Valid tests verify user-observable behavior:**
- User can see specific content displayed
- User can perform actions (click, submit, navigate)
- User receives appropriate feedback (errors, success messages)
- User workflows complete end-to-end

**Invalid tests (DO NOT WRITE):**
- Internal DOM structure or CSS classes
- Internal state values or store shape
- Function call counts or prop passing
- Third-party library internals (Recharts SVGs, Zod schema validation, etc.)
- TypeScript types (compiler handles this)
- Constants or config object values

### Query Priority (Accessibility-First)

1. `getByRole` - Buttons, links, headings (preferred)
2. `getByLabelText` - Form inputs with labels
3. `getByText` - Non-interactive content
4. `getByTestId` - **Last resort only**

### Anti-Pattern: Testing Library Internals

Never query internal DOM of third-party components (charts, editors, etc.):

```typescript
// BAD - Testing Recharts internals
expect(container.querySelector('.recharts-bar-rectangle')).toHaveAttribute('fill', '#8884d8');

// GOOD - Testing user-observable behavior
expect(screen.getByText('Sales: $1,234')).toBeInTheDocument();
```

### Test Mocks

**Fix mock issues - never skip tests to avoid them.** Common fixes:
- **Multiple API calls:** Use `mockResolvedValue` for consistent returns or chain `mockResolvedValueOnce`
- **Missing providers:** Mock context providers at test file top
- **Navigation:** Mock `next/navigation` before component imports
- **Async updates:** Use `waitFor` for assertions

Only acceptable uses of `.skip()`: TDD red phase (unimplemented features) or unavailable test environment capabilities. If you can't fix a mock, ask the user - don't skip the test.

## Architecture Quick Reference

### Directory Structure (`web/src/`)

- `app/` - Next.js App Router pages (server components by default)
- `components/` - Reusable React components
- `lib/api/` - API client and endpoint functions
- `lib/auth/` - Authentication and RBAC (see [auth README](web/src/lib/auth/README.md))
- `lib/validation/` - Zod schemas (see [validation README](web/src/lib/validation/README.md))
- `types/` - TypeScript definitions

### Key Patterns

- **Path alias:** Use `@/` for imports from `src/`
- **Server components by default:** Add `"use client"` only when needed
- **App Router:** Pages go in `app/`, not `pages/`

## Additional Documentation

- [Testing Guide](.template-docs/guides/TESTING.md) - Detailed testing patterns and examples
- [Auth & RBAC](.template-docs/Help/RBAC.md) - Role-based access control and input validation
- [Contributing](.template-docs/CONTRIBUTING.md) - For template maintainers
