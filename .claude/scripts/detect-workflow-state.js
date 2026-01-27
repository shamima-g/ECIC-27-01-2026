#!/usr/bin/env node
/**
 * detect-workflow-state.js
 * Detects TDD workflow state by scanning artifacts (no test execution)
 * Usage: node .claude/scripts/detect-workflow-state.js [json|human]
 */

const fs = require('fs');
const path = require('path');

const format = process.argv[2] || 'json';

// ============================================================================
// ERROR HANDLING
// ============================================================================

function outputError(error, code, details = {}) {
  if (format === 'json') {
    console.log(JSON.stringify({
      error: code,
      message: error.message || String(error),
      details,
      suggestion: getSuggestion(code)
    }, null, 2));
  } else {
    console.error(`Error [${code}]: ${error.message || error}`);
    if (details.path) console.error(`  Path: ${details.path}`);
    console.error(`  Suggestion: ${getSuggestion(code)}`);
  }
  process.exit(1);
}

function getSuggestion(code) {
  const suggestions = {
    'no_spec': 'Create a feature spec in documentation/ (not README.md)',
    'permission_denied': 'Check file/directory permissions',
    'invalid_structure': 'Ensure generated-docs/stories/ directory exists',
    'parse_error': 'Check for syntax errors in JSON config files',
    'unknown': 'Try running /start to initialize the workflow'
  };
  return suggestions[code] || suggestions['unknown'];
}

// Wrap entire script in try/catch for unexpected errors
try {
  main();
} catch (error) {
  // Determine error type
  if (error.code === 'EACCES' || error.code === 'EPERM') {
    outputError(error, 'permission_denied', { path: error.path });
  } else if (error.code === 'ENOENT') {
    outputError(error, 'invalid_structure', { path: error.path });
  } else if (error instanceof SyntaxError) {
    outputError(error, 'parse_error');
  } else {
    outputError(error, 'unknown', { stack: error.stack });
  }
}

