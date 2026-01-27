# Claude Code Agents

This directory contains specialized Claude Code agents that support a **Test-Driven Development (TDD)** workflow for building features in this template repository.

## TDD Workflow Overview

```
[ui-ux-designer] → feature-planner → test-generator → developer → code-reviewer → quality-gate-checker
    DESIGN             PLAN            SPECIFY        IMPLEMENT      REVIEW           VERIFY
```

| Phase | Agent | Description |
|-------|-------|-------------|
| **DESIGN** | ui-ux-designer | Create wireframes for UI features (optional) |
| **PLAN** | feature-planner | Define epics, stories, and acceptance criteria |
| **SPECIFY** | test-generator | Write failing tests before implementation |
| **IMPLEMENT** | developer | Implement code to make tests pass |
| **REVIEW** | code-reviewer | Review code quality and suggest improvements |
| **VERIFY** | quality-gate-checker | Validate all quality gates before commit |

---

## Available Agents

### 1. UI/UX Designer (Optional)

**File:** [ui-ux-designer.md](ui-ux-designer.md)

**Purpose:** Generates simple text-based wireframes from feature specifications. Creates ASCII/markdown layouts for each screen before story planning begins.

**When to use:**
- Before feature-planner when the feature involves UI
- When you want visual clarity before breaking down stories
- Optional - feature-planner works without wireframes

**Invocation:**
```
Create wireframes for the user settings feature
```

**Key outputs:**
- `generated-docs/wireframes/_overview.md`
- `generated-docs/wireframes/screen-N-[name].md`

---

### 2. Feature Planner

**File:** [feature-planner.md](feature-planner.md)

**Purpose:** Transforms feature specifications into structured implementation plans through collaborative refinement. Creates epics, user stories, and acceptance criteria. Automatically references wireframes if available.

**When to use:**
- Starting a new feature from a specification
- Breaking down complex requirements into implementable stories
- After ui-ux-designer (optional) or as first step in TDD workflow

**Invocation:**
```
Plan the user authentication feature based on the spec
```

**Key outputs:**
- `generated-docs/stories/_feature-overview.md`
- `generated-docs/stories/epic-N-[name]/story-N-[name].md`

---

### 3. Test Generator

**File:** [test-generator.md](test-generator.md)

**Purpose:** Generates comprehensive Vitest + React Testing Library tests BEFORE implementation. Creates failing tests that define acceptance criteria as executable code.

**When to use:**
- Immediately after feature-planner completes an epic
- Before ANY implementation code is written
- When defining what a component/feature should do

**Invocation:**
```
Generate tests for Epic 1: Basic Auth
```

**Key outputs:**
- `web/src/__tests__/integration/[feature].test.tsx`
- `.claude/context/test-coverage.json`

---

### 4. Developer

**File:** [developer.md](developer.md)

**Purpose:** Implements user stories from project plans one at a time, ensuring each story is properly completed and reviewed before moving to the next. Follows a main branch workflow with review gates.

**When to use:**
- After test-generator has created failing tests (ready for IMPLEMENT phase)
- When implementing stories from a project plan
- When you want controlled, incremental feature implementation with review checkpoints

**Invocation:**
```
Implement the next story from the plan
```
or
```
Start implementing the user authentication stories
```

**Key behaviors:**
- Implements exactly ONE story at a time
- Waits for user approval before committing
- Locates and makes failing tests pass
- Follows project patterns (App Router, Shadcn UI, API client)

---

### 5. Code Reviewer

**File:** [code-reviewer.md](code-reviewer.md)

**Purpose:** Reviews code changes for quality, security, and adherence to project patterns. Provides constructive feedback with specific improvement suggestions.

**When to use:**
- After implementing a feature (IMPLEMENT phase complete)
- Before creating a PR
- As part of the REVIEW phase

**Invocation:**
```
Review the code changes for the portfolio dashboard
```

**What it checks:**
- TypeScript & React quality
- Next.js 16 patterns
- Security (XSS, secrets, RBAC)
- Project patterns (API client, types, Shadcn UI)
- Testing coverage
- Accessibility

---

### 6. Quality Gate Checker

**File:** [quality-gate-checker.md](quality-gate-checker.md)

**Purpose:** Validates all 5 quality gates pass before committing. Runs automated checks, prompts for manual verification, and generates a markdown report.

**When to use:**
- After code review is complete
- Before committing and pushing to main
- Can be invoked via `/quality-check` command

**Invocation:**
```
Check if my feature is ready to commit
```
or
```
/quality-check
```

