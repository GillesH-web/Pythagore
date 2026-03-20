/**
 * Bug Condition Exploration Test - Inclusion Grid Labels
 * 
 * This test verifies that formatOutput2Table() produces a table with:
 * - Row label "INCLUSION" (line 1 - numbers 1-9)
 * - Row label "BASE" (line 2 - occurrences)
 * - Row label "INDUITS" (line 3 - chained values)
 * 
 * EXPECTED: This test FAILS on unfixed code, confirming the bug exists.
 * 
 * Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
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


// ---- Test data matching design document examples ----
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

// Expected INDUITS per design chaining algorithm:
// Col 1: start->BASE[1]=3->col3->BASE[3]=2->col2->BASE[2]=1->col1(visited)->stop = "3-2-1"
// Col 2: start->BASE[2]=1->col1->BASE[1]=3->col3->BASE[3]=2->col2(visited)->stop = "1-3-2"
// Col 3: start->BASE[3]=2->col2->BASE[2]=1->col1->BASE[1]=3->col3(visited)->stop = "2-1-3"
// Col 4: start->BASE[4]=4->col4(visited)->stop = "4"
// Col 5: BASE=0 -> "/"
// Col 6: start->BASE[6]=1->col1->BASE[1]=3->col3->BASE[3]=2->col2->BASE[2]=1->col1(visited)->stop = "1-3-2-1"
// Col 7: start->BASE[7]=2->col2->BASE[2]=1->col1->BASE[1]=3->col3->BASE[3]=2->col2(visited)->stop = "2-1-3-2"
// Col 8: start->BASE[8]=3->col3->BASE[3]=2->col2->BASE[2]=1->col1->BASE[1]=3->col3(visited)->stop = "3-2-1-3"
// Col 9: start->BASE[9]=1->col1->BASE[1]=3->col3->BASE[3]=2->col2->BASE[2]=1->col1(visited)->stop = "1-3-2-1"
const expectedInduits = [
  '3-2-1', '1-3-2', '2-1-3', '4', '/',
  '1-3-2-1', '2-1-3-2', '3-2-1-3', '1-3-2-1'
];

// ========================================
// TEST SUITE
// ========================================
console.log('\n🧪 Bug Condition Exploration Test - Inclusion Grid Labels\n');

const html = display.formatOutput2Table(designExampleData);

// ---- Test 1: INCLUSION label present ----
console.log('Test 1: Row label "INCLUSION" present in table HTML');
assert('HTML contains "INCLUSION" label', html.includes('INCLUSION'));

// ---- Test 2: BASE label present ----
console.log('\nTest 2: Row label "BASE" present in table HTML');
assert('HTML contains "BASE" label', html.includes('>BASE<'));

// ---- Test 3: INDUITS label present ----
console.log('\nTest 3: Row label "INDUITS" present in table HTML');
assert('HTML contains "INDUITS" label', html.includes('INDUITS'));

// ---- Test 4: Chaining algorithm correctness ----
console.log('\nTest 4: Chaining algorithm correctness');
expectedInduits.forEach((expected, idx) => {
  const colNum = idx + 1;
  assert(
    `INDUITS[${colNum}] = "${expected}" present in HTML`,
    html.includes(`>${expected}<`)
  );
});

// ---- Test 5: Zero-occurrence handling (BASE=0 -> INDUITS="/") ----
console.log('\nTest 5: Zero-occurrence -> INDUITS = "/"');
assert('Column 5 (BASE=0) has INDUITS="/" in HTML', html.includes('>/<'));

// ---- Test 6: Cycle detection - self-reference ----
console.log('\nTest 6: Cycle detection - self-reference BASE[4]=4 -> INDUITS="4"');
assert(
  'Self-reference col 4 produces standalone INDUITS="4"',
  html.includes('INDUITS') && html.includes('>4<')
);

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

// Document the current (buggy) output as counterexample evidence
console.log('\n📝 COUNTEREXAMPLE - Current formatOutput2Table() output:');
console.log('--- HTML output ---');
console.log(html);
console.log('--- END ---\n');

if (failed > 0) {
  console.log('⚠️  TEST FAILURES EXPECTED: This confirms the bug exists.');
  console.log('   The current code does not produce INCLUSION/BASE/INDUITS labels.');
  process.exit(1);
} else {
  console.log('✅ All tests passed (bug may already be fixed).');
  process.exit(0);
}
