/**
 * Calculator class handles all calculation logic for the three outputs
 */
class Calculator {
    /**
     * Convert a letter to a number using the specified algorithm
     * A=1, B=2, ..., I=9, J=1, K=2, ..., R=9, S=1, ..., Z=8
     * @param {string} letter - Single letter to convert
     * @returns {number} - Number between 1-9
     */
    letterToNumber(letter) {
        if (!letter || typeof letter !== 'string') {
            return 0;
        }

        const upperLetter = letter.toUpperCase();
        const code = upperLetter.charCodeAt(0);

        // Check if it's a valid letter (A-Z)
        if (code < 65 || code > 90) {
            return 0;
        }

        // Convert A=0, B=1, etc., then map to 1-9 cyclically
        const letterIndex = code - 65; // A=0, B=1, ..., Z=25
        return (letterIndex % 9) + 1; // Maps to 1-9
    }

    /**
     * Calculate Output 1: Sum of birth year digits, then reduce to single digit (1-9)
     * @param {string} birthDate - Birth date in YYYY-MM-DD format
     * @returns {number} - Single digit between 1-9
     */
    calculateOutput1(birthDate) {
        if (!birthDate) {
            throw new Error('Birth date is required for Output 1');
        }

        const date = new Date(birthDate);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid birth date format');
        }

        const year = date.getFullYear();
        const yearString = year.toString();

        let sum = 0;
        for (let digit of yearString) {
            sum += parseInt(digit, 10);
        }

        // Reduce to single digit between 1-9
        return this.reduceToSingleDigit(sum);
    }

    /**
     * Calculate Output 2: Count occurrences of each number 1-9 from converted letters
     * @param {string} firstName - First name
     * @param {object} lastNames - Object with lastName1, lastName2, lastName3
     * @returns {Array} - Array of objects with number and count
     */
    calculateOutput2(firstName, lastNames = {}) {
        const allLetters = this.getAllNameLetters(firstName, lastNames);

        // Initialize occurrence count for numbers 1-9
        const occurrences = {};
        for (let i = 1; i <= 9; i++) {
            occurrences[i] = 0;
        }

        // Count occurrences of each converted number
        for (let letter of allLetters) {
            const number = this.letterToNumber(letter);
            if (number >= 1 && number <= 9) {
                occurrences[number]++;
            }
        }

        // Convert to array format for display
        const result = [];
        for (let i = 1; i <= 9; i++) {
            result.push({
                number: i,
                count: occurrences[i],
                display: occurrences[i] === 0 ? 'ô' : occurrences[i].toString()
            });
        }

        return result;
    }

    /**
     * Calculate Output 3: Sum all converted numbers and reduce to single digit (1-9)
     * @param {string} firstName - First name
     * @param {object} lastNames - Object with lastName1, lastName2, lastName3
     * @returns {number} - Single digit between 1-9
     */
    calculateOutput3(firstName, lastNames = {}) {
        const allLetters = this.getAllNameLetters(firstName, lastNames);

        // Sum all converted numbers
        let sum = 0;
        for (let letter of allLetters) {
            const number = this.letterToNumber(letter);
            sum += number;
        }

        // Reduce to single digit between 1-9
        return this.reduceToSingleDigit(sum);
    }

    /**
     * Reduce a number to a single digit between 1-9 by repeatedly summing digits
     * @param {number} number - Number to reduce
     * @returns {number} - Single digit between 1-9
     */
    reduceToSingleDigit(number) {
        if (number <= 0) {
            return 1; // Default to 1 for edge cases
        }

        while (number > 9) {
            let sum = 0;
            const numberString = number.toString();

            for (let digit of numberString) {
                sum += parseInt(digit, 10);
            }

            number = sum;
        }

        // Ensure result is between 1-9 (handle case where sum is 0)
        return number === 0 ? 9 : number;
    }

    /**
     * Get all name letters from first name and last names
     * @param {string} firstName - First name
     * @param {object} lastNames - Object with lastName1, lastName2, lastName3
     * @returns {string} - All letters concatenated
     */
    getAllNameLetters(firstName, lastNames = {}) {
        let allLetters = '';

        if (firstName) {
            allLetters += firstName.replace(/\s/g, ''); // Remove spaces
        }

        if (lastNames.lastName1) {
            allLetters += lastNames.lastName1.replace(/\s/g, '');
        }

        if (lastNames.lastName2) {
            allLetters += lastNames.lastName2.replace(/\s/g, '');
        }

        if (lastNames.lastName3) {
            allLetters += lastNames.lastName3.replace(/\s/g, '');
        }

        return allLetters.toUpperCase();
    }
}

