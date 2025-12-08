/**
 * MobileFrameController - Manages frame switching for mobile interface
 * Controls visibility of form (frame1) vs results (frame2)
 * Handles smooth transitions and scroll behavior
 */
class MobileFrameController {
    constructor() {
        this.leftPanel = document.querySelector('.left-panel');
        this.rightPanel = document.querySelector('.right-panel');
        this.currentFrame = 'form';
        this.transitionInProgress = false;
        
        // Frame states
        this.frames = {
            FORM: 'form',
            RESULTS: 'results'
        };
        
        this.init();
    }
    
    /**
     * Initialize mobile frame controller
     */
    init() {
        console.log('📱 MobileFrameController: Initializing...');
        
        // Set initial state - show form
        this.showFormFrame(false);
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('📱 MobileFrameController: Initialized with form frame visible');
    }
    
    /**
     * Set up event listeners for frame switching
     */
    setupEventListeners() {
        // Listen for calculate button clicks
        document.addEventListener('click', (event) => {
            const calculateBtn = event.target.closest('#submit-btn, #mobile-submit-btn, #nuclear-calculate');
            if (calculateBtn && !calculateBtn.disabled) {
                console.log('📱 Calculate button clicked - will switch to results after calculation');
                // Delay to allow calculation to complete
                setTimeout(() => {
                    this.showResultsFrame();
                }, 1000);
            }
        });
        
        // Listen for reset button clicks
        document.addEventListener('click', (event) => {
            const resetBtn = event.target.closest('#reset-btn, #mobile-reset-btn, #nuclear-reset');
            if (resetBtn) {
                console.log('📱 Reset button clicked - switching to form frame');
                this.showFormFrame();
            }
        });
        
        // Listen for form submission event
        document.addEventListener('formSubmitted', () => {
            console.log('📱 Form submitted event - switching to results frame');
            this.showResultsFrame();
        });
        
        console.log('📱 MobileFrameController: Event listeners set up');
    }
    
    /**
     * Show form frame (hide results)
     * @param {boolean} animated - Whether to animate the transition
     */
    showFormFrame(animated = true) {
        if (this.transitionInProgress) {
            console.warn('📱 Transition in progress, ignoring frame switch');
            return;
        }
        
        if (this.currentFrame === this.frames.FORM) {
            console.log('📱 Already on form frame');
            return;
        }
        
        this.transitionInProgress = true;
        this.currentFrame = this.frames.FORM;
        
        console.log('📱 Switching to form frame...');
        
        if (this.leftPanel && this.rightPanel) {
            if (animated) {
                // Add transition class
                this.leftPanel.classList.add('frame-transition');
                this.rightPanel.classList.add('frame-transition');
            }
            
            // Show form, hide results
            this.leftPanel.style.display = 'flex';
            this.rightPanel.style.display = 'none';
            
            // Update main content layout
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.classList.add('mobile-frame-active');
                mainContent.classList.add('form-frame-active');
                mainContent.classList.remove('results-frame-active');
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: animated ? 'smooth' : 'auto' });
            
            // Focus first input
            setTimeout(() => {
                const firstInput = document.getElementById('firstName1');
                if (firstInput) {
                    firstInput.focus();
                }
            }, animated ? 300 : 0);
            
            // Remove transition class
            if (animated) {
                setTimeout(() => {
                    this.leftPanel.classList.remove('frame-transition');
                    this.rightPanel.classList.remove('frame-transition');
                    this.transitionInProgress = false;
                }, 300);
            } else {
                this.transitionInProgress = false;
            }
            
