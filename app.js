/**
 * Main application entry point
 * Integrates all components and manages application flow
 */
class PersonalDataCollectorApp {
    constructor() {
        this.formHandler = null;
        this.calculator = null;
        this.resultsDisplay = null;
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApplication());
        } else {
            this.setupApplication();
        }
    }
    
    /**
     * Set up all application components
     */
    setupApplication() {
        try {
            // Initialize components
            const form = document.getElementById('client-form');
            const resultsContainer = document.getElementById('results-container');
            
            if (!form) {
                throw new Error('Form element not found');
            }
            
            if (!resultsContainer) {
                throw new Error('Results container not found');
            }
            
            this.formHandler = new FormHandler(form);
            this.calculator = new Calculator();
            this.resultsDisplay = new ResultsDisplay(resultsContainer);
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('Personal Data Collector App initialized successfully');
            
            // Add debugging to check if components are working
            console.log('Components initialized:', {
                formHandler: !!this.formHandler,
                calculator: !!this.calculator,
                resultsDisplay: !!this.resultsDisplay
            });
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }
    
    /**
     * Set up application event listeners
     */
    setupEventListeners() {
        // Listen for form submission
        document.addEventListener('formSubmitted', (event) => {
            console.log('🎯 Form submitted event received!', event.detail);
            this.handleFormSubmission(event.detail);
        });
        
        // Listen for new calculation request
        document.addEventListener('newCalculation', () => {
            this.handleNewCalculation();
        });
        
        // Listen for window resize to handle responsive behavior
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Listen for print events
        window.addEventListener('beforeprint', () => {
            this.handleBeforePrint();
        });
        
        console.log('✅ Event listeners set up successfully');
    }
    
    /**
     * Handle form submission and calculate results
     * @param {object} formData - Form data from submission
     */
    async handleFormSubmission(formData) {
        try {
            // Validate input data before processing
            if (!this.validateInputData(formData)) {
                this.showError('Invalid input data. Please check all fields and try again.');
                return;
            }
            
            // Show loading state
            this.showLoading(true);
            
            // Prepare data for calculations
            const lastNames = {
                lastName1: formData.lastName1 || '',
                lastName2: formData.lastName2 || '',
                lastName3: formData.lastName3 || ''
            };
            
            // Calculate all outputs with individual error handling
            let output1, output2, output3;
            
            try {
                output1 = this.calculator.calculateOutput1(formData.birthDate);
            } catch (error) {
                throw new Error(`Output 1 calculation failed: ${error.message}`);
            }
            
            try {
                output2 = this.calculator.calculateOutput2(formData.firstName, lastNames);
            } catch (error) {
                throw new Error(`Output 2 calculation failed: ${error.message}`);
            }
            
            try {
                output3 = this.calculator.calculateOutput3(formData.firstName, lastNames);
            } catch (error) {
                throw new Error(`Output 3 calculation failed: ${error.message}`);
            }
            
            // Validate calculation results
            if (!this.validateCalculationResults(output1, output2, output3)) {
                throw new Error('Invalid calculation results generated');
            }
            
            // Small delay to show loading (for better UX)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Display results
            this.resultsDisplay.displayResults(output1, output2, output3, formData);
            
            // Hide loading state
            this.showLoading(false);
            
            console.log('Calculations completed successfully', {
                output1,
                output2: output2.map(item => `${item.number}:${item.display}`).join(', '),
                output3
            });
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError(`Calculation failed: ${error.message}`);
            this.showLoading(false);
        }
    }
    
    /**
     * Validate input data before processing
     * @param {object} formData - Form data to validate
     * @returns {boolean} - True if data is valid
     */
    validateInputData(formData) {
        try {
            // Check required fields
            if (!formData.firstName || formData.firstName.trim() === '') {
                return false;
            }
            
            if (!formData.birthDate || formData.birthDate.trim() === '') {
                return false;
            }
            
            // Validate date format
            const date = new Date(formData.birthDate);
            if (isNaN(date.getTime())) {
                return false;
            }
            
            // Check if date is reasonable
            const currentYear = new Date().getFullYear();
            const birthYear = date.getFullYear();
            if (birthYear < 1900 || birthYear > currentYear) {
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.error('Input validation error:', error);
            return false;
        }
    }
    
    /**
     * Validate calculation results
     * @param {number} output1 - Output 1 result
     * @param {Array} output2 - Output 2 result
     * @param {number} output3 - Output 3 result
     * @returns {boolean} - True if results are valid
     */
    validateCalculationResults(output1, output2, output3) {
        try {
            // Validate Output 1
            if (typeof output1 !== 'number' || output1 < 0 || output1 > 50) {
                console.error('Invalid Output 1:', output1);
                return false;
            }
            
            // Validate Output 2
            if (!Array.isArray(output2) || output2.length !== 9) {
                console.error('Invalid Output 2 structure:', output2);
                return false;
            }
            
            for (let i = 0; i < output2.length; i++) {
                const item = output2[i];
                if (!item || typeof item.number !== 'number' || 
                    typeof item.count !== 'number' || !item.display) {
                    console.error('Invalid Output 2 item:', item);
                    return false;
                }
            }
            
            // Validate Output 3
            if (typeof output3 !== 'number' || output3 < 1 || output3 > 9) {
                console.error('Invalid Output 3:', output3);
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.error('Result validation error:', error);
            return false;
        }
    }
    
    /**
     * Handle new calculation request (reset form)
     */
    handleNewCalculation() {
        if (this.formHandler) {
            this.formHandler.resetForm();
        }
        
        // Scroll back to form
        const formSection = document.querySelector('.form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Handle window resize events
     */
    handleResize() {
        // Could add responsive behavior adjustments here if needed
        // For now, CSS handles most responsive behavior
    }
    
    /**
     * Handle before print events
     */
    handleBeforePrint() {
        // Could add print-specific adjustments here if needed
        console.log('Preparing for print...');
    }
    
    /**
     * Show loading state
     * @param {boolean} show - Whether to show or hide loading
     */
    showLoading(show) {
        const submitBtn = document.getElementById('submit-btn');
        
        if (show) {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Calculating...';
                submitBtn.style.cursor = 'wait';
            }
            
            // Add loading class to body for potential CSS animations
            document.body.classList.add('loading');
            
        } else {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Calculate Results';
                submitBtn.style.cursor = 'pointer';
            }
            
            document.body.classList.remove('loading');
        }
    }
    
    /**
     * Show error message to user
     * @param {string} message - Error message to display
     */
    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${message}</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    /**
     * Run comprehensive test suite (development mode only)
     */
    async runTests() {
        if (window.location.hostname === 'localhost' && window.TestSuite) {
            console.log('Running comprehensive test suite...');
            
            const testSuite = new window.TestSuite();
            const allTestsPassed = await testSuite.runAllTests();
            
            return allTestsPassed;
        }
        
        return true;
    }
}

// Initialize application when script loads
const app = new PersonalDataCollectorApp();

// Expose app to global scope for debugging (development only)
if (window.location.hostname === 'localhost') {
    window.PersonalDataCollectorApp = app;
    
    // Uncomment to run tests on load
    // setTimeout(() => app.runTests(), 1000);
}