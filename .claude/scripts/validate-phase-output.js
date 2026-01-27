#!/usr/bin/env node
/**
 * validate-phase-output.js
 * Validates that expected artifacts exist after a workflow phase completes
 *
 * Usage:
 *   node .claude/scripts/validate-phase-output.js --phase <PHASE> [--epic <N>]
 *
 * Phases and their expected artifacts:
 *   DESIGN: wireframes in generated-docs/wireframes/
 *   PLAN: _feature-overview.md, epic dirs with _epic-overview.md and story-*.md
 *   SPECIFY: test files in web/src/__tests__/integration/epic-N-*
 *   IMPLEMENT: source files that tests import
 *   REVIEW: review marker or findings file
 *   VERIFY: quality-gate-status.json
 *
 * Exit codes:
 *   0 - All expected artifacts found
 *   1 - Some non-critical artifacts missing (warnings)
 *   2 - Critical artifacts missing (phase not complete)
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// HELPERS
// =============================================================================

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
      // Ignore permission errors
    }
  }

  walk(dir);
  return results;
}

function fileHasContent(filePath, minBytes = 10) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size >= minBytes;
  } catch {
    return false;
  }
}

function extractImportsFromTestFile(testFilePath) {
  // Extract import paths from a test file to verify implementation exists
  try {
    const content = fs.readFileSync(testFilePath, 'utf-8');
    const imports = [];

    // Match import statements with @/ paths
    const importRegex = /import\s+.*from\s+['"](@\/[^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  } catch {
    return [];
  }
}

function resolveAliasPath(aliasPath) {
  // Convert @/ path to actual file path
  if (aliasPath.startsWith('@/')) {
    const relativePath = aliasPath.replace('@/', 'web/src/');
    // Try with common extensions
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
    for (const ext of extensions) {
      const fullPath = relativePath + ext;
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
  }
  return null;
}

// =============================================================================
// PHASE VALIDATORS
// =============================================================================

function validateDesign() {
  const result = {
    status: 'valid',
    phase: 'DESIGN',
    expected: ['wireframes in generated-docs/wireframes/'],
    found: [],
    missing: [],
    warnings: []
  };

  const wireframeDir = 'generated-docs/wireframes';

  if (!fs.existsSync(wireframeDir)) {
    result.status = 'invalid';
    result.missing.push('generated-docs/wireframes/ directory');
    return result;
  }

  const wireframes = findFiles(wireframeDir, '*.md');
  const overviewFile = path.join(wireframeDir, '_overview.md');

  if (wireframes.length === 0) {
    result.status = 'invalid';
    result.missing.push('wireframe markdown files');
  } else {
    result.found.push(`${wireframes.length} wireframe file(s)`);
  }

  if (!fs.existsSync(overviewFile)) {
    result.warnings.push('_overview.md not found (optional but recommended)');
  } else {
    result.found.push('_overview.md');
  }

  return result;
}

function validatePlan(epicNum) {
  const result = {
    status: 'valid',
    phase: 'PLAN',
    epic: epicNum || 'all',
    expected: ['_feature-overview.md', 'epic directories with stories'],
    found: [],
    missing: [],
    warnings: []
  };

  const storiesDir = 'generated-docs/stories';
  const featureOverview = path.join(storiesDir, '_feature-overview.md');

  // Check feature overview
  if (!fs.existsSync(featureOverview)) {
    result.status = 'invalid';
    result.missing.push('generated-docs/stories/_feature-overview.md');
  } else if (!fileHasContent(featureOverview, 50)) {
    result.status = 'invalid';
    result.missing.push('_feature-overview.md has no content');
  } else {
    result.found.push('_feature-overview.md');
  }

  // Check epic directories
  if (!fs.existsSync(storiesDir)) {
    result.status = 'invalid';
    result.missing.push('generated-docs/stories/ directory');
    return result;
  }

  const epicDirs = fs.readdirSync(storiesDir)
    .filter(d => d.startsWith('epic-'))
    .map(d => path.join(storiesDir, d))
    .filter(d => fs.statSync(d).isDirectory());

  if (epicDirs.length === 0) {
    result.status = 'invalid';
    result.missing.push('epic directories (epic-N-name/)');
    return result;
  }

  // Validate specific epic or all epics
  const epicsToCheck = epicNum
    ? epicDirs.filter(d => path.basename(d).startsWith(`epic-${epicNum}`))
    : epicDirs;

  for (const epicDir of epicsToCheck) {
    const epicName = path.basename(epicDir);
    const epicOverview = path.join(epicDir, '_epic-overview.md');
    const storyFiles = findFiles(epicDir, 'story-*.md');

    if (!fs.existsSync(epicOverview)) {
      result.warnings.push(`${epicName}/_epic-overview.md missing`);
    } else {
      result.found.push(`${epicName}/_epic-overview.md`);
    }

    if (storyFiles.length === 0) {
      result.status = 'invalid';
      result.missing.push(`${epicName}/story-*.md files`);
    } else {
      result.found.push(`${epicName}: ${storyFiles.length} story file(s)`);

      // Validate story files have acceptance criteria
      for (const storyFile of storyFiles) {
        try {
          const content = fs.readFileSync(storyFile, 'utf-8');
          if (!content.includes('## Acceptance Criteria') && !content.includes('### ')) {
            result.warnings.push(`${path.basename(storyFile)} may be missing acceptance criteria`);
          }
        } catch {
          // Skip unreadable files
        }
      }
    }
  }

  return result;
}

function validateSpecify(epicNum) {
  const result = {
    status: 'valid',
    phase: 'SPECIFY',
    epic: epicNum,
    expected: [`test files for epic-${epicNum}`],
    found: [],
    missing: [],
    warnings: []
  };

  if (!epicNum) {
    result.status = 'invalid';
    result.missing.push('Epic number required for SPECIFY validation');
    return result;
  }

  // Look for test files in integration directory
  const testDir = 'web/src/__tests__/integration';

  if (!fs.existsSync(testDir)) {
    result.status = 'invalid';
    result.missing.push('web/src/__tests__/integration/ directory');
    return result;
  }

  // Find test files for this epic
  const testFiles = fs.readdirSync(testDir)
    .filter(f => f.startsWith(`epic-${epicNum}-`) && (f.endsWith('.test.tsx') || f.endsWith('.test.ts')));

  if (testFiles.length === 0) {
    result.status = 'invalid';
    result.missing.push(`test files matching epic-${epicNum}-*.test.tsx`);
    return result;
  }

  result.found.push(`${testFiles.length} test file(s) for epic-${epicNum}`);

  // Validate test files have actual test content
  for (const testFile of testFiles) {
    const fullPath = path.join(testDir, testFile);
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');

      if (!content.includes('describe(') && !content.includes('it(') && !content.includes('test(')) {
        result.warnings.push(`${testFile} has no test blocks`);
      }

      if (content.includes('.skip(') || content.includes('.todo(')) {
        result.warnings.push(`${testFile} contains skipped or todo tests`);
      }
    } catch {
      result.warnings.push(`Could not read ${testFile}`);
    }
  }

  return result;
}

function validateImplement(epicNum) {
  const result = {
    status: 'valid',
    phase: 'IMPLEMENT',
    epic: epicNum,
    expected: ['implementation files referenced by tests'],
    found: [],
    missing: [],
    warnings: []
  };

  if (!epicNum) {
    result.status = 'invalid';
    result.missing.push('Epic number required for IMPLEMENT validation');
    return result;
  }

  // Find test files for this epic
  const testDir = 'web/src/__tests__/integration';

  if (!fs.existsSync(testDir)) {
    result.warnings.push('No integration test directory found');
    return result;
  }

  const testFiles = fs.readdirSync(testDir)
    .filter(f => f.startsWith(`epic-${epicNum}-`) && (f.endsWith('.test.tsx') || f.endsWith('.test.ts')))
    .map(f => path.join(testDir, f));

  if (testFiles.length === 0) {
    result.warnings.push(`No test files found for epic-${epicNum}`);
    return result;
  }

  // Extract imports from test files and verify they exist
  const allImports = new Set();
  for (const testFile of testFiles) {
    const imports = extractImportsFromTestFile(testFile);
    imports.forEach(i => allImports.add(i));
  }

  let foundCount = 0;
  let missingCount = 0;

  for (const importPath of allImports) {
    // Skip test utilities and mocks
    if (importPath.includes('__tests__') || importPath.includes('mock') || importPath.includes('test-utils')) {
      continue;
    }

    const resolved = resolveAliasPath(importPath);
    if (resolved) {
      foundCount++;
      result.found.push(importPath);
    } else {
      missingCount++;
      result.missing.push(`${importPath} (referenced in tests but not found)`);
    }
  }

  if (missingCount > 0 && foundCount === 0) {
    result.status = 'invalid';
  } else if (missingCount > 0) {
    result.status = 'partial';
  }

  return result;
}

function validateReview(epicNum) {
  const result = {
    status: 'valid',
    phase: 'REVIEW',
    epic: epicNum,
    expected: ['review findings or marker'],
    found: [],
    missing: [],
    warnings: []
  };

  // Check for review findings JSON
  const findingsPath = '.claude/context/review-findings.json';
  if (fs.existsSync(findingsPath)) {
    try {
      const content = fs.readFileSync(findingsPath, 'utf-8');
      const findings = JSON.parse(content);
      if (findings.recommendation) {
        result.found.push('review-findings.json with recommendation');
        return result;
      }
    } catch {
      result.warnings.push('review-findings.json exists but is invalid');
    }
  }

  // Check for epic-specific review marker
  if (epicNum) {
    const reviewMarker = `generated-docs/reviews/epic-${epicNum}-review.md`;
    if (fs.existsSync(reviewMarker)) {
      result.found.push(`epic-${epicNum}-review.md`);
      return result;
    }
  }

  // Check workflow state for review status
  const statePath = '.claude/context/workflow-state.json';
  if (fs.existsSync(statePath)) {
    try {
      const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      if (state.epics && epicNum && state.epics[epicNum]) {
        const epicState = state.epics[epicNum];
        if (['VERIFY', 'COMPLETE'].includes(epicState.phase)) {
          result.found.push('workflow state indicates review completed');
          return result;
        }
      }
    } catch {
      // Invalid state file
    }
  }

  result.status = 'invalid';
  result.missing.push('No review completion indicator found');
  return result;
}

function validateVerify(epicNum) {
  const result = {
    status: 'valid',
    phase: 'VERIFY',
    epic: epicNum,
    expected: ['quality-gate-status.json'],
    found: [],
    missing: [],
    warnings: []
  };

  const statusPath = '.claude/context/quality-gate-status.json';

  if (!fs.existsSync(statusPath)) {
    result.status = 'invalid';
    result.missing.push('.claude/context/quality-gate-status.json');
    return result;
  }

  try {
    const content = fs.readFileSync(statusPath, 'utf-8');
    const status = JSON.parse(content);

    if (!status.overallStatus) {
      result.warnings.push('quality-gate-status.json missing overallStatus');
    } else if (status.overallStatus === 'pass') {
      result.found.push('quality-gate-status.json with passing status');
    } else {
      result.warnings.push(`quality-gate-status.json shows ${status.overallStatus} status`);
    }

    // Check that gates are present
    if (!status.gates) {
      result.warnings.push('quality-gate-status.json missing gates object');
    } else {
      const gateCount = Object.keys(status.gates).length;
      result.found.push(`${gateCount} quality gates recorded`);
    }
  } catch (e) {
    result.status = 'invalid';
    result.missing.push('quality-gate-status.json is invalid JSON');
  }

  return result;
}

// =============================================================================
// MAIN
// =============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node .claude/scripts/validate-phase-output.js --phase <PHASE> [--epic <N>]

Phases: DESIGN, PLAN, SPECIFY, IMPLEMENT, REVIEW, VERIFY

Options:
  --phase <PHASE>  Phase to validate (required)
  --epic <N>       Epic number (required for SPECIFY, IMPLEMENT, REVIEW, VERIFY)

Exit codes:
  0 - All expected artifacts found
  1 - Some non-critical artifacts missing (warnings)
  2 - Critical artifacts missing (phase not complete)
`);
    process.exit(0);
  }

  let phase = null;
  let epicNum = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--phase' && args[i + 1]) {
      phase = args[i + 1].toUpperCase();
      i++;
    } else if (args[i] === '--epic' && args[i + 1]) {
      epicNum = parseInt(args[i + 1]);
      i++;
    }
  }

  if (!phase) {
    console.log(JSON.stringify({
      status: 'error',
      message: 'Missing required --phase argument'
    }, null, 2));
    process.exit(2);
  }

  const validators = {
    'DESIGN': () => validateDesign(),
    'PLAN': () => validatePlan(epicNum),
    'SPECIFY': () => validateSpecify(epicNum),
    'IMPLEMENT': () => validateImplement(epicNum),
    'REVIEW': () => validateReview(epicNum),
    'VERIFY': () => validateVerify(epicNum)
  };

  if (!validators[phase]) {
    console.log(JSON.stringify({
      status: 'error',
      message: `Unknown phase: ${phase}. Valid phases: ${Object.keys(validators).join(', ')}`
    }, null, 2));
    process.exit(2);
  }

  const result = validators[phase]();

  // Add summary message
  if (result.status === 'valid') {
    result.message = `All expected artifacts found for ${phase} phase`;
  } else if (result.status === 'partial') {
    result.message = `Some artifacts found for ${phase} phase, but some are missing`;
  } else {
    result.message = `${phase} phase validation failed - critical artifacts missing`;
  }

  console.log(JSON.stringify(result, null, 2));

  // Set exit code based on status
  if (result.status === 'invalid') {
    process.exit(2);
  } else if (result.status === 'partial' || result.warnings.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