            console.log('✅ Form frame displayed');
        }
    }
    
    /**
     * Show results frame (hide form)
     * @param {boolean} animated - Whether to animate the transition
     */
    showResultsFrame(animated = true) {
        if (this.transitionInProgress) {
            console.warn('📱 Transition in progress, ignoring frame switch');
            return;
        }
        
        if (this.currentFrame === this.frames.RESULTS) {
            console.log('📱 Already on results frame');
            return;
        }
        
        this.transitionInProgress = true;
        this.currentFrame = this.frames.RESULTS;
        
        console.log('📱 Switching to results frame...');
        
        if (this.leftPanel && this.rightPanel) {
            if (animated) {
                // Add transition class
                this.leftPanel.classList.add('frame-transition');
                this.rightPanel.classList.add('frame-transition');
            }
            
            // Hide form, show results
            this.leftPanel.style.display = 'none';
            this.rightPanel.style.display = 'flex';
            
            // Update main content layout
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.classList.add('mobile-frame-active');
                mainContent.classList.add('results-frame-active');
                mainContent.classList.remove('form-frame-active');
            }
            
            // Scroll to top to show results
            window.scrollTo({ top: 0, behavior: animated ? 'smooth' : 'auto' });
            
            // Remove transition class
            if (animated) {
                setTimeout(() => {
                    this.leftPanel.classList.remove('frame-transition');
                    this.rightPanel.classList.remove('frame-transition');
                    this.transitionInProgress = false;
                }, 300);
            } else {
                this.transitionInProgress = false;
            }
            
            console.log('✅ Results frame displayed');
        }
    }
    
    /**
     * Toggle between frames
     */
    toggleFrame() {
        if (this.currentFrame === this.frames.FORM) {
            this.showResultsFrame();
        } else {
            this.showFormFrame();
        }
    }
    
    /**
     * Get current frame
     * @returns {string} - Current frame ('form' or 'results')
     */
    getCurrentFrame() {
        return this.currentFrame;
    }
    
    /**
     * Check if form frame is active
     * @returns {boolean}
     */
    isFormFrame() {
        return this.currentFrame === this.frames.FORM;
    }
    
    /**
     * Check if results frame is active
     * @returns {boolean}
     */
    isResultsFrame() {
        return this.currentFrame === this.frames.RESULTS;
    }
    
    /**
     * Check if transition is in progress
     * @returns {boolean}
     */
    isTransitioning() {
        return this.transitionInProgress;
    }
    
    /**
     * Force frame switch (for testing)
     * @param {string} frame - Frame to switch to ('form' or 'results')
     */
    forceFrame(frame) {
        if (frame === this.frames.FORM) {
            this.showFormFrame();
        } else if (frame === this.frames.RESULTS) {
            this.showResultsFrame();
        } else {
            console.warn(`📱 Invalid frame: ${frame}`);
        }
    }
    
    /**
     * Get debug information
     * @returns {object} - Debug information
     */
    getDebugInfo() {
        return {
            currentFrame: this.currentFrame,
            transitionInProgress: this.transitionInProgress,
            leftPanelVisible: this.leftPanel ? this.leftPanel.style.display !== 'none' : false,
            rightPanelVisible: this.rightPanel ? this.rightPanel.style.display !== 'none' : false
        };
    }
}

// CSS for mobile frame transitions
const mobileFrameControllerCSS = `
/* Mobile frame transition animations */
.frame-transition {
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out !important;
}

/* Mobile frame active states */
.mobile-frame-active {
    position: relative;
}

.form-frame-active .left-panel {
    animation: slideInFromLeft 0.3s ease-out;
}

.results-frame-active .right-panel {
    animation: slideInFromRight 0.3s ease-out;
}

/* Slide animations */
@keyframes slideInFromLeft {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInFromRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Mobile frame specific styles */
@media screen and (max-width: 480px) {
    .mobile-frame-active .left-panel,
    .mobile-frame-active .right-panel {
        width: 100% !important;
        height: 100% !important;
    }
    
    .form-frame-active .left-panel {
        display: flex !important;
    }
    
    .form-frame-active .right-panel {
        display: none !important;
    }
    
    .results-frame-active .left-panel {
        display: none !important;
    }
    
    .results-frame-active .right-panel {
        display: flex !important;
    }
}
`;

// Inject CSS
function injectMobileFrameControllerCSS() {
    const styleElement = document.createElement('style');
    styleElement.id = 'mobile-frame-controller-styles';
    styleElement.textContent = mobileFrameControllerCSS;
    document.head.appendChild(styleElement);
}

// Auto-inject CSS when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectMobileFrameControllerCSS);
} else {
    injectMobileFrameControllerCSS();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileFrameController;
}
