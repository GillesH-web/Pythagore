/**
 * Test Suite for Pythagore Numerology Application
 * Comprehensive testing of all calculations and functionality
 */

class TestSuite {
    constructor() {
        this.calculator = new Calculator();
        this.validator = new Validator();
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
    }

    /**
     * Run all tests
     */
    runAllTests() {
        console.log('🧪 Starting Pythagore Numerology Test Suite...');
        
        this.testCalculatorMethods();
        this.testValidatorMethods();
        this.testIntegrationScenarios();
        
        this.displayTestResults();
    }

    /**
     * Test all calculator methods
     */
    testCalculatorMethods() {
        console.log('📊 Testing Calculator Methods...');

        // Test letterToNumber conversion
        this.test('letterToNumber A=1', () => this.calculator.letterToNumber('A') === 1);
        this.test('letterToNumber I=9', () => this.calculator.letterToNumber('I') === 9);
        this.test('letterToNumber J=1', () => this.calculator.letterToNumber('J') === 1);
        this.test('letterToNumber Z=8', () => this.calculator.letterToNumber('Z') === 8);
        this.test('letterToNumber lowercase', () => this.calculator.letterToNumber('a') === 1);
        this.test('letterToNumber invalid', () => this.calculator.letterToNumber('1') === 0);

        // Test reduceToSingleDigit
        this.test('reduceToSingleDigit 11->2', () => this.calculator.reduceToSingleDigit(11) === 2);
        this.test('reduceToSingleDigit 29->2', () => this.calculator.reduceToSingleDigit(29) === 2);
        this.test('reduceToSingleDigit 5->5', () => this.calculator.reduceToSingleDigit(5) === 5);
        this.test('reduceToSingleDigit 0->9', () => this.calculator.reduceToSingleDigit(0) === 9);

        // Test Output 1 (Life Path)
        this.test('Output1 15/03/1985->5', () => this.calculator.calculateOutput1('1985-03-15') === 5);
        this.test('Output1 01/01/2000->4', () => this.calculator.calculateOutput1('2000-01-01') === 4);
        this.test('Output1 31/12/1999->8', () => this.calculator.calculateOutput1('1999-12-31') === 8);

        // Test Output 2 (Inclusion Grid)
        const testNames = { firstName1: 'JEAN', firstName2: '', firstName3: '' };
        const output2Result = this.calculator.calculateOutput2(testNames, 'MARTIN');
        this.test('Output2 structure', () => Array.isArray(output2Result) && output2Result.length === 9);
        this.test('Output2 number 1 exists', () => output2Result.find(item => item.number === 1) !== undefined);

        // Test Output 3 (Expression Number)
        this.test('Output3 JEAN MARTIN', () => {
            const result = this.calculator.calculateOutput3({ firstName1: 'JEAN' }, 'MARTIN');
            return typeof result === 'number' && result >= 1 && result <= 9;
        });

        // Test Cycles calculation
        const cycles = this.calculator.calculateCycles('1985-03-15', 5);
        this.test('Cycles structure', () => cycles.cycle1 && cycles.cycle2 && cycles.cycle3);
        this.test('Cycle1 has ageRange', () => typeof cycles.cycle1.ageRange === 'string');
        this.test('Cycle1 value is month', () => cycles.cycle1.value === 3);
        this.test('Cycle2 value is day', () => cycles.cycle2.value === 15);
        this.test('Cycle3 value is year', () => cycles.cycle3.value === 1985);
    }

    /**
     * Test all validator methods
     */
    testValidatorMethods() {
        console.log('✅ Testing Validator Methods...');

        // Test name validation
        this.test('Valid name', () => this.validator.validateName('Jean-Pierre').isValid === true);
        this.test('Valid name with apostrophe', () => this.validator.validateName("O'Connor").isValid === true);
        this.test('Valid name with accents', () => this.validator.validateName('François').isValid === true);
        this.test('Invalid name with numbers', () => this.validator.validateName('Jean123').isValid === false);
        this.test('Invalid name with symbols', () => this.validator.validateName('Jean@').isValid === false);
        this.test('Empty name is valid', () => this.validator.validateName('').isValid === true);

        // Test date validation
        this.test('Valid past date', () => this.validator.validateDate('1985-03-15').isValid === true);
        this.test('Invalid future date', () => this.validator.validateDate('2030-01-01').isValid === false);
        this.test('Invalid date format', () => this.validator.validateDate('invalid').isValid === false);
        this.test('Empty date invalid', () => this.validator.validateDate('').isValid === false);

        // Test complete form validation
        const validForm = {
            firstName1: 'Jean',
            firstName2: 'Pierre',
            firstName3: '',
            lastName: 'Martin',
            birthDate: '1985-03-15'
        };
        this.test('Valid complete form', () => this.validator.validateAll(validForm).isValid === true);

        const invalidForm = {
            firstName1: '',
            firstName2: '',
            firstName3: '',
            lastName: 'Martin',
            birthDate: '1985-03-15'
        };
        this.test('Invalid form missing firstName1', () => this.validator.validateAll(invalidForm).isValid === false);
    }