function main() {
  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  function findFiles(dir, pattern) {
    if (!fs.existsSync(dir)) return [];

    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');

    try {
      return fs.readdirSync(dir)
        .filter(file => regex.test(file))
        .map(file => path.join(dir, file));
    } catch {
      return [];
    }
  }

  function findFilesRecursive(dir, pattern) {
    if (!fs.existsSync(dir)) return [];

    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    const results = [];

    function walk(currentDir) {
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            walk(fullPath);
          } else if (regex.test(entry.name)) {
            results.push(fullPath);
          }
        }
      } catch {
        // Ignore permission errors on individual directories
      }
    }

    walk(dir);
    return results;
  }

  function countAcceptanceTests(epicPath) {
    const storyFiles = findFiles(epicPath, 'story-*.md');
    let checked = 0;
    let unchecked = 0;

    for (const file of storyFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        // Match both - and * list markers, case-insensitive for [x]
        const checkedMatches = content.match(/^\s*[-*] \[[xX]\]/gm);
        const uncheckedMatches = content.match(/^\s*[-*] \[ \]/gm);

        checked += checkedMatches ? checkedMatches.length : 0;
        unchecked += uncheckedMatches ? uncheckedMatches.length : 0;
      } catch {
        // Skip unreadable files
      }
    }

    return { checked, unchecked };
  }

  function checkReviewComplete(epicNum) {
    // Check workflow-state.json for REVIEW status
    const workflowStatePath = '.claude/context/workflow-state.json';
    if (fs.existsSync(workflowStatePath)) {
      try {
        const content = fs.readFileSync(workflowStatePath, 'utf-8');
        const state = JSON.parse(content);
        if (state.phases?.REVIEW?.status === 'completed') {
          return true;
        }
      } catch {
        // Invalid JSON, continue checking other sources
      }
    }

    // Check review-findings.json
    const reviewFindingsPath = '.claude/context/review-findings.json';
    if (fs.existsSync(reviewFindingsPath)) {
      try {
        const content = fs.readFileSync(reviewFindingsPath, 'utf-8');
        const findings = JSON.parse(content);
        if (findings.recommendation) {
          return true;
        }
      } catch {
        // Invalid JSON
      }
    }

    // Check epic-specific review marker
    const reviewMarkerPath = `generated-docs/reviews/epic-${epicNum}-review.md`;
    if (fs.existsSync(reviewMarkerPath)) {
      return true;
    }

    return false;
  }

  function findFirstIncompleteStory(epicPath) {
    const storyFiles = findFiles(epicPath, 'story-*.md').sort();

    for (const file of storyFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        if (/^\s*[-*] \[ \]/m.test(content)) {
          return path.basename(file, '.md');
        }
      } catch {
        // Skip unreadable files
      }
    }

    return null;
  }

  function getDiscoveredImpactsForEpic(epicNum) {
    // Check if discovered-impacts.md exists and has impacts for this epic
    const impactsPath = 'generated-docs/discovered-impacts.md';
    if (!fs.existsSync(impactsPath)) {
      return { exists: false, hasImpactsForEpic: false, impactCount: 0 };
    }

    try {
      const content = fs.readFileSync(impactsPath, 'utf-8');
      if (!content.trim()) {
        return { exists: true, hasImpactsForEpic: false, impactCount: 0 };
      }

      // Look for impacts that affect this epic
      // Pattern: "Affects: Epic N" or "Affects: Epic N,"
      const epicPattern = new RegExp(`\\*\\*Affects:\\*\\*.*Epic\\s+${epicNum}[,:\\s]`, 'gi');
      const matches = content.match(epicPattern);
      const impactCount = matches ? matches.length : 0;

      return {
        exists: true,
        hasImpactsForEpic: impactCount > 0,
        impactCount
      };
    } catch {
      return { exists: false, hasImpactsForEpic: false, impactCount: 0 };
    }
  }

  // ============================================================================
  // DETECTION
  // ============================================================================

  // Find feature spec
  const specFiles = findFiles('documentation', '*.md')
    .filter(f => !f.endsWith('README.md'));
  const spec = specFiles[0] || null;

  // Count wireframes
  const wireframeCount = findFilesRecursive('generated-docs/wireframes', '*.md').length;

  // Find epic directories
  const storiesDir = 'generated-docs/stories';
  let epicDirs = [];

  if (fs.existsSync(storiesDir)) {
    const entries = fs.readdirSync(storiesDir);
    epicDirs = entries
      .filter(d => d.startsWith('epic-'))
      .map(d => path.join(storiesDir, d))
      .filter(d => {
        try {
          return fs.statSync(d).isDirectory();
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        // Sort by epic number
        const numA = parseInt(path.basename(a).match(/epic-(\d+)/)?.[1] || '0');
        const numB = parseInt(path.basename(b).match(/epic-(\d+)/)?.[1] || '0');
        return numA - numB;
      });
  }

  // Build epic status array
  const epics = [];
  let firstIncomplete = null;
  let firstIncompletePhase = null;
  let firstIncompleteStory = null;
  let previousEpicComplete = false;

  for (let i = 0; i < epicDirs.length; i++) {
    const epicPath = epicDirs[i];
    const epicName = path.basename(epicPath);
    const epicNumMatch = epicName.match(/epic-(\d+)/);
    const epicNum = epicNumMatch ? epicNumMatch[1] : '0';

    // Check artifacts
    const hasOverview = fs.existsSync(path.join(epicPath, '_epic-overview.md'));
    const storyCount = findFiles(epicPath, 'story-*.md').length;

    // Find test files for this epic
    const testDir = 'web/src/__tests__/integration';
    let testCount = 0;
    if (fs.existsSync(testDir)) {
      try {
        const testFiles = fs.readdirSync(testDir).filter(f =>
          f.startsWith(`epic-${epicNum}-`) && (f.endsWith('.test.tsx') || f.endsWith('.test.ts'))
        );
        testCount = testFiles.length;
      } catch {
        // Can't read test dir
      }
    }

    // Check review status
    const reviewComplete = checkReviewComplete(epicNum);

    // Count acceptance tests
    const acceptance = countAcceptanceTests(epicPath);

    // Check for discovered impacts affecting this epic
    const impacts = getDiscoveredImpactsForEpic(epicNum);

    // Determine phase
    let phase;
    if (!hasOverview || storyCount === 0) {
      phase = 'PLAN';
    } else if (testCount === 0) {
      // Check if this epic needs REALIGN before SPECIFY
      // REALIGN is needed if: previous epic is complete and there are impacts
      if (previousEpicComplete && impacts.hasImpactsForEpic) {
        phase = 'REALIGN';
      } else {
        phase = 'SPECIFY';
      }
    } else if (acceptance.unchecked > 0) {
      if (reviewComplete) {
        phase = 'VERIFY';
      } else {
        phase = 'IMPLEMENT_OR_REVIEW';
      }
    } else {
      phase = 'COMPLETE';
    }

    // Track first incomplete epic
    if (!firstIncomplete && phase !== 'COMPLETE') {
      firstIncomplete = epicName;
      firstIncompletePhase = phase;
      firstIncompleteStory = findFirstIncompleteStory(epicPath);
    }

    // Track if this epic is complete for the next iteration
    previousEpicComplete = (phase === 'COMPLETE');

    epics.push({
      name: epicName,
      phase,
      stories: storyCount,
      tests: testCount,
      reviewComplete,
      acceptance,
      discoveredImpacts: impacts.impactCount
    });
  }

  // ============================================================================
  // OUTPUT
  // ============================================================================

  if (format === 'json') {
    if (!spec) {
      console.log(JSON.stringify({
        error: 'no_spec',
        message: 'No feature spec found in documentation/',
        suggestion: getSuggestion('no_spec')
      }, null, 2));
      process.exit(1);
    }

    // Determine action
    let action;
    if (firstIncompletePhase === 'IMPLEMENT_OR_REVIEW') {
      action = 'run_tests_to_determine';
    } else if (!firstIncomplete) {
      action = 'all_complete';
    } else if (firstIncompletePhase === 'REALIGN') {
      action = 'realign_needed';
    } else {
      action = 'proceed';
    }

    const output = {
      spec,
      wireframes: wireframeCount,
      epics,
      resume: {
        epic: firstIncomplete || 'none',
        story: firstIncompleteStory || '',
        phase: firstIncompletePhase || 'ALL_COMPLETE',
        action
      }
    };

    console.log(JSON.stringify(output, null, 2));
  } else {
    // Human-readable output
    console.log('=== Workflow State ===');
    console.log(`Spec: ${spec || 'NOT FOUND'}`);
    console.log(`Wireframes: ${wireframeCount}`);
    console.log('');
    console.log('=== Epics ===');
    for (const epic of epics) {
      console.log(`  ${epic.name} (${epic.phase})`);
    }
    console.log('');
    console.log('=== Resume Point ===');
    console.log(`Epic: ${firstIncomplete || 'All complete'}`);
    console.log(`Phase: ${firstIncompletePhase || 'DONE'}`);
  }
}
