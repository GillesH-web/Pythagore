/**
 * MobileFrameSwitcher class manages frame switching for optimal mobile display
 * Shows only frame1 (form) initially, switches to frame2 (results) on calculate,
 * and back to frame1 (form) on reset
 */
class MobileFrameSwitcher {
    constructor() {
        this.leftPanel = document.querySelector('.left-panel');
        this.rightPanel = document.querySelector('.right-panel');
        this.isMobile = this.detectMobile();
        this.currentFrame = 'frame1'; // Start with form visible
        
        this.init();
    }
    
    /**
     * Initialize the frame switcher
     */
    init() {
        if (!this.isMobile) {
            console.log('Desktop detected - frame switching disabled');
            return;
        }
        
        console.log('Mobile detected - initializing frame switcher');
        console.log('📱 Viewport width:', window.innerWidth);
        console.log('📱 User agent:', navigator.userAgent);
        
        // Add mobile-specific CSS classes first
        this.addMobileClasses();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // CRITICAL: Set initial state - show only form, hide results
        // Use setTimeout to ensure DOM is fully ready
        setTimeout(() => {
            this.showFrame1();
            console.log('📱 Initial frame state set - Frame 1 visible, Frame 2 hidden');
        }, 100);
    }
    
    /**
     * Detect if device is mobile
     * @returns {boolean} - True if mobile device
     */
    detectMobile() {
        // Check viewport width
        const isMobileWidth = window.innerWidth <= 480;
        
        // Check user agent for mobile indicators
        const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Check for touch capability
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        return isMobileWidth || (isMobileUA && hasTouch);
    }
    
    /**
     * Set up event listeners for frame switching
     */
    setupEventListeners() {
        // Listen for form submission (switch to results)
        document.addEventListener('formSubmitted', () => {
            console.log('📱 Form submitted - switching to results frame');
            this.showFrame2();
        });
        
        // Listen for form reset (switch to form) - includes Frame 2 reset button
        document.addEventListener('click', (event) => {
            const resetBtn = event.target.closest('#reset-btn, #mobile-reset-btn, #nuclear-reset, #mobile-frame2-reset-btn');
            if (resetBtn) {
                console.log('📱 Reset clicked - switching to form frame and cleaning up');
                
                // Clean up the form
                const form = document.getElementById('client-form');
                if (form) {
                    form.reset();
                }
                
                // Clear error messages
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('error');
                });
                document.querySelectorAll('.error-message').forEach(error => {
                    error.classList.remove('show');
                });
                
                // Clear results
                if (window.formHandler && window.formHandler.resultsDisplay) {
                    window.formHandler.resultsDisplay.clearResults();
                }
                
                // Disable submit button
                const submitBtn = document.getElementById('submit-btn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
                const mobileSubmitBtn = document.getElementById('mobile-submit-btn');
                if (mobileSubmitBtn) {
                    mobileSubmitBtn.disabled = true;
                }
                
                // Switch to Frame 1
                this.showFrame1();
            }
        });
        
