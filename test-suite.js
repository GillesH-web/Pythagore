/**
 * Comprehensive test suite for Personal Data Collector
 * Runs all unit tests and integration tests
 */
class TestSuite {
    constructor() {
        this.testResults = {
            unit: {},
            integration: {},
            ui: {},
            accessibility: {}
        };
    }
    
    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting comprehensive test suite...\n');
        
        try {
            // Run unit tests
            await this.runUnitTests();
            
            // Run integration tests
            await this.runIntegrationTests();
            
            // Run UI tests
            await this.runUITests();
            
            // Run accessibility tests
            await this.runAccessibilityTests();
            
            // Run final validation with design document test cases
            await this.runFinalValidation();
            
            // Generate final report
            this.generateTestReport();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }
    
    /**
     * Run unit tests for all components
     */
    async runUnitTests() {
        console.log('📋 Running unit tests...\n');
        
        // Run Validator tests
        this.testResults.unit.validator = runValidatorTests();
        
        // Run Calculator tests
        this.testResults.unit.calculator = runCalculatorTests();
        
        // Run FormHandler tests
        this.testResults.unit.formHandler = runFormHandlerTests();
        
        // Run ResultsDisplay tests
        this.testResults.unit.resultsDisplay = runResultsDisplayTests();
        
        // Test save and print functionality
        this.testResults.unit.saveAndPrint = testSaveAndPrintFunctionality();
        
        console.log('\n✅ Unit tests completed\n');
    }
    
    /**
     * Run integration tests
     */
    async runIntegrationTests() {
        console.log('🔗 Running integration tests...\n');
        
        let passed = 0;
        let total = 0;
        
        // Test complete form submission flow
        total++;
        try {
            await this.testCompleteFormFlow();
            console.log('✓ Complete form submission flow');
            passed++;
        } catch (error) {
            console.error('✗ Complete form submission flow:', error.message);
        }
        
        // Test calculation accuracy with known values
        total++;
        try {
            this.testCalculationAccuracy();
            console.log('✓ Calculation accuracy with test cases');
            passed++;
        } catch (error) {
            console.error('✗ Calculation accuracy:', error.message);
        }
        
        // Test error recovery
        total++;
        try {
            this.testErrorRecovery();
            console.log('✓ Error recovery mechanisms');
            passed++;
        } catch (error) {
            console.error('✗ Error recovery:', error.message);
        }
        
        // Test reset functionality
        total++;
        try {
            this.testResetFunctionality();
            console.log('✓ Reset functionality');
            passed++;
        } catch (error) {
            console.error('✗ Reset functionality:', error.message);
        }
        
        this.testResults.integration.passed = passed;
        this.testResults.integration.total = total;
        
        console.log(`\n✅ Integration tests completed: ${passed}/${total}\n`);
    }
    
    /**
     * Run UI tests
     */
    async runUITests() {
        console.log('🎨 Running UI tests...\n');
        
        let passed = 0;
        let total = 0;
        
        // Test responsive design
        total++;
        try {
            this.testResponsiveDesign();
            console.log('✓ Responsive design');
            passed++;
        } catch (error) {
            console.error('✗ Responsive design:', error.message);
        }
        
        // Test field separation
        total++;
        try {
            this.testFieldSeparation();
            console.log('✓ Field visual separation');
            passed++;
        } catch (error) {
            console.error('✗ Field separation:', error.message);
        }
        
        // Test validation feedback
        total++;
        try {
            this.testValidationFeedback();
            console.log('✓ Validation feedback display');
            passed++;
        } catch (error) {
            console.error('✗ Validation feedback:', error.message);
        }
        
        this.testResults.ui.passed = passed;
        this.testResults.ui.total = total;
        
        console.log(`\n✅ UI tests completed: ${passed}/${total}\n`);
    }
    
    /**
     * Run accessibility tests
     */
    async runAccessibilityTests() {
        console.log('♿ Running accessibility tests...\n');
        
        let passed = 0;
        let total = 0;
        
        // Test keyboard navigation
        total++;
        try {
            this.testKeyboardNavigation();
            console.log('✓ Keyboard navigation');
            passed++;
        } catch (error) {
            console.error('✗ Keyboard navigation:', error.message);
        }
        
        // Test ARIA labels
        total++;
        try {
            this.testAriaLabels();
            console.log('✓ ARIA labels and accessibility');
            passed++;
        } catch (error) {
            console.error('✗ ARIA labels:', error.message);
        }
        
        // Test color contrast (basic check)
        total++;
        try {
            this.testColorContrast();
            console.log('✓ Color contrast');
            passed++;
        } catch (error) {
            console.error('✗ Color contrast:', error.message);
        }
        
        this.testResults.accessibility.passed = passed;
        this.testResults.accessibility.total = total;
        
        console.log(`\n✅ Accessibility tests completed: ${passed}/${total}\n`);
    }
    
