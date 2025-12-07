/**
 * Validator Class - Handles all form input validation
 * Pythagore Numerology Application
 */
class Validator {
    /**
     * Validates a name field (first names or last name)
     * @param {string} name - Name to validate
     * @returns {Object} - Object with isValid boolean and message string
     */
    validateName(name) {
        if (!name || name.trim() === '') {
            return { isValid: true, message: '' };
        }
        const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
        if (!nameRegex.test(name.trim())) {
            return { isValid: false, message: 'Seules les lettres, espaces, tirets et apostrophes sont autorisés' };
        }
        return { isValid: true, message: '' };
    }

    /**
     * Validates a birth date
     * @param {string} dateString - Date string to validate
     * @returns {Object} - Object with isValid boolean and message string
     */
    validateDate(dateString) {
        if (!dateString || dateString.trim() === '') {
            return { isValid: false, message: 'La date de naissance est obligatoire' };
        }
        const date = new Date(dateString);
        const today = new Date();
        if (isNaN(date.getTime())) {
            return { isValid: false, message: 'Veuillez entrer une date valide' };
        }
        if (date >= today) {
            return { isValid: false, message: 'La date de naissance doit être dans le passé' };
        }
        return { isValid: true, message: '' };
    }

    /**
     * Validates all form data
     * @param {Object} formData - Object containing all form field values
     * @returns {Object} - Object with isValid boolean and errors object
     */
    validateAll(formData) {
        const errors = {};
        let isValid = true;

        // Validate first name (required)
        if (!formData.firstName1 || formData.firstName1.trim() === '') {
            errors.firstName1 = 'Le premier prénom est obligatoire';
            isValid = false;
        } else {
            const nameValidation = this.validateName(formData.firstName1);
            if (!nameValidation.isValid) {
                errors.firstName1 = nameValidation.message;
                isValid = false;
            }
        }

        // Validate second first name (optional)
        if (formData.firstName2) {
            const nameValidation = this.validateName(formData.firstName2);
            if (!nameValidation.isValid) {
                errors.firstName2 = nameValidation.message;
                isValid = false;
            }
        }

        // Validate third first name (optional)
        if (formData.firstName3) {
            const nameValidation = this.validateName(formData.firstName3);
            if (!nameValidation.isValid) {
                errors.firstName3 = nameValidation.message;
                isValid = false;
            }
        }

        // Validate last name (required)
        if (!formData.lastName || formData.lastName.trim() === '') {
            errors.lastName = 'Le nom de famille est obligatoire';
            isValid = false;
        } else {
            const nameValidation = this.validateName(formData.lastName);
            if (!nameValidation.isValid) {
                errors.lastName = nameValidation.message;
                isValid = false;
            }
        }

        // Validate birth date (required)
        const dateValidation = this.validateDate(formData.birthDate);
        if (!dateValidation.isValid) {
            errors.birthDate = dateValidation.message;
            isValid = false;
        }

        return { isValid: isValid, errors: errors };
    }
}