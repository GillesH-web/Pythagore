/**
 * Preservation Property Tests - Inclusion Grid Labels
 * 
 * These tests capture the EXISTING baseline behavior of formatOutput2Table()
 * on UNFIXED code. They verify that the current rendering preserves:
 * - Numbers 1-9 appear in the output with CSS classes number-1 through number-9
 * - Occurrence values are displayed correctly (count value or "ô" for zero)
 * - The section title "Grille d'inclusion" is present in createOutput2Section()
 * 
 * EXPECTED: These tests PASS on unfixed code (confirms baseline behavior to preserve).
 * 
 * Validates: Requirements 3.1, 3.2, 3.3
 */

const fs = require('fs');
const path = require('path');

// Load and evaluate ResultsDisplay class in Node.js context
const source = fs.readFileSync(path.join(__dirname, 'js', 'results-display.js'), 'utf-8');
const wrappedSource = source + '\nmodule.exports = { ResultsDisplay };';
const m = { exports: {} };
const fn = new Function('module', 'exports', 'require', 'document', 'window', wrappedSource);
fn(m, m.exports, require, {}, {});
const { ResultsDisplay } = m.exports;

const display = new ResultsDisplay();

// ---- Test infrastructure ----
let passed = 0;
let failed = 0;
const failures = [];

