---
description: Resume interrupted TDD workflow
---

You are helping a developer resume the TDD workflow from where it was interrupted.

## Workflow Reminder

The TDD workflow has two stages:

1. **One-time setup**: DESIGN (optional) → PLAN (all epics and all stories with acceptance criteria written upfront)
2. **Per-epic iteration**: REALIGN → SPECIFY → IMPLEMENT → REVIEW → VERIFY → commit → (next epic)

After VERIFY passes for an epic, if more epics remain:
1. Check if `generated-docs/discovered-impacts.md` has impacts for the next epic → REALIGN phase
2. If no impacts (or after REALIGN), proceed to SPECIFY for the next epic

## Step 1: Validate Workflow State

First, check if workflow state exists and is valid:

```bash
node .claude/scripts/transition-phase.js --show
```

### If `status: "no_state"` or state appears stale:

**Automatically attempt to repair the state first:**
```bash
node .claude/scripts/transition-phase.js --repair
```

If repair succeeds, show the user the detected state and ask them to confirm before proceeding.

If repair fails (no artifacts found), ask the user:
> "No workflow state or artifacts found. Would you like to start fresh with `/start`, or describe the current state so I can help you continue?"

**Important:** After repair, check the **confidence level** in the output:
- `"confidence": "high"` - State is reliable, show summary and proceed
- `"confidence": "medium"` - Show the `detected` and `assumed` arrays, ask user to confirm
- `"confidence": "low"` - **REQUIRE** user to verify before proceeding, show warning prominently

The repair output includes:
- `detected`: What was clearly found in artifacts
- `assumed`: What was inferred (may be wrong)
- `confidenceReason`: Explanation of confidence level

### If state exists:

Display a brief summary:
```
Current State:
- Epic: [N] - [name]
- Phase: [phase]
- Story: [current story if any]
```

Ask the user to confirm this is correct before proceeding. If they say it's wrong, use `--repair` or ask them to describe the correct state.

## Step 2: Detect Detailed State (if needed)

For additional context, run the detection script:

```bash
node .claude/scripts/detect-workflow-state.js json
```

This provides:
- `spec`: Path to feature specification
- `epics[]`: Array with each epic's name, phase, story/test counts, acceptance test progress
- `resume.epic`: Which epic to resume
- `resume.phase`: Detected phase from artifacts

**Note:** The `workflow-state.json` file is authoritative. The detection script provides supplementary information but should not override the state file.

## Step 3: Resume with Appropriate Agent

Based on `workflow-state.json`, determine the agent and context:

| Phase | Agent | Context to Provide |
|-------|-------|-------------------|
| PLAN | `feature-planner` | Spec path |
| DESIGN | `ui-ux-designer` | Spec path, epic overview |
| REALIGN | `feature-planner` | Epic number, discovered-impacts.md path |
| SPECIFY | `test-generator` | Epic number, story files path |
| IMPLEMENT | `developer` | Epic, story, test file path, failing tests (see below) |
| REVIEW | `code-reviewer` | Epic number, files changed |
| VERIFY | `quality-gate-checker` | Epic number |
| COMPLETE | — | Transition to next epic or finish (see below) |

Always provide: current epic number/name, current story (from state), relevant file paths.

### For IMPLEMENT phase:

Before invoking `developer`, run `npm test` in `/web` to identify failing tests:
- Show the user which tests are failing
- Include the failing test output when handing off to the developer agent

### For COMPLETE phase:

- If more epics exist: Transition to next epic's REALIGN or SPECIFY phase
- If no more epics: Display success message - feature complete!

## Step 5: Remind Agent to Update State

**Critical:** Before handing off to an agent, remind them:

> "When you complete this phase, you MUST update the workflow state by running:
> ```bash
> node .claude/scripts/transition-phase.js --epic [N] --to [NEXT_PHASE]
> ```
> Do not proceed to the next phase without running this command."

## Error Handling

- **State file missing:** Use `--repair` to reconstruct from artifacts
- **State appears wrong:** Ask user to confirm or correct
- **Script fails:** Ask user to describe current state manually
- **Invalid transition:** Show allowed transitions and ask user what to do

## Script Execution Verification

**All transition scripts output JSON. Always verify the result before proceeding:**

1. `"status": "ok"` = Success, proceed to next step
2. `"status": "error"` = **STOP**, report the error to the user
3. `"status": "warning"` = Proceed with caution, inform user

**For repair operations**, check the confidence level (see Step 1 for details).

Example error handling:
```
# If script output shows:
{ "status": "error", "message": "Invalid transition..." }

# Then STOP and tell the user:
"The workflow transition failed: [message]. Please check the current state with /status."
```

## DO

- Always validate state at the start of the session
- Ask user to confirm state before proceeding
- Commit work before handing off to the next agent
- Remind agents to use the transition script

## DON'T

- Auto-approve anything on behalf of the user
- Skip state validation
- Trust artifact detection over the state file
- Proceed if the user says the state is wrong

## Related Commands

- `/start` - Start TDD workflow from the beginning
- `/status` - Show current progress without resuming
- `/quality-check` - Validate all 5 quality gates
