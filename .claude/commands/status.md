---
description: Show current workflow progress - displays which phase you're in and what's completed
model: haiku
---

You are showing a developer their current position in the TDD workflow. This is display-only - do not take any action.

## Step 1: Check Authoritative State

First, check the authoritative workflow state file:

```bash
node .claude/scripts/transition-phase.js --show
```

This returns the state from `.claude/context/workflow-state.json`, which is the **source of truth** for workflow progress.

## Step 2: Get Supplementary Context

For additional context (epic details, acceptance test counts), run the detection script:

```bash
node .claude/scripts/detect-workflow-state.js json
```

## Step 3: Display Status

Parse the JSON output and display a human-readable summary.

### If No Spec Found (error: "no_spec")

```
=== Workflow Status ===

No feature spec found in documentation/

To get started:
  1. Create a feature spec in documentation/
  2. Run /start to begin the TDD workflow
```

### If Epics Exist

Display:
1. **Feature spec path** from `spec`
2. **Wireframe count** from `wireframes`
3. **Epic table** from `epics[]` array showing:
   - Epic name
   - Current phase
   - Story count
   - Test count
   - Acceptance tests (checked/total)
4. **Current position** from `resume` object
5. **Next steps** based on current phase

Example output:

```
=== Workflow Status ===

Feature: documentation/my-feature.md
Wireframes: 4

=== Epic Progress ===

Epic                  | Phase              | Stories | Tests | Reviewed | Acceptance
--------------------- | ------------------ | ------- | ----- | -------- | ----------
epic-1-dashboard      | COMPLETE           | 3       | 8     | Yes      | 12/12
epic-2-payments       | IMPLEMENT_OR_REVIEW| 4       | 10    | No       | 5/15
epic-3-reports        | SPECIFY            | 2       | 0     | No       | 0/8

=== Current Position ===

Resume: epic-2-payments (story-2-form)
Phase: IMPLEMENT_OR_REVIEW (run tests to confirm exact phase)
Action: Run /continue to resume workflow

=== Commands ===

/continue      - Resume workflow from current position
/quality-check - Run all quality gates
```

### If All Complete

```
=== Workflow Status ===

Feature: documentation/my-feature.md

All epics complete!

Total: 3 epics, 9 stories, 35 acceptance tests passed

Next step: Start a new feature
```

## Phase Descriptions

If the user needs clarification, explain phases in plain language:

| Phase | Description |
|-------|-------------|
| PLAN | Breaking down the feature into epics and writing stories with acceptance criteria for ALL epics upfront |
| REALIGN | Reviewing discovered impacts and revising stories for the upcoming epic (auto-completes if no impacts) |
| SPECIFY | Generating executable tests from acceptance criteria for the current epic |
| IMPLEMENT | Writing code to make the current epic's tests pass |
| IMPLEMENT_OR_REVIEW | Has tests, needs `npm test` to determine if IMPLEMENT or REVIEW |
| REVIEW | Code review for the current epic |
| VERIFY | Running quality gates for the current epic before commit |
| COMPLETE | Epic complete, ready for next epic's REALIGN/SPECIFY phase |

**Workflow:** DESIGN (once) → PLAN (all stories) → [REALIGN → SPECIFY → IMPLEMENT → REVIEW → VERIFY] per epic

## DO

- Show clear, formatted output
- Include acceptance test progress (checked/total)
- Always suggest next action (`/continue` or `/start`)
- Keep output concise

## DON'T

- Take any action (this is display-only)
- Run tests (that's for `/continue` to do)
- Resume or launch agents
- Show raw JSON to the user

## Related Commands

- `/continue` - Resume workflow from current position
- `/start` - Start TDD workflow from beginning
- `/quality-check` - Run all quality gates