        // DIRECT listener for Frame 2 reset button (backup in case event bubbling fails)
        setTimeout(() => {
            const frame2ResetBtn = document.getElementById('mobile-frame2-reset-btn');
            if (frame2ResetBtn) {
                frame2ResetBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('📱 Frame 2 Reset button clicked directly - navigating to Frame 1');
                    
                    // Clean up the form
                    const form = document.getElementById('client-form');
                    if (form) {
                        form.reset();
                    }
                    
                    // Clear error messages
                    document.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('error');
                    });
                    document.querySelectorAll('.error-message').forEach(error => {
                        error.classList.remove('show');
                    });
                    
                    // Clear results
                    if (window.formHandler && window.formHandler.resultsDisplay) {
                        window.formHandler.resultsDisplay.clearResults();
                    }
                    
                    // Disable submit button
                    const submitBtn = document.getElementById('submit-btn');
                    if (submitBtn) {
                        submitBtn.disabled = true;
                    }
                    const mobileSubmitBtn = document.getElementById('mobile-submit-btn');
                    if (mobileSubmitBtn) {
                        mobileSubmitBtn.disabled = true;
                    }
                    
                    // Switch to Frame 1
                    this.showFrame1();
                }, { passive: false });
                console.log('📱 Direct event listener attached to Frame 2 reset button');
            }
        }, 500);
        
        // Listen for Calculate button clicks for immediate frame switch
        document.addEventListener('click', (event) => {
            const calculateBtn = event.target.closest('#submit-btn, #mobile-submit-btn, #nuclear-calculate');
            if (calculateBtn && !calculateBtn.disabled) {
                console.log('📱 Calculate clicked - switching to results frame immediately');
                // Switch immediately on click for better UX
                setTimeout(() => {
                    this.showFrame2();
                }, 300); // Small delay to allow calculation to start
            }
        });
        
        // Listen for window resize to re-evaluate mobile state
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = this.detectMobile();
            
            if (wasMobile !== this.isMobile) {
                if (this.isMobile) {
                    this.addMobileClasses();
                    // Apply current frame state
                    if (this.currentFrame === 'frame1') {
                        this.showFrame1();
                    } else {
                        this.showFrame2();
                    }
                } else {
                    this.removeMobileClasses();
                    this.showBothFrames();
                }
            }
        });
        
        // Listen for orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.isMobile = this.detectMobile();
                if (this.isMobile) {
                    // Reapply current frame state after orientation change
                    if (this.currentFrame === 'frame1') {
                        this.showFrame1();
                    } else {
                        this.showFrame2();
                    }
                }
            }, 100);
        });
    }
    
    /**
     * Show only frame1 (form)
     */
    showFrame1() {
        if (!this.isMobile) return;
        
        this.currentFrame = 'frame1';
        
        if (this.leftPanel && this.rightPanel) {
            // Show form, hide results - DON'T use cssText as it overwrites all styles
            this.leftPanel.style.display = 'flex';
            this.leftPanel.style.visibility = 'visible';
            this.leftPanel.style.opacity = '1';
            
            this.rightPanel.style.display = 'none';
            this.rightPanel.style.visibility = 'hidden';
            this.rightPanel.style.opacity = '0';
            
            // Update main content layout for single column
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.gridTemplateColumns = '1fr';
                mainContent.classList.add('mobile-frame-switching');
            }
            
            // Show Frame 1 FAB buttons
            const mobileFabContainer = document.getElementById('mobile-fab-container');
            if (mobileFabContainer) {
                mobileFabContainer.style.display = 'block';
            }
            
            // Hide Frame 2 Reset Button
            const frame2ResetContainer = document.getElementById('mobile-frame2-reset-container');
            if (frame2ResetContainer) {
                frame2ResetContainer.style.display = 'none';
                console.log('📱 Frame 2 Reset button container hidden');
            }
            
            // Show nuclear buttons if they exist
            const nuclearContainer = document.getElementById('nuclear-buttons');
            if (nuclearContainer) {
                nuclearContainer.style.display = 'block';
                nuclearContainer.style.visibility = 'visible';
                nuclearContainer.style.opacity = '1';
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log('📱 Frame 1 (form) displayed - FAB buttons visible');
        }
    }
    
    /**
     * Show only frame2 (results)
     */
    showFrame2() {
        if (!this.isMobile) return;
        
        this.currentFrame = 'frame2';
        
        if (this.leftPanel && this.rightPanel) {
            // Hide form, show results - DON'T use cssText as it overwrites all styles
            this.leftPanel.style.display = 'none';
            this.leftPanel.style.visibility = 'hidden';
            this.leftPanel.style.opacity = '0';
            
            this.rightPanel.style.display = 'flex';
            this.rightPanel.style.visibility = 'visible';
            this.rightPanel.style.opacity = '1';
            
            // Update main content layout for single column
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.gridTemplateColumns = '1fr';
                mainContent.classList.add('mobile-frame-switching');
            }
            
            // Hide Frame 1 FAB buttons
            const mobileFabContainer = document.getElementById('mobile-fab-container');
            if (mobileFabContainer) {
                mobileFabContainer.style.display = 'none';
            }
            
            // Show Frame 2 Reset Button
            const frame2ResetContainer = document.getElementById('mobile-frame2-reset-container');
            if (frame2ResetContainer) {
                frame2ResetContainer.style.display = 'block';
                frame2ResetContainer.style.visibility = 'visible';
                frame2ResetContainer.style.opacity = '1';
                console.log('📱 Frame 2 Reset button container shown');
            }
            
            // Ensure the reset button itself is visible
            const frame2ResetBtn = document.getElementById('mobile-frame2-reset-btn');
            if (frame2ResetBtn) {
                frame2ResetBtn.style.display = 'flex';
                frame2ResetBtn.style.visibility = 'visible';
                frame2ResetBtn.style.opacity = '1';
                frame2ResetBtn.style.pointerEvents = 'auto';
                console.log('📱 Frame 2 Reset button shown');
            }
            
            // Hide nuclear buttons if they exist
            const nuclearContainer = document.getElementById('nuclear-buttons');
            if (nuclearContainer) {
                nuclearContainer.style.display = 'none';
            }
            
            // Scroll to top to show results
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log('📱 Frame 2 (results) displayed - Reset button visible');
        }
    }
    
    /**
     * Show both frames (desktop mode)
     */
    showBothFrames() {
        if (this.leftPanel && this.rightPanel) {
            // Show both panels
            this.leftPanel.style.display = 'flex';
            this.rightPanel.style.display = 'flex';
            
            // Restore desktop layout
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.gridTemplateColumns = '1fr 2fr';
                mainContent.classList.remove('mobile-frame-switching');
            }
            
            console.log('🖥️ Both frames displayed (desktop mode)');
        }
    }
    
    /**
     * Add mobile-specific CSS classes
     */
    addMobileClasses() {
        document.body.classList.add('mobile-frame-switching');
        
        if (this.leftPanel) {
            this.leftPanel.classList.add('mobile-frame');
        }
        
        if (this.rightPanel) {
            this.rightPanel.classList.add('mobile-frame');
        }
    }
    
    /**
     * Remove mobile-specific CSS classes
     */
    removeMobileClasses() {
        document.body.classList.remove('mobile-frame-switching');
        
        if (this.leftPanel) {
            this.leftPanel.classList.remove('mobile-frame');
        }
        
        if (this.rightPanel) {
            this.rightPanel.classList.remove('mobile-frame');
        }
    }
    
    /**
     * Get current frame
     * @returns {string} - Current frame ('frame1' or 'frame2')
     */
    getCurrentFrame() {
        return this.currentFrame;
    }
    
    /**
     * Check if mobile mode is active
     * @returns {boolean} - True if mobile mode
     */
    isMobileMode() {
        return this.isMobile;
    }
    
    /**
     * Manually switch to specific frame (for testing/debugging)
     * @param {string} frame - Frame to switch to ('frame1' or 'frame2')
     */
    switchToFrame(frame) {
        if (frame === 'frame1') {
            this.showFrame1();
        } else if (frame === 'frame2') {
            this.showFrame2();
        } else {
            console.warn('Invalid frame specified:', frame);
        }
    }
}

