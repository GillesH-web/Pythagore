/**
 * Validator class handles all input validation logic
 */
class Validator {
    /**
     * Validates name fields - alphabetic characters and spaces only
     * @param {string} name - The name to validate
     * @returns {object} - {isValid: boolean, message: string}
     */
    validateName(name) {
        if (!name || name.trim() === '') {
            return { isValid: true, message: '' }; // Optional fields can be empty
        }

        const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!nameRegex.test(name.trim())) {
            return {
                isValid: false,
                message: 'Name must contain only alphabetic characters and spaces'
            };
        }

        return { isValid: true, message: '' };
    }

    /**
     * Validates date string - must be valid date format and in the past
     * @param {string} dateString - The date string to validate
     * @returns {object} - {isValid: boolean, message: string}
     */
    validateDate(dateString) {
        if (!dateString || dateString.trim() === '') {
            return {
                isValid: false,
                message: 'Birth date is required'
            };
        }

        const date = new Date(dateString);
        const today = new Date();

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return {
                isValid: false,
                message: 'Please enter a valid date'
            };
        }

        // Check if date is in the future
        if (date >= today) {
            return {
                isValid: false,
                message: 'Birth date must be in the past'
            };
        }

        // Check if date is too far in the past (reasonable birth year)
        const minYear = 1900;
        if (date.getFullYear() < minYear) {
            return {
                isValid: false,
                message: `Birth year must be after ${minYear}`
            };
        }

        return { isValid: true, message: '' };
    }

    /**
     * Validates required fields are filled
     * @param {object} formData - Object containing form field values
     * @returns {object} - {isValid: boolean, message: string}
     */
    validateRequiredFields(formData) {
        const requiredFields = ['firstName', 'birthDate'];
        const missingFields = [];

        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                missingFields.push(field === 'firstName' ? 'First Name' : 'Birth Date');
            }
        }

        if (missingFields.length > 0) {
            return {
                isValid: false,
                message: `Required fields missing: ${missingFields.join(', ')}`
            };
        }

        return { isValid: true, message: '' };
    }

    /**
     * Validates all form data
     * @param {object} formData - Object containing all form field values
     * @returns {object} - {isValid: boolean, errors: object}
     */
    validateAll(formData) {
        const errors = {};
        let isValid = true;

        // Validate required fields first
        const requiredValidation = this.validateRequiredFields(formData);
        if (!requiredValidation.isValid) {
            isValid = false;
        }

        // Validate first name
        if (formData.firstName) {
            const firstNameValidation = this.validateName(formData.firstName);
            if (!firstNameValidation.isValid) {
                errors.firstName = firstNameValidation.message;
                isValid = false;
            }
        } else {
            errors.firstName = 'First name is required';
            isValid = false;
        }

        // Validate last names
        const lastNames = ['lastName1', 'lastName2', 'lastName3'];
        for (const lastName of lastNames) {
            if (formData[lastName]) {
                const lastNameValidation = this.validateName(formData[lastName]);
                if (!lastNameValidation.isValid) {
                    errors[lastName] = lastNameValidation.message;
                    isValid = false;
                }
            }
        }

        // Validate birth date
        const dateValidation = this.validateDate(formData.birthDate);
        if (!dateValidation.isValid) {
            errors.birthDate = dateValidation.message;
            isValid = false;
        }

        return { isValid, errors };
    }
}

// Unit tests for Validator class
function runValidatorTests() {
    const validator = new Validator();
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

    // Test name validation
    test('validateName accepts valid names', () => {
        const result = validator.validateName('John Doe');
        if (!result.isValid) throw new Error('Should accept valid name');
    });

    test('validateName rejects names with numbers', () => {
        const result = validator.validateName('John123');
        if (result.isValid) throw new Error('Should reject names with numbers');
    });

    test('validateName accepts empty string for optional fields', () => {
        const result = validator.validateName('');
        if (!result.isValid) throw new Error('Should accept empty string');
    });

    // Test date validation
    test('validateDate accepts valid past date', () => {
        const result = validator.validateDate('1990-01-01');
        if (!result.isValid) throw new Error('Should accept valid past date');
    });

    test('validateDate rejects future date', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const result = validator.validateDate(futureDate.toISOString().split('T')[0]);
        if (result.isValid) throw new Error('Should reject future date');
    });

    test('validateDate rejects empty date', () => {
        const result = validator.validateDate('');
        if (result.isValid) throw new Error('Should reject empty date');
    });

    // Test required fields validation
    test('validateRequiredFields accepts complete data', () => {
        const result = validator.validateRequiredFields({
            firstName: 'John',
            birthDate: '1990-01-01'
        });
        if (!result.isValid) throw new Error('Should accept complete required data');
    });

    test('validateRequiredFields rejects missing firstName', () => {
        const result = validator.validateRequiredFields({
            birthDate: '1990-01-01'
        });
        if (result.isValid) throw new Error('Should reject missing firstName');
    });

    console.log(`\nValidator Tests: ${testsPassed}/${totalTests} passed`);
    return testsPassed === totalTests;
}

// Run tests if in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Uncomment the line below to run tests
    // runValidatorTests();
}