    /**
     * Run final validation with design document test cases
     */
    async runFinalValidation() {
        console.log('🔍 Running final validation...\n');
        
        // Run letter conversion validation
        this.testResults.finalValidation = {};
        this.testResults.finalValidation.letterConversion = validateLetterConversion();
        
        // Run design document test cases
        this.testResults.finalValidation.designTestCases = runFinalValidation();
        
        console.log('\n✅ Final validation completed\n');
    }
    
    /**
     * Test complete form submission flow
     */
    async testCompleteFormFlow() {
        // Simulate form filling and submission
        const form = document.getElementById('client-form');
        if (!form) throw new Error('Form not found');
        
        // Fill form with test data
        form.firstName.value = 'John';
        form.lastName1.value = 'Smith';
        form.birthDate.value = '1995-06-15';
        
        // Trigger validation
        const formHandler = new FormHandler(form);
        const isValid = formHandler.validateForm();
        
        if (!isValid) throw new Error('Form validation failed');
        
        // Test calculation
        const calculator = new Calculator();
        const output1 = calculator.calculateOutput1('1995-06-15');
        const output2 = calculator.calculateOutput2('John', { lastName1: 'Smith' });
        const output3 = calculator.calculateOutput3('John', { lastName1: 'Smith' });
        
        if (output1 !== 24) throw new Error(`Expected output1=24, got ${output1}`);
        if (output3 < 1 || output3 > 9) throw new Error(`Invalid output3: ${output3}`);
        if (!Array.isArray(output2) || output2.length !== 9) throw new Error('Invalid output2 structure');
    }
    
    /**
     * Test calculation accuracy with known test cases
     */
    testCalculationAccuracy() {
        const calculator = new Calculator();
        
        // Test case from design document: JOHN SMITH, 1995
        const output1 = calculator.calculateOutput1('1995-06-15');
        const output2 = calculator.calculateOutput2('JOHN', { lastName1: 'SMITH' });
        const output3 = calculator.calculateOutput3('JOHN', { lastName1: 'SMITH' });
        
        if (output1 !== 24) throw new Error(`Output1 test failed: expected 24, got ${output1}`);
        
        // Verify Output2 has correct structure and ô for zeros
        const hasZeroOccurrence = output2.some(item => item.display === 'ô');
        if (!hasZeroOccurrence) throw new Error('Output2 should have ô for zero occurrences');
        
        if (output3 !== 9) throw new Error(`Output3 test failed: expected 9, got ${output3}`);
        
        // Test ZZZZ case for multi-digit reduction
        const output3_zzzz = calculator.calculateOutput3('ZZZZ', {});
        if (output3_zzzz !== 5) throw new Error(`ZZZZ test failed: expected 5, got ${output3_zzzz}`);
    }
    
    /**
     * Test error recovery mechanisms
     */
    testErrorRecovery() {
        const calculator = new Calculator();
        
        // Test invalid date handling
        try {
            calculator.calculateOutput1('invalid-date');
            throw new Error('Should have thrown error for invalid date');
        } catch (error) {
            if (!error.message.includes('Invalid birth date')) {
                throw new Error('Wrong error message for invalid date');
            }
        }
        
        // Test empty name handling
        const output3_empty = calculator.calculateOutput3('', {});
        if (output3_empty < 1 || output3_empty > 9) {
            throw new Error('Empty name should return valid single digit');
        }
    }
    
    /**
     * Test reset functionality
     */
    testResetFunctionality() {
        const form = document.getElementById('client-form');
        if (!form) throw new Error('Form not found');
        
        // Fill form
        form.firstName.value = 'Test';
        form.lastName1.value = 'User';
        form.birthDate.value = '1990-01-01';
        
        // Reset form
        const formHandler = new FormHandler(form);
        formHandler.resetForm();
        
        // Check if form is cleared
        if (form.firstName.value !== '' || form.lastName1.value !== '' || form.birthDate.value !== '') {
            throw new Error('Form not properly reset');
        }
    }
    
    /**
     * Test responsive design
     */
    testResponsiveDesign() {
        const container = document.querySelector('.container');
        if (!container) throw new Error('Container not found');
        
        const computedStyle = window.getComputedStyle(container);
        const maxWidth = computedStyle.maxWidth;
        
        if (!maxWidth || maxWidth === 'none') {
            throw new Error('Container should have max-width for responsive design');
        }
    }
    
