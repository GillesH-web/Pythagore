/**
 * FormHandler class manages form interactions and validation
 */
class FormHandler {
    constructor(formElement) {
        this.form = formElement;
        this.validator = new Validator();
        this.submitButton = document.getElementById('submit-btn');
        this.resetButton = document.getElementById('reset-btn');
        
        this.initializeEventListeners();
    }
    
    /**
     * Initialize event listeners for form interactions
     */
    initializeEventListeners() {
        // Add input event listeners for real-time validation
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input.name, input.value));
            input.addEventListener('blur', () => this.validateField(input.name, input.value));
            input.addEventListener('focus', () => this.addFocusState(input.name));
        });
        
        // Add form submission listener
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add reset button listener
        this.resetButton.addEventListener('click', () => this.resetForm());
        
        // Initial validation state
        this.updateSubmitButton();
    }
    
    /**
     * Add focus state to form group
     * @param {string} fieldName - Name of the field
     */
    addFocusState(fieldName) {
        const formGroup = document.getElementById(fieldName).closest('.form-group');
        formGroup.classList.add('focused');
        
        // Remove focus state when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!formGroup.contains(e.target)) {
                formGroup.classList.remove('focused');
            }
        }, { once: true });
    }
    
    /**
     * Validate a single field
     * @param {string} fieldName - Name of the field to validate
     * @param {string} value - Value to validate
     */
    validateField(fieldName, value) {
        let validation;
        
        if (fieldName === 'birthDate') {
            validation = this.validator.validateDate(value);
        } else {
            validation = this.validator.validateName(value);
            
            // Special case for required firstName
            if (fieldName === 'firstName' && (!value || value.trim() === '')) {
                validation = { isValid: false, message: 'First name is required' };
            }
        }
        
        if (validation.isValid) {
            this.clearValidationError(fieldName);
        } else {
            this.showValidationError(fieldName, validation.message);
        }
        
        this.updateSubmitButton();
    }
    
    /**
     * Validate entire form
     * @returns {boolean} - True if form is valid
     */
    validateForm() {
        const formData = this.getFormData();
        const validation = this.validator.validateAll(formData);
        
        // Clear all previous errors
        this.clearAllValidationErrors();
        
        // Show any validation errors
        if (!validation.isValid) {
            Object.keys(validation.errors).forEach(fieldName => {
                this.showValidationError(fieldName, validation.errors[fieldName]);
            });
        }
        
        this.updateSubmitButton();
        return validation.isValid;
    }
    
    /**
     * Get form data as object
     * @returns {object} - Form data
     */
    getFormData() {
        const inputs = this.form.querySelectorAll('input');
        const data = {};
        
        inputs.forEach(input => {
            data[input.name] = input.value.trim();
        });
        
        return data;
    }
    
    /**
     * Reset form to initial state
     */
    resetForm() {
        this.form.reset();
        this.clearAllValidationErrors();
        this.updateSubmitButton();
        
        // Remove focus states
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('focused', 'error');
        });
        
        // Hide results section
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
    }
    
    /**
     * Show validation error for a field
     * @param {string} fieldName - Name of the field
     * @param {string} message - Error message
     */
    showValidationError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const formGroup = document.getElementById(fieldName).closest('.form-group');
        
        if (errorElement && formGroup) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            formGroup.classList.add('error');
        }
    }
    
    /**
     * Clear validation error for a field
     * @param {string} fieldName - Name of the field
     */
    clearValidationError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const formGroup = document.getElementById(fieldName).closest('.form-group');
        
        if (errorElement && formGroup) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            formGroup.classList.remove('error');
        }
    }
    
    /**
     * Clear all validation errors
     */
    clearAllValidationErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const formGroups = document.querySelectorAll('.form-group');
        
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
        
        formGroups.forEach(group => {
            group.classList.remove('error');
        });
    }
    
    /**
     * Update submit button state based on form validity
     */
    updateSubmitButton() {
        const formData = this.getFormData();
        const validation = this.validator.validateAll(formData);
        
        if (validation.isValid) {
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Calculate Results';
        } else {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Complete Required Fields';
        }
    }
    
    /**
     * Handle form submission
     * @param {Event} event - Submit event
     */
    handleSubmit(event) {
        console.log('🚀 Form submit handler called');
        event.preventDefault();
        
        if (this.validateForm()) {
            const formData = this.getFormData();
            console.log('✅ Form is valid, dispatching event with data:', formData);
            
            // Dispatch custom event with form data
            const submitEvent = new CustomEvent('formSubmitted', {
                detail: formData
            });
            document.dispatchEvent(submitEvent);
            console.log('📤 formSubmitted event dispatched');
        } else {
            console.log('❌ Form validation failed');
        }
    }
}

// Unit tests for FormHandler class
function runFormHandlerTests() {
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
    
    // Create a mock form for testing
    const mockForm = document.createElement('form');
    mockForm.innerHTML = `
        <input type="text" name="firstName" id="firstName">
        <div id="firstName-error" class="error-message"></div>
        <input type="date" name="birthDate" id="birthDate">
        <div id="birthDate-error" class="error-message"></div>
        <button type="submit" id="submit-btn">Submit</button>
        <button type="button" id="reset-btn">Reset</button>
    `;
    
    // Add form groups
    const inputs = mockForm.querySelectorAll('input');
    inputs.forEach(input => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        input.parentNode.insertBefore(formGroup, input);
        formGroup.appendChild(input);
        formGroup.appendChild(input.nextElementSibling); // error message
    });
    
    document.body.appendChild(mockForm);
    
    const formHandler = new FormHandler(mockForm);
    
    test('FormHandler initializes correctly', () => {
        if (!formHandler.form || !formHandler.validator) {
            throw new Error('FormHandler not initialized properly');
        }
    });
    
    test('getFormData returns correct data', () => {
        mockForm.firstName.value = 'John';
        mockForm.birthDate.value = '1990-01-01';
        
        const data = formHandler.getFormData();
        if (data.firstName !== 'John' || data.birthDate !== '1990-01-01') {
            throw new Error('Form data not retrieved correctly');
        }
    });
    
    test('validateField shows error for invalid input', () => {
        formHandler.validateField('firstName', '');
        const errorElement = document.getElementById('firstName-error');
        if (!errorElement.classList.contains('show')) {
            throw new Error('Error not shown for invalid input');
        }
    });
    
    test('clearValidationError removes error', () => {
        formHandler.showValidationError('firstName', 'Test error');
        formHandler.clearValidationError('firstName');
        const errorElement = document.getElementById('firstName-error');
        if (errorElement.classList.contains('show')) {
            throw new Error('Error not cleared');
        }
    });
    
    test('resetForm clears all data', () => {
        mockForm.firstName.value = 'John';
        formHandler.resetForm();
        if (mockForm.firstName.value !== '') {
            throw new Error('Form not reset properly');
        }
    });
    
    // Cleanup
    document.body.removeChild(mockForm);
    
    console.log(`\nFormHandler Tests: ${testsPassed}/${totalTests} passed`);
    return testsPassed === totalTests;
}

// Run tests if in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Uncomment the line below to run tests
    // runFormHandlerTests();
}