**The 5 Quality Gates:**
1. Functional (manual) - Feature works as expected
2. Security (automated) - npm audit, no secrets
3. Code Quality (automated) - TypeScript, ESLint, build
4. Testing (automated) - Vitest tests pass
5. Performance (manual) - Page loads reasonably

---

## Workflow Recommendations

### Starting a New Feature

1. **DESIGN (Optional):** Invoke `ui-ux-designer` if the feature has UI
   - Approve screen list
   - Agent creates ASCII wireframes for each screen
   - Saves to `generated-docs/wireframes/`

2. **PLAN:** Invoke `feature-planner` with your feature spec
   - Agent automatically checks for wireframes
   - Approve epics
   - Approve stories for each epic (one at a time, all upfront)
   - Agent writes acceptance criteria to markdown files (with wireframe references)

3. **SPECIFY:** Invoke `test-generator` for Epic 1
   - Generates failing tests based on acceptance criteria
   - Tests will FAIL (this is expected!)

4. **IMPLEMENT:** Invoke `developer` to implement the feature
   - Implements one story at a time
   - Creates draft PR and waits for approval
   - Run `npm test` to verify tests pass

5. **REVIEW:** Invoke `code-reviewer`
   - Address any critical issues
   - Consider suggestions for improvement

6. **VERIFY:** Invoke `quality-gate-checker`
   - All 5 gates must pass
   - Get markdown report summarizing quality check

7. **Repeat:** Return to feature-planner for Epic 2

### Quick Quality Check

Before committing:
```
/quality-check
```

### Reviewing Existing Code

For code review without full TDD workflow:
```
Review the authentication module for security issues
```

---

## Context Directory

The `.claude/context/` directory is used for agent-to-agent communication. Files here are temporary and should not be committed.

| File | Created By | Used By |
|------|------------|---------|
| `feature-spec.json` | feature-planner | test-generator |
| `test-coverage.json` | test-generator | quality-gate-checker |
| `review-findings.json` | code-reviewer | quality-gate-checker |
| `quality-gate-status.json` | quality-gate-checker | (final output) |
| `workflow-state.json` | transition scripts | all agents |

---

## Workflow State Management

### Transition Scripts

The workflow uses scripts to track and validate state:

| Script | Purpose |
|--------|---------|
| `transition-phase.js` | Manages phase transitions with validation |
| `validate-phase-output.js` | Validates artifacts exist for a phase |
| `detect-workflow-state.js` | Detects state from artifacts (read-only) |

### Script Execution Verification (CRITICAL)

**Agents MUST verify script execution succeeded before proceeding.**

When running transition scripts, always check the JSON output:

```bash
# Run the transition
node .claude/scripts/transition-phase.js --current --to SPECIFY

# Expected success output:
# { "status": "ok", "message": "Transitioned Epic 1 from PLAN to SPECIFY", ... }

# Error output (DO NOT PROCEED):
# { "status": "error", "message": "Invalid transition...", ... }
```

**Verification rules:**
1. `"status": "ok"` = Success, proceed to next step
2. `"status": "error"` = **STOP** and report the error to the user
3. `"status": "warning"` = Proceed with caution, inform user of the warning

### Validation Flags

Use these flags for additional safety:

```bash
# Check prerequisites before transitioning
node .claude/scripts/transition-phase.js --epic 1 --to SPECIFY --validate

# Verify the FROM phase created expected outputs
node .claude/scripts/transition-phase.js --current --to IMPLEMENT --verify-output
```

### Repair Function

If workflow state is lost or corrupted:

```bash
node .claude/scripts/transition-phase.js --repair
```

The repair function provides a **confidence level** (high/medium/low):
- **High confidence:** Artifacts clearly indicate state
- **Medium confidence:** Some assumptions made - verify with user
- **Low confidence:** Many assumptions - require user confirmation before proceeding

---

## Creating Custom Agents

Use the template file [_agent-template.md](_agent-template.md) to create new agents.

Key requirements:
1. Add YAML frontmatter with `name`, `description`, `model`, and `tools`
2. Document clear purpose and when to use
3. Define step-by-step workflow
4. Include DO/DON'T guidelines
5. Provide example prompts

---

## Related Documentation

- [Agent Workflow Guide](../../.template-docs/agent-workflow-guide.md) - Complete workflow documentation with examples
- [Project README](../../README.md) - Project overview and setup
- [CLAUDE.md](../../CLAUDE.md) - Claude Code configuration for this project
- [Testing Strategy](../../CLAUDE.md#testing-strategy) - Testing patterns and conventions