    /**
     * Test field visual separation
     */
    testFieldSeparation() {
        const formGroups = document.querySelectorAll('.form-group');
        if (formGroups.length < 5) throw new Error('Not enough form groups found');
        
        formGroups.forEach((group, index) => {
            const computedStyle = window.getComputedStyle(group);
            const border = computedStyle.border;
            const padding = computedStyle.padding;
            
            if (!border || border === 'none' || !padding || padding === '0px') {
                throw new Error(`Form group ${index} lacks visual separation`);
            }
        });
    }
    
    /**
     * Test validation feedback
     */
    testValidationFeedback() {
        const errorMessages = document.querySelectorAll('.error-message');
        if (errorMessages.length < 5) throw new Error('Not enough error message elements');
        
        // Test that error messages are initially hidden
        errorMessages.forEach((message, index) => {
            const isVisible = message.classList.contains('show');
            if (isVisible) {
                throw new Error(`Error message ${index} should be initially hidden`);
            }
        });
    }
    
    /**
     * Test keyboard navigation
     */
    testKeyboardNavigation() {
        const inputs = document.querySelectorAll('input, button');
        if (inputs.length === 0) throw new Error('No focusable elements found');
        
        inputs.forEach((element, index) => {
            const tabIndex = element.tabIndex;
            if (tabIndex < -1) {
                throw new Error(`Element ${index} has invalid tabIndex: ${tabIndex}`);
            }
        });
    }
    
    /**
     * Test ARIA labels
     */
    testAriaLabels() {
        const labels = document.querySelectorAll('label');
        const inputs = document.querySelectorAll('input');
        
        if (labels.length !== inputs.length) {
            throw new Error('Mismatch between labels and inputs');
        }
        
        inputs.forEach((input, index) => {
            const hasLabel = input.id && document.querySelector(`label[for="${input.id}"]`);
            if (!hasLabel) {
                throw new Error(`Input ${index} missing proper label association`);
            }
        });
    }
    
    /**
     * Test color contrast (basic check)
     */
    testColorContrast() {
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach((button, index) => {
            const computedStyle = window.getComputedStyle(button);
            const backgroundColor = computedStyle.backgroundColor;
            const color = computedStyle.color;
            
            if (!backgroundColor || backgroundColor === 'transparent' || 
                !color || color === 'transparent') {
                throw new Error(`Button ${index} lacks proper color contrast`);
            }
        });
    }
    
    /**
     * Generate comprehensive test report
     */
    generateTestReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 COMPREHENSIVE TEST REPORT');
        console.log('='.repeat(60));
        
        // Unit test results
        console.log('\n📋 UNIT TESTS:');
        Object.keys(this.testResults.unit).forEach(component => {
            const result = this.testResults.unit[component];
            console.log(`  ${component}: ${result ? '✅ PASS' : '❌ FAIL'}`);
        });
        
        // Integration test results
        console.log('\n🔗 INTEGRATION TESTS:');
        const integrationPass = this.testResults.integration.passed || 0;
        const integrationTotal = this.testResults.integration.total || 0;
        console.log(`  Passed: ${integrationPass}/${integrationTotal}`);
        
        // UI test results
        console.log('\n🎨 UI TESTS:');
        const uiPass = this.testResults.ui.passed || 0;
        const uiTotal = this.testResults.ui.total || 0;
        console.log(`  Passed: ${uiPass}/${uiTotal}`);
        
        // Accessibility test results
        console.log('\n♿ ACCESSIBILITY TESTS:');
        const a11yPass = this.testResults.accessibility.passed || 0;
        const a11yTotal = this.testResults.accessibility.total || 0;
        console.log(`  Passed: ${a11yPass}/${a11yTotal}`);
        
        // Final validation results
        console.log('\n🔍 FINAL VALIDATION:');
        if (this.testResults.finalValidation) {
            const letterConversion = this.testResults.finalValidation.letterConversion;
            const designTestCases = this.testResults.finalValidation.designTestCases;
            console.log(`  Letter Conversion: ${letterConversion ? '✅ PASS' : '❌ FAIL'}`);
            console.log(`  Design Test Cases: ${designTestCases ? '✅ PASS' : '❌ FAIL'}`);
        }
        
        // Overall result
        const allUnitsPassed = Object.values(this.testResults.unit).every(result => result);
        const integrationPassed = integrationPass === integrationTotal;
        const uiPassed = uiPass === uiTotal;
        const a11yPassed = a11yPass === a11yTotal;
        const finalValidationPassed = this.testResults.finalValidation ? 
            (this.testResults.finalValidation.letterConversion && this.testResults.finalValidation.designTestCases) : true;
        
        const overallPass = allUnitsPassed && integrationPassed && uiPassed && a11yPassed && finalValidationPassed;
        
        console.log('\n' + '='.repeat(60));
        console.log(`🎯 OVERALL RESULT: ${overallPass ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
        console.log('='.repeat(60));
        
        return overallPass;
    }
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.TestSuite = TestSuite;
}