    /**
     * Test integration scenarios with real-world examples
     */
    testIntegrationScenarios() {
        console.log('🔄 Testing Integration Scenarios...');

        // Test Case 1: Jean-Pierre Martin, 15/03/1985
        const testCase1 = {
            firstName1: 'Jean-Pierre',
            firstName2: '',
            firstName3: '',
            lastName: 'Martin',
            birthDate: '1985-03-15'
        };

        const output1_case1 = this.calculator.calculateOutput1(testCase1.birthDate);
        const output2_case1 = this.calculator.calculateOutput2(testCase1, testCase1.lastName);
        const output3_case1 = this.calculator.calculateOutput3(testCase1, testCase1.lastName);
        const cycles_case1 = this.calculator.calculateCycles(testCase1.birthDate, output1_case1);

        this.test('Case1 Output1 valid range', () => output1_case1 >= 1 && output1_case1 <= 9);
        this.test('Case1 Output2 array length', () => output2_case1.length === 9);
        this.test('Case1 Output3 valid range', () => output3_case1 >= 1 && output3_case1 <= 9);
        this.test('Case1 Cycles complete', () => cycles_case1.cycle1 && cycles_case1.cycle2 && cycles_case1.cycle3);

        // Test Case 2: Marie-Claire Dubois, 01/01/2000
        const testCase2 = {
            firstName1: 'Marie-Claire',
            firstName2: 'Françoise',
            firstName3: '',
            lastName: 'Dubois',
            birthDate: '2000-01-01'
        };

        const output1_case2 = this.calculator.calculateOutput1(testCase2.birthDate);
        const output2_case2 = this.calculator.calculateOutput2(testCase2, testCase2.lastName);
        const output3_case2 = this.calculator.calculateOutput3(testCase2, testCase2.lastName);
        const cycles_case2 = this.calculator.calculateCycles(testCase2.birthDate, output1_case2);

        this.test('Case2 Output1 calculation', () => output1_case2 === 4); // 01/01/2000 = 4
        this.test('Case2 Output2 structure', () => output2_case2.every(item => item.hasOwnProperty('number') && item.hasOwnProperty('count')));
        this.test('Case2 Output3 valid', () => output3_case2 >= 1 && output3_case2 <= 9);
        this.test('Case2 Cycle1 month', () => cycles_case2.cycle1.value === 1);
        this.test('Case2 Cycle2 day', () => cycles_case2.cycle2.value === 1);
        this.test('Case2 Cycle3 year', () => cycles_case2.cycle3.value === 2000);

        // Test Case 3: Edge cases
        const testCase3 = {
            firstName1: 'A',
            firstName2: '',
            firstName3: '',
            lastName: 'B',
            birthDate: '1999-12-31'
        };

        const output1_case3 = this.calculator.calculateOutput1(testCase3.birthDate);
        const output2_case3 = this.calculator.calculateOutput2(testCase3, testCase3.lastName);
        const output3_case3 = this.calculator.calculateOutput3(testCase3, testCase3.lastName);

        this.test('Case3 minimal names', () => output1_case3 >= 1 && output1_case3 <= 9);
        this.test('Case3 Output2 minimal', () => output2_case3.length === 9);
        this.test('Case3 Output3 minimal', () => output3_case3 >= 1 && output3_case3 <= 9);

        // Test specific calculation verification
        this.test('Specific: 15/03/1985 = 5', () => {
            // 1+5+0+3+1+9+8+5 = 32, 3+2 = 5
            return this.calculator.calculateOutput1('1985-03-15') === 5;
        });

        this.test('Specific: Letter A = 1', () => {
            return this.calculator.letterToNumber('A') === 1;
        });

        this.test('Specific: Letter Z = 8', () => {
            // Z is 26th letter, (26-1) % 9 + 1 = 25 % 9 + 1 = 7 + 1 = 8
            return this.calculator.letterToNumber('Z') === 8;
        });
    }

    /**
     * Individual test method
     */
    test(description, testFunction) {
        try {
            const result = testFunction();
            if (result) {
                this.testResults.push({ description, status: 'PASS', error: null });
                this.passedTests++;
                console.log(`✅ ${description}`);
            } else {
                this.testResults.push({ description, status: 'FAIL', error: 'Test returned false' });
                this.failedTests++;
                console.log(`❌ ${description} - Test returned false`);
            }
        } catch (error) {
            this.testResults.push({ description, status: 'ERROR', error: error.message });
            this.failedTests++;
            console.log(`💥 ${description} - Error: ${error.message}`);
        }
    }

    /**
     * Display final test results
     */
    displayTestResults() {
        console.log('\n📋 TEST RESULTS SUMMARY');
        console.log('========================');
        console.log(`Total Tests: ${this.testResults.length}`);
        console.log(`✅ Passed: ${this.passedTests}`);
        console.log(`❌ Failed: ${this.failedTests}`);
        console.log(`Success Rate: ${((this.passedTests / this.testResults.length) * 100).toFixed(1)}%`);

        if (this.failedTests > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults
                .filter(test => test.status !== 'PASS')
                .forEach(test => {
                    console.log(`- ${test.description}: ${test.error || 'Failed'}`);
                });
        }

        // Return results for potential HTML display
        return {
            total: this.testResults.length,
            passed: this.passedTests,
            failed: this.failedTests,
            successRate: ((this.passedTests / this.testResults.length) * 100).toFixed(1),
            details: this.testResults
        };
    }
}

// Auto-run tests when this file is loaded (for development)
if (typeof window !== 'undefined' && window.location.search.includes('test=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🧪 Auto-running tests (test=true parameter detected)');
        const testSuite = new TestSuite();
        testSuite.runAllTests();
    });
}