function assert(description, condition) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${description}`);
  } else {
    failed++;
    failures.push(description);
    console.log(`  ❌ ${description}`);
  }
}

// ---- Property-based test helper: generate random occurrence data ----
function generateRandomOccurrenceData() {
  const data = [];
  for (let i = 1; i <= 9; i++) {
    const count = Math.floor(Math.random() * 10); // 0-9
    data.push({
      number: i,
      count: count,
      display: count === 0 ? 'ô' : count.toString()
    });
  }
  return data;
}

// ========================================
// TEST SUITE - Preservation Properties
// ========================================
console.log('\n🧪 Preservation Property Tests - Inclusion Grid Labels\n');

// ---- Test data sets ----
const designExampleData = [
  { number: 1, count: 3, display: '3' },
  { number: 2, count: 1, display: '1' },
  { number: 3, count: 2, display: '2' },
  { number: 4, count: 4, display: '4' },
  { number: 5, count: 0, display: 'ô' },
  { number: 6, count: 1, display: '1' },
  { number: 7, count: 2, display: '2' },
  { number: 8, count: 3, display: '3' },
  { number: 9, count: 1, display: '1' },
];

const allZeroData = [];
for (let i = 1; i <= 9; i++) {
  allZeroData.push({ number: i, count: 0, display: 'ô' });
}

const allMaxData = [];
for (let i = 1; i <= 9; i++) {
  allMaxData.push({ number: i, count: 9, display: '9' });
}

// ---- Property 3.1: Numbers 1-9 with CSS color classes ----
// **Validates: Requirements 3.1**
console.log('Property 3.1: Numbers 1-9 appear with CSS classes number-1 through number-9\n');

function testNumbersWithCSSClasses(label, occurrenceData) {
  const html = display.formatOutput2Table(occurrenceData);
  for (let i = 1; i <= 9; i++) {
    assert(
      `[${label}] Number ${i} has CSS class "number-${i}" in output`,
      html.includes(`class="number-${i}"`)
    );
    assert(
      `[${label}] Number ${i} value appears in a cell with its class`,
      html.includes(`class="number-${i}">${i}<`)
    );
  }
}

testNumbersWithCSSClasses('Design example', designExampleData);
testNumbersWithCSSClasses('All zeros', allZeroData);
testNumbersWithCSSClasses('All max', allMaxData);

// Property-based: run with 10 random data sets
console.log('\n  Property-based: 10 random occurrence data sets');
for (let trial = 0; trial < 10; trial++) {
  const randomData = generateRandomOccurrenceData();
  const html = display.formatOutput2Table(randomData);
  let allPresent = true;
  for (let i = 1; i <= 9; i++) {
    if (!html.includes(`class="number-${i}">${i}<`)) {
      allPresent = false;
      break;
    }
  }
  assert(
    `[Random trial ${trial + 1}] All 9 numbers with CSS classes present`,
    allPresent
  );
}

// ---- Property 3.2: Occurrence values displayed correctly ----
// **Validates: Requirements 3.2**
console.log('\nProperty 3.2: Occurrence values displayed correctly (count or "ô" for zero)\n');

function testOccurrenceValues(label, occurrenceData) {
  const html = display.formatOutput2Table(occurrenceData);
  occurrenceData.forEach(item => {
    if (item.count === 0) {
      assert(
        `[${label}] Number ${item.number} with zero count shows "ô" (zero-count span)`,
        html.includes('<span class="zero-count">ô</span>')
      );
    } else {
      assert(
        `[${label}] Number ${item.number} occurrence count ${item.count} appears in output`,
        html.includes(`<td>${item.count}</td>`) || html.includes(`<td>${item.display}</td>`)
      );
    }
  });
}

testOccurrenceValues('Design example', designExampleData);
testOccurrenceValues('All zeros', allZeroData);
testOccurrenceValues('All max', allMaxData);

// Property-based: run with 10 random data sets
console.log('\n  Property-based: 10 random occurrence data sets');
for (let trial = 0; trial < 10; trial++) {
  const randomData = generateRandomOccurrenceData();
  const html = display.formatOutput2Table(randomData);
  let allCorrect = true;
  for (const item of randomData) {
    if (item.count === 0) {
      if (!html.includes('<span class="zero-count">ô</span>')) {
        allCorrect = false;
        break;
      }
    } else {
      if (!html.includes(`<td>${item.count}</td>`)) {
        allCorrect = false;
        break;
      }
    }
  }
  assert(
    `[Random trial ${trial + 1}] All occurrence values correctly displayed`,
    allCorrect
  );
}

// ---- Property 3.3: Section title "Grille d'inclusion" present ----
// **Validates: Requirements 3.3**
console.log('\nProperty 3.3: Section title "Grille d\'inclusion" is present in createOutput2Section()\n');

// Since createOutput2Section() uses document.createElement (DOM API not available in Node.js),
// we verify the title is hardcoded in the source code of the method.
const resultsDisplaySource = fs.readFileSync(
  path.join(__dirname, 'js', 'results-display.js'), 'utf-8'
);
assert(
  'Source code of createOutput2Section contains "Grille d\'inclusion" title',
  resultsDisplaySource.includes("Grille d'inclusion")
);

// Verify the title appears within the createOutput2Section method body
// Find the method definition (not a call site) by looking for the method signature
const methodDefPattern = 'createOutput2Section(output2Data)';
const methodDefStart = resultsDisplaySource.indexOf(methodDefPattern);
// Find the next method definition to bound the search
const nextMethodDef = resultsDisplaySource.indexOf('formatOutput2Table(occurrenceData)');
if (methodDefStart !== -1 && nextMethodDef !== -1) {
  const methodSource = resultsDisplaySource.substring(methodDefStart, nextMethodDef);
  assert(
    'createOutput2Section method body contains "Grille d\'inclusion"',
    methodSource.includes("Grille d'inclusion")
  );
}

// ========================================
// RESULTS SUMMARY
// ========================================
console.log('\n' + '='.repeat(60));
console.log(`📋 RESULTS: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
if (failures.length > 0) {
  console.log('\n❌ FAILURES:');
  failures.forEach(f => console.log(`  - ${f}`));
}
console.log('='.repeat(60));

if (failed > 0) {
  console.log('\n⚠️  PRESERVATION TESTS FAILED: Baseline behavior may have changed unexpectedly.');
  process.exit(1);
} else {
  console.log('\n✅ All preservation tests passed. Baseline behavior captured successfully.');
  console.log('   These tests should continue to pass after the fix is applied.');
  process.exit(0);
}
