#!/usr/bin/env node
/**
 * transition-phase.js
 * Manages workflow state transitions with validation
 *
 * Usage:
 *   node .claude/scripts/transition-phase.js --epic <N> --to <PHASE> [--story <name>] [--validate] [--verify-output]
 *   node .claude/scripts/transition-phase.js --current --to <PHASE> [--story <name>] [--validate] [--verify-output]
 *   node .claude/scripts/transition-phase.js --show
 *   node .claude/scripts/transition-phase.js --repair
 *
 * Phases: PLAN, DESIGN, REALIGN, SPECIFY, IMPLEMENT, REVIEW, VERIFY, COMPLETE
 *
 * Options:
 *   --validate       Validate prerequisites before transitioning
 *   --verify-output  After transition, verify the FROM phase created expected outputs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const STATE_FILE = '.claude/context/workflow-state.json';
const CONTEXT_DIR = '.claude/context';
const VALIDATE_SCRIPT = '.claude/scripts/validate-phase-output.js';

// Valid phases in order
const PHASES = ['PLAN', 'DESIGN', 'REALIGN', 'SPECIFY', 'IMPLEMENT', 'REVIEW', 'VERIFY', 'COMPLETE'];

// Valid transitions (from -> [allowed destinations])
const VALID_TRANSITIONS = {
  'PLAN': ['DESIGN', 'SPECIFY'],           // After planning, either design wireframes or go to specify
  'DESIGN': ['PLAN', 'SPECIFY'],           // After design, back to plan or to specify
  'REALIGN': ['SPECIFY'],                  // After realign, proceed to specify
  'SPECIFY': ['IMPLEMENT'],                // After writing tests, implement
  'IMPLEMENT': ['REVIEW'],                 // After implementation, review
  'REVIEW': ['VERIFY', 'IMPLEMENT'],       // After review, verify (or back to implement if issues)
  'VERIFY': ['COMPLETE', 'IMPLEMENT'],     // After verify, complete (or back to implement if failures)
  'NONE': ['PLAN', 'REALIGN']              // Initial state (REALIGN for epics 2+)
};

// =============================================================================
// HELPERS
// =============================================================================

function ensureContextDir() {
  if (!fs.existsSync(CONTEXT_DIR)) {
    fs.mkdirSync(CONTEXT_DIR, { recursive: true });
  }
}

function readState() {
  if (!fs.existsSync(STATE_FILE)) {
    return null;
  }
  try {
    const content = fs.readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    console.error(`Error reading state file: ${e.message}`);
    return null;
  }
}

function writeState(state) {
  ensureContextDir();
  state.lastUpdated = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function findFeatureSpec() {
  const docDir = 'documentation';
  if (!fs.existsSync(docDir)) return null;

  const files = fs.readdirSync(docDir)
    .filter(f => f.endsWith('.md') && f !== 'README.md');

  return files.length > 0 ? path.join(docDir, files[0]) : null;
}

function getEpicInfo(epicNum) {
  const epicDirs = [];
  const storiesDir = 'generated-docs/stories';

  if (fs.existsSync(storiesDir)) {
    const entries = fs.readdirSync(storiesDir);
    for (const entry of entries) {
      const match = entry.match(/^epic-(\d+)/);
      if (match) {
        epicDirs.push({
          num: parseInt(match[1]),
          name: entry,
          path: path.join(storiesDir, entry)
        });
      }
    }
  }

  epicDirs.sort((a, b) => a.num - b.num);

  if (epicNum) {
    return epicDirs.find(e => e.num === epicNum) || null;
  }
  return epicDirs;
}

function validateTransition(currentPhase, targetPhase, state, epicNum) {
  const from = currentPhase || 'NONE';
  const allowed = VALID_TRANSITIONS[from] || [];

  // Special case: REALIGN/SPECIFY for epic 2+ requires previous epic to be COMPLETE
  if (from === 'NONE' && epicNum > 1 && ['REALIGN', 'SPECIFY'].includes(targetPhase)) {
    if (!state || !state.epics[epicNum - 1] || state.epics[epicNum - 1].phase !== 'COMPLETE') {
      return {
        valid: false,
        message: `Cannot start Epic ${epicNum}: Epic ${epicNum - 1} is not COMPLETE`
      };
    }
    return { valid: true };
  }

  if (!allowed.includes(targetPhase)) {
    return {
      valid: false,
      message: `Invalid transition: ${from} → ${targetPhase}. Allowed transitions from ${from}: ${allowed.join(', ') || 'none'}`
    };
  }

  return { valid: true };
}

// Phase prerequisites - what must exist before transitioning TO a phase
const PHASE_PREREQUISITES = {
  'PLAN': [], // Can start planning anytime
  'DESIGN': [], // Can start design anytime
  'REALIGN': ['PLAN'], // Need completed planning
  'SPECIFY': ['PLAN'], // Need stories to generate tests from
  'IMPLEMENT': ['SPECIFY'], // Need tests to implement against
  'REVIEW': ['IMPLEMENT'], // Need implementation to review
  'VERIFY': ['REVIEW'], // Need review complete
  'COMPLETE': ['VERIFY'] // Need verification to complete
};

function runValidationScript(phase, epicNum) {
  // Run the validate-phase-output.js script and return its result
  if (!fs.existsSync(VALIDATE_SCRIPT)) {
    return {
      status: 'skipped',
      message: 'Validation script not found',
      path: VALIDATE_SCRIPT
    };
  }

  try {
    const epicArg = epicNum ? `--epic ${epicNum}` : '';
    const cmd = `node ${VALIDATE_SCRIPT} --phase ${phase} ${epicArg}`;
    const output = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return JSON.parse(output);
  } catch (error) {
    // Script exited with non-zero - parse the output if possible
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch {
        // Couldn't parse output
      }
    }
    return {
      status: 'error',
      message: `Validation script failed: ${error.message}`,
      exitCode: error.status || 1
    };
  }
}

function validatePrerequisites(targetPhase, epicNum) {
  // Check that prerequisites for the target phase are met
  const prereqs = PHASE_PREREQUISITES[targetPhase] || [];

  if (prereqs.length === 0) {
    return { valid: true, message: 'No prerequisites required' };
  }

  const results = [];
  let allValid = true;

  for (const prereqPhase of prereqs) {
    const validation = runValidationScript(prereqPhase, epicNum);

    if (validation.status === 'invalid' || validation.status === 'error') {
      allValid = false;
    }

    results.push({
      phase: prereqPhase,
      ...validation
    });
  }

  return {
    valid: allValid,
    message: allValid
      ? `All prerequisites for ${targetPhase} are met`
      : `Prerequisites for ${targetPhase} not met`,
    prerequisites: results
  };
}

// =============================================================================
// COMMANDS
// =============================================================================

function showState() {
  const state = readState();

  if (!state) {
    console.log(JSON.stringify({
      status: 'no_state',
      message: 'No workflow state found. Run /start to begin.',
      suggestion: 'Use --repair to initialize state from artifacts'
    }, null, 2));
    return;
  }

  console.log(JSON.stringify({
    status: 'ok',
    state
  }, null, 2));
}

function repairState() {
  // Attempt to reconstruct state from filesystem artifacts
  const spec = findFeatureSpec();
  const epics = getEpicInfo();

  if (!spec) {
    console.log(JSON.stringify({
      status: 'error',
      message: 'No feature spec found in documentation/. Cannot repair state.'
    }, null, 2));
    process.exit(1);
  }

  // Track what we detected vs what we assumed for confidence calculation
  const detected = [];
  const assumed = [];
  let confidenceScore = 100; // Start at 100, deduct for assumptions

  // Determine current state by scanning artifacts
  let currentEpic = null;
  let currentPhase = 'PLAN';
  let epicStates = {};

  // Check for feature overview
  const featureOverviewPath = 'generated-docs/stories/_feature-overview.md';
  const hasFeatureOverview = fs.existsSync(featureOverviewPath);
  if (hasFeatureOverview) {
    detected.push('Feature overview file exists');
  } else {
    assumed.push('No feature overview - assuming PLAN phase needed');
    confidenceScore -= 10;
  }

  // Check for quality gate status (indicates VERIFY completed)
  const qualityGateStatus = '.claude/context/quality-gate-status.json';
  const hasQualityGate = fs.existsSync(qualityGateStatus);
  if (hasQualityGate) {
    detected.push('Quality gate status file exists');
  }

  for (const epic of epics) {
    const hasOverview = fs.existsSync(path.join(epic.path, '_epic-overview.md'));
    let storyFiles = [];
    try {
      storyFiles = fs.readdirSync(epic.path).filter(f => f.startsWith('story-') && f.endsWith('.md'));
    } catch {
      // Directory exists but can't read it
      assumed.push(`Could not read epic-${epic.num} directory`);
      confidenceScore -= 15;
    }

    // Check for test files (flexible matching)
    let hasTests = false;
    let testFileCount = 0;
    const testDirs = ['web/src/__tests__/integration', 'web/src/__tests__'];
    for (const testDir of testDirs) {
      if (fs.existsSync(testDir)) {
        try {
          const testFiles = fs.readdirSync(testDir, { recursive: true })
            .filter(f => typeof f === 'string' && f.includes(`epic-${epic.num}`) && (f.endsWith('.test.tsx') || f.endsWith('.test.ts')));
          if (testFiles.length > 0) {
            hasTests = true;
            testFileCount = testFiles.length;
            break;
          }
        } catch {
          // Can't read test dir
        }
      }
    }

    // Also check for epic-specific test directories
    const epicTestDir = `web/src/__tests__/epic-${epic.num}`;
    if (fs.existsSync(epicTestDir)) {
      hasTests = true;
    }

    // Check for review marker
    const reviewMarker = `generated-docs/reviews/epic-${epic.num}-review.md`;
    const hasReviewMarker = fs.existsSync(reviewMarker);

    // Check for review findings in context
    let hasReviewFindings = false;
    const reviewFindingsPath = '.claude/context/review-findings.json';
    if (fs.existsSync(reviewFindingsPath)) {
      try {
        const findings = JSON.parse(fs.readFileSync(reviewFindingsPath, 'utf-8'));
        if (findings.recommendation) {
          hasReviewFindings = true;
        }
      } catch {
        // Invalid JSON
      }
    }

    // Determine epic phase with confidence tracking
    let epicPhase;
    let phaseConfidence = 'high';

    if (!hasOverview || storyFiles.length === 0) {
      epicPhase = 'PLAN';
      if (!hasOverview && storyFiles.length === 0) {
        detected.push(`Epic ${epic.num}: No overview or stories - PLAN phase`);
      } else {
        assumed.push(`Epic ${epic.num}: Partial artifacts - assuming PLAN`);
        phaseConfidence = 'medium';
        confidenceScore -= 10;
      }
    } else if (!hasTests) {
      epicPhase = 'SPECIFY';
      detected.push(`Epic ${epic.num}: Has ${storyFiles.length} stories, no tests - SPECIFY phase`);
    } else if (hasReviewMarker || (hasQualityGate && hasReviewFindings)) {
      epicPhase = 'COMPLETE';
      detected.push(`Epic ${epic.num}: Has review marker or quality gate - COMPLETE`);
    } else if (hasReviewFindings) {
      epicPhase = 'VERIFY';
      detected.push(`Epic ${epic.num}: Has review findings - VERIFY phase`);
    } else {
      // Has tests but no review - could be IMPLEMENT or REVIEW
      epicPhase = 'IMPLEMENT';
      assumed.push(`Epic ${epic.num}: Has ${testFileCount} tests but no review marker - assuming IMPLEMENT (could be REVIEW)`);
      phaseConfidence = 'medium';
      confidenceScore -= 15;
    }

    epicStates[epic.num] = {
      name: epic.name,
      phase: epicPhase,
      stories: storyFiles.length,
      tests: testFileCount,
      phaseConfidence
    };

    // Track first incomplete epic
    if (!currentEpic && epicPhase !== 'COMPLETE') {
      currentEpic = epic.num;
      currentPhase = epicPhase;
    }
  }

  // If no epics found, confidence is low
  if (epics.length === 0) {
    assumed.push('No epic directories found - starting fresh');
    confidenceScore -= 20;
  }

  // Calculate overall confidence level
  let confidence;
  let confidenceReason;
  if (confidenceScore >= 80) {
    confidence = 'high';
    confidenceReason = 'Most artifacts clearly indicate current state';
  } else if (confidenceScore >= 50) {
    confidence = 'medium';
    confidenceReason = 'Some artifacts found but state partially inferred';
  } else {
    confidence = 'low';
    confidenceReason = 'Many assumptions made - manual verification strongly recommended';
  }

  // Build repaired state
  const repairedState = {
    featureName: path.basename(spec, '.md'),
    specPath: spec,
    currentEpic: currentEpic || (epics.length > 0 ? epics[epics.length - 1].num : 1),
    currentPhase: currentEpic ? currentPhase : 'COMPLETE',
    epics: epicStates,
    repairedAt: new Date().toISOString(),
    repairNote: 'State reconstructed from artifacts.'
  };

  writeState(repairedState);

  // Build detailed response
  const response = {
    status: 'repaired',
    message: 'State file repaired from artifacts.',
    confidence,
    confidenceScore,
    confidenceReason,
    detected,
    assumed,
    state: repairedState
  };

  // Add warning based on confidence
  if (confidence === 'low') {
    response.warning = 'LOW CONFIDENCE: Many assumptions were made. Please verify the state manually before proceeding.';
  } else if (confidence === 'medium') {
    response.warning = 'MEDIUM CONFIDENCE: Some state was inferred. Review the detected state and confirm it matches your expectations.';
  } else {
    response.note = 'High confidence repair. State appears accurate based on artifacts found.';
  }

  console.log(JSON.stringify(response, null, 2));
}

function transitionPhase(epicNum, targetPhase, storyName, options = {}) {
  const { validate = false, verifyOutput = false } = options;

  if (!PHASES.includes(targetPhase)) {
    console.log(JSON.stringify({
      status: 'error',
      message: `Invalid phase: ${targetPhase}. Valid phases: ${PHASES.join(', ')}`
    }, null, 2));
    process.exit(1);
  }

  let state = readState();

  // Initialize state if it doesn't exist
  if (!state) {
    const spec = findFeatureSpec();
    if (!spec) {
      console.log(JSON.stringify({
        status: 'error',
        message: 'No feature spec found. Create a spec in documentation/ first.'
      }, null, 2));
      process.exit(1);
    }

    state = {
      featureName: path.basename(spec, '.md'),
      specPath: spec,
      currentEpic: epicNum,
      currentPhase: 'NONE',
      epics: {}
    };
  }

  // Validate the transition
  const currentPhase = state.currentEpic === epicNum ? state.currentPhase :
    (state.epics[epicNum]?.phase || 'NONE');

  const validation = validateTransition(currentPhase, targetPhase, state, epicNum);
  if (!validation.valid) {
    console.log(JSON.stringify({
      status: 'error',
      message: validation.message,
      currentState: {
        epic: epicNum,
        phase: currentPhase
      }
    }, null, 2));
    process.exit(1);
  }

  // If --validate flag is set, check prerequisites
  if (validate) {
    const prereqCheck = validatePrerequisites(targetPhase, epicNum);
    if (!prereqCheck.valid) {
      console.log(JSON.stringify({
        status: 'error',
        message: prereqCheck.message,
        prerequisites: prereqCheck.prerequisites,
        suggestion: 'Complete the prerequisite phases before transitioning'
      }, null, 2));
      process.exit(1);
    }
  }

  // If --verify-output flag is set, validate that the FROM phase created expected outputs
  // Result is included in the final response, not output separately
  let outputValidation = null;
  if (verifyOutput && currentPhase !== 'NONE') {
    outputValidation = runValidationScript(currentPhase, epicNum);
  }

  // Update state
  state.currentEpic = epicNum;
  state.currentPhase = targetPhase;

  if (!state.epics[epicNum]) {
    state.epics[epicNum] = {};
  }
  state.epics[epicNum].phase = targetPhase;

  // Handle epic completion
  if (targetPhase === 'COMPLETE') {
    // Auto-detect totalEpics from epic directories if not set
    if (!state.totalEpics) {
      const epicDirs = getEpicInfo();
      if (epicDirs.length > 0) {
        state.totalEpics = epicDirs.length;
      }
    }

    // Check if this is the final epic
    if (state.totalEpics && epicNum >= state.totalEpics) {
      // Feature is complete - don't advance to non-existent epic
      state.featureComplete = true;
      // Keep currentEpic pointing to the last completed epic
      state.currentPhase = 'COMPLETE';
    } else {
      // More epics to go - advance to next epic
      state.currentEpic = epicNum + 1;
      state.currentPhase = 'NONE';  // Next epic starts fresh
    }
  }

  if (storyName) {
    state.currentStory = storyName;
    state.epics[epicNum].currentStory = storyName;
  }

  // Record transition history
  if (!state.history) {
    state.history = [];
  }
  state.history.push({
    timestamp: new Date().toISOString(),
    epic: epicNum,
    from: currentPhase,
    to: targetPhase,
    story: storyName || null
  });

  // Keep only last 20 history entries
  if (state.history.length > 20) {
    state.history = state.history.slice(-20);
  }

  writeState(state);

  // Build response message
  const response = {
    status: 'ok',
    message: `Transitioned Epic ${epicNum} from ${currentPhase} to ${targetPhase}`,
    state: {
      epic: state.currentEpic,
      phase: state.currentPhase,
      story: storyName || null
    }
  };

  // Add feature complete info if applicable
  if (state.featureComplete) {
    response.featureComplete = true;
    response.message = `Epic ${epicNum} complete. Feature finished! All ${state.totalEpics} epics done.`;
  }

  // Include output validation results if --verify-output was used
  if (outputValidation) {
    response.outputValidation = outputValidation;
    if (outputValidation.status !== 'valid') {
      response.warning = `Previous phase (${currentPhase}) may have incomplete outputs. Review before proceeding.`;
    }
  }

  console.log(JSON.stringify(response, null, 2));
}

function setTotalEpics(total) {
  let state = readState();

  if (!state) {
    console.log(JSON.stringify({
      status: 'error',
      message: 'No workflow state found. Initialize state first by transitioning to PLAN.'
    }, null, 2));
    process.exit(1);
  }

  state.totalEpics = total;
  writeState(state);

  console.log(JSON.stringify({
    status: 'ok',
    message: `Set total epics to ${total}`,
    totalEpics: total
  }, null, 2));
}

function initState(initialPhase) {
  // Check if state already exists
  const existingState = readState();
  if (existingState) {
    console.log(JSON.stringify({
      status: 'exists',
      message: 'Workflow state already exists. Use --show to view or --repair to reconstruct.',
      state: existingState
    }, null, 2));
    return;
  }

  // Find the feature spec
  const spec = findFeatureSpec();
  if (!spec) {
    console.log(JSON.stringify({
      status: 'error',
      message: 'No feature spec found in documentation/. Create a spec first.'
    }, null, 2));
    process.exit(1);
  }

  // Create initial state
  const state = {
    featureName: path.basename(spec, '.md'),
    specPath: spec,
    currentEpic: 1,
    currentPhase: initialPhase,
    epics: {
      1: { phase: initialPhase }
    },
    history: [{
      timestamp: new Date().toISOString(),
      epic: 1,
      from: 'NONE',
      to: initialPhase,
      note: 'Workflow initialized'
    }]
  };

  writeState(state);

  console.log(JSON.stringify({
    status: 'ok',
    message: `Workflow initialized at ${initialPhase} phase`,
    state
  }, null, 2));
}

// =============================================================================
// CLI
// =============================================================================

function printUsage() {
  console.log(`
Usage:
  node .claude/scripts/transition-phase.js --epic <N> --to <PHASE> [--story <name>] [--validate] [--verify-output]
  node .claude/scripts/transition-phase.js --current --to <PHASE> [--story <name>] [--validate] [--verify-output]
  node .claude/scripts/transition-phase.js --init [DESIGN|PLAN]
  node .claude/scripts/transition-phase.js --set-total-epics <N>
  node .claude/scripts/transition-phase.js --show
  node .claude/scripts/transition-phase.js --repair

Options:
  --epic <N>            Epic number for transitions
  --current             Use current epic from state (alternative to --epic)
  --to <PHASE>          Target phase: ${PHASES.join(', ')}
  --story <name>        Optional story name for tracking
  --validate            Check prerequisites before allowing transition
  --verify-output       Validate that the FROM phase created expected outputs
  --init [PHASE]        Initialize workflow state (use DESIGN or PLAN, defaults to DESIGN)
  --set-total-epics <N> Set the total number of epics for this feature
  --show                Display current workflow state
  --repair              Attempt to reconstruct state from artifacts

Examples:
  node .claude/scripts/transition-phase.js --init DESIGN
  node .claude/scripts/transition-phase.js --init PLAN
  node .claude/scripts/transition-phase.js --epic 1 --to PLAN
  node .claude/scripts/transition-phase.js --set-total-epics 3
  node .claude/scripts/transition-phase.js --epic 1 --to SPECIFY --validate
  node .claude/scripts/transition-phase.js --current --to IMPLEMENT --verify-output
  node .claude/scripts/transition-phase.js --current --to REVIEW
  node .claude/scripts/transition-phase.js --show
`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  if (args.includes('--show')) {
    showState();
    return;
  }

  if (args.includes('--repair')) {
    repairState();
    return;
  }

  // Handle --init
  const initIdx = args.indexOf('--init');
  if (initIdx !== -1) {
    // Default to DESIGN if no phase specified, or use the provided phase
    let initialPhase = 'DESIGN';
    const nextArg = args[initIdx + 1];
    if (nextArg && !nextArg.startsWith('--')) {
      initialPhase = nextArg.toUpperCase();
      if (!['DESIGN', 'PLAN'].includes(initialPhase)) {
        console.log(JSON.stringify({
          status: 'error',
          message: `Invalid initial phase: ${initialPhase}. Use DESIGN or PLAN.`
        }, null, 2));
        process.exit(1);
      }
    }
    initState(initialPhase);
    return;
  }

  // Handle --set-total-epics
  const totalEpicsIdx = args.indexOf('--set-total-epics');
  if (totalEpicsIdx !== -1 && args[totalEpicsIdx + 1]) {
    const total = parseInt(args[totalEpicsIdx + 1]);
    if (isNaN(total) || total < 1) {
      console.log(JSON.stringify({
        status: 'error',
        message: 'Invalid total epics value. Must be a positive integer.'
      }, null, 2));
      process.exit(1);
    }
    setTotalEpics(total);
    return;
  }

  // Parse transition arguments
  let epicNum = null;
  let targetPhase = null;
  let storyName = null;
  let useCurrent = false;
  let validate = false;
  let verifyOutput = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--epic' && args[i + 1]) {
      epicNum = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--current') {
      useCurrent = true;
    } else if (args[i] === '--to' && args[i + 1]) {
      targetPhase = args[i + 1].toUpperCase();
      i++;
    } else if (args[i] === '--story' && args[i + 1]) {
      storyName = args[i + 1];
      i++;
    } else if (args[i] === '--validate') {
      validate = true;
    } else if (args[i] === '--verify-output') {
      verifyOutput = true;
    }
  }

  // Handle --current flag
  if (useCurrent) {
    const state = readState();
    if (!state) {
      console.log(JSON.stringify({
        status: 'error',
        message: 'No workflow state found. Cannot use --current. Use --epic <N> instead or run --repair first.'
      }, null, 2));
      process.exit(1);
    }
    epicNum = state.currentEpic;
    if (!epicNum) {
      console.log(JSON.stringify({
        status: 'error',
        message: 'No current epic in state. Use --epic <N> to specify explicitly.'
      }, null, 2));
      process.exit(1);
    }
  }

  if (!epicNum || !targetPhase) {
    console.log(JSON.stringify({
      status: 'error',
      message: 'Missing required arguments. Need --epic <N> (or --current) and --to <PHASE>'
    }, null, 2));
    printUsage();
    process.exit(1);
  }

  transitionPhase(epicNum, targetPhase, storyName, { validate, verifyOutput });
}

main();