// CSS styles for mobile frame switching
const mobileFrameSwitchingCSS = `
/* Mobile Frame Switching Styles */
@media screen and (max-width: 480px) {
    .mobile-frame-switching .main-content {
        grid-template-columns: 1fr !important;
        height: calc(100vh - 80px - env(safe-area-inset-bottom, 0px)) !important;
        height: calc(100dvh - 80px - env(safe-area-inset-bottom, 0px)) !important;
    }
    
    .mobile-frame-switching .mobile-frame {
        width: 100% !important;
        height: 100% !important;
        max-height: calc(100vh - 80px - env(safe-area-inset-bottom, 0px)) !important;
        max-height: calc(100dvh - 80px - env(safe-area-inset-bottom, 0px)) !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
    }
    
    /* Smooth transitions between frames */
    .mobile-frame {
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out !important;
    }
    
    /* Ensure proper spacing when frame switching */
    .mobile-frame-switching .left-panel {
        padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 140px) !important;
    }
    
    .mobile-frame-switching .right-panel {
        padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 20px) !important;
    }
    
    /* Hide elements that shouldn't be visible during frame switching */
    .mobile-frame-switching .left-panel[style*="display: none"] {
        display: none !important;
    }
    
    .mobile-frame-switching .right-panel[style*="display: none"] {
        display: none !important;
    }
}

/* Frame switching animations */
@keyframes frameSlideIn {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.mobile-frame-switching .mobile-frame {
    animation: frameSlideIn 0.3s ease-out;
}
`;

// Inject CSS styles
function injectMobileFrameSwitchingCSS() {
    const styleElement = document.createElement('style');
    styleElement.id = 'mobile-frame-switching-styles';
    styleElement.textContent = mobileFrameSwitchingCSS;
    document.head.appendChild(styleElement);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS styles
    injectMobileFrameSwitchingCSS();
    
    // Initialize frame switcher
    window.mobileFrameSwitcher = new MobileFrameSwitcher();
    
    console.log('📱 Mobile Frame Switcher initialized');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileFrameSwitcher;
}