// Unit tests for Calculator class
function runCalculatorTests() {
    const calculator = new Calculator();
    let testsPassed = 0;
    let totalTests = 0;

    function test(description, testFunction) {
        totalTests++;
        try {
            testFunction();
            console.log(`✓ ${description}`);
            testsPassed++;
        } catch (error) {
            console.error(`✗ ${description}: ${error.message}`);
        }
    }

    // Test letter to number conversion
    test('letterToNumber converts A to 1', () => {
        const result = calculator.letterToNumber('A');
        if (result !== 1) throw new Error(`Expected 1, got ${result}`);
    });

    test('letterToNumber converts I to 9', () => {
        const result = calculator.letterToNumber('I');
        if (result !== 9) throw new Error(`Expected 9, got ${result}`);
    });

    test('letterToNumber converts J to 1 (cycles back)', () => {
        const result = calculator.letterToNumber('J');
        if (result !== 1) throw new Error(`Expected 1, got ${result}`);
    });

    test('letterToNumber converts Z to 8', () => {
        const result = calculator.letterToNumber('Z');
        if (result !== 8) throw new Error(`Expected 8, got ${result}`);
    });

    test('letterToNumber handles lowercase letters', () => {
        const result = calculator.letterToNumber('a');
        if (result !== 1) throw new Error(`Expected 1, got ${result}`);
    });

    test('letterToNumber returns 0 for non-letters', () => {
        const result = calculator.letterToNumber('1');
        if (result !== 0) throw new Error(`Expected 0, got ${result}`);
    });

    // Test Output 1 calculation
    test('calculateOutput1 sums year digits and reduces to single digit', () => {
        const result = calculator.calculateOutput1('1995-06-15');
        // 1995: 1+9+9+5 = 24, then 2+4 = 6
        const expected = 6;
        if (result !== expected) throw new Error(`Expected ${expected}, got ${result}`);
    });

    test('calculateOutput1 handles different years with reduction', () => {
        const result = calculator.calculateOutput1('2000-01-01');
        // 2000: 2+0+0+0 = 2 (already single digit)
        const expected = 2;
        if (result !== expected) throw new Error(`Expected ${expected}, got ${result}`);
    });

    test('calculateOutput1 handles multi-level digit reduction', () => {
        const result = calculator.calculateOutput1('1999-12-31');
        // 1999: 1+9+9+9 = 28, then 2+8 = 10, then 1+0 = 1
        const expected = 1;
        if (result !== expected) throw new Error(`Expected ${expected}, got ${result}`);
    });

    test('calculateOutput1 throws error for invalid date', () => {
        try {
            calculator.calculateOutput1('invalid-date');
            throw new Error('Should have thrown error for invalid date');
        } catch (error) {
            if (!error.message.includes('Invalid birth date')) {
                throw new Error('Wrong error message');
            }
        }
    });

    // Test Output 2 calculation
    test('calculateOutput2 counts occurrences correctly', () => {
        const result = calculator.calculateOutput2('JOHN', { lastName1: 'SMITH' });
        // J=1, O=6, H=8, N=5, S=1, M=4, I=9, T=2
        // Expected: 1:2, 2:1, 3:0, 4:1, 5:1, 6:1, 7:0, 8:1, 9:1
        const expected = [
            { number: 1, count: 2, display: '2' }, // J, S
            { number: 2, count: 1, display: '1' }, // T
            { number: 3, count: 0, display: 'ô' },
            { number: 4, count: 1, display: '1' }, // M
            { number: 5, count: 1, display: '1' }, // N
            { number: 6, count: 1, display: '1' }, // O
            { number: 7, count: 0, display: 'ô' },
            { number: 8, count: 1, display: '1' }, // H
            { number: 9, count: 1, display: '1' }  // I
        ];

        for (let i = 0; i < expected.length; i++) {
            if (result[i].count !== expected[i].count || result[i].display !== expected[i].display) {
                throw new Error(`Number ${i + 1}: expected count ${expected[i].count}, display '${expected[i].display}', got count ${result[i].count}, display '${result[i].display}'`);
            }
        }
    });

    test('calculateOutput2 shows ô for zero occurrences', () => {
        const result = calculator.calculateOutput2('A', {}); // Only A=1
        if (result[2].display !== 'ô') { // Number 3 should show ô
            throw new Error(`Expected 'ô' for zero occurrences, got '${result[2].display}'`);
        }
    });

    test('calculateOutput2 handles empty names', () => {
        const result = calculator.calculateOutput2('', {});
        // All should be ô
        for (let i = 0; i < 9; i++) {
            if (result[i].display !== 'ô') {
                throw new Error(`Expected all 'ô' for empty names, got '${result[i].display}' at position ${i}`);
            }
        }
    });

    // Test Output 3 calculation
    test('calculateOutput3 sums and reduces correctly', () => {
        const result = calculator.calculateOutput3('JOHN', { lastName1: 'SMITH' });
        // J=1, O=6, H=8, N=5, S=1, M=4, I=9, T=2
        // Sum: 1+6+8+5+1+4+9+2 = 36
        // Reduce: 3+6 = 9
        if (result !== 9) throw new Error(`Expected 9, got ${result}`);
    });

    test('calculateOutput3 handles multi-level reduction', () => {
        // Create a name that sums to a large number requiring multiple reductions
        const result = calculator.calculateOutput3('ZZZZ', {}); // Z=8, so 8+8+8+8=32, then 3+2=5
        if (result !== 5) throw new Error(`Expected 5, got ${result}`);
    });

    test('calculateOutput3 handles single digit result', () => {
        const result = calculator.calculateOutput3('A', {}); // A=1, already single digit
        if (result !== 1) throw new Error(`Expected 1, got ${result}`);
    });

    test('calculateOutput3 handles empty names', () => {
        const result = calculator.calculateOutput3('', {});
        if (result !== 1) throw new Error(`Expected 1 for empty names, got ${result}`);
    });

    // Test reduceToSingleDigit
    test('reduceToSingleDigit reduces 23 to 5', () => {
        const result = calculator.reduceToSingleDigit(23);
        if (result !== 5) throw new Error(`Expected 5, got ${result}`);
    });

    test('reduceToSingleDigit reduces 99 to 9', () => {
        const result = calculator.reduceToSingleDigit(99);
        // 99 -> 9+9=18 -> 1+8=9
        if (result !== 9) throw new Error(`Expected 9, got ${result}`);
    });

    test('reduceToSingleDigit handles single digits', () => {
        const result = calculator.reduceToSingleDigit(7);
        if (result !== 7) throw new Error(`Expected 7, got ${result}`);
    });

    test('reduceToSingleDigit handles zero and negative', () => {
        const result1 = calculator.reduceToSingleDigit(0);
        const result2 = calculator.reduceToSingleDigit(-5);
        if (result1 !== 9) throw new Error(`Expected 9 for zero, got ${result1}`);
        if (result2 !== 1) throw new Error(`Expected 1 for negative, got ${result2}`);
    });

    // Test getAllNameLetters
    test('getAllNameLetters combines all names', () => {
        const result = calculator.getAllNameLetters('John', {
            lastName1: 'Smith',
            lastName2: 'Doe'
        });
        if (result !== 'JOHNSMITHDOE') {
            throw new Error(`Expected 'JOHNSMITHDOE', got '${result}'`);
        }
    });

    test('getAllNameLetters removes spaces', () => {
        const result = calculator.getAllNameLetters('John Paul', {
            lastName1: 'Van Der Berg'
        });
        if (result !== 'JOHNPAULVANDERBERG') {
            throw new Error(`Expected 'JOHNPAULVANDERBERG', got '${result}'`);
        }
    });

    test('getAllNameLetters handles missing last names', () => {
        const result = calculator.getAllNameLetters('John', {});
        if (result !== 'JOHN') {
            throw new Error(`Expected 'JOHN', got '${result}'`);
        }
    });

    console.log(`\nCalculator Tests: ${testsPassed}/${totalTests} passed`);
    return testsPassed === totalTests;
}

// Run tests if in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Uncomment the line below to run tests
    // runCalculatorTests();
}