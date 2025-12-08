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
        
        // Listen for form reset (switch to form)
        document.addEventListener('click', (event) => {
            const resetBtn = event.target.closest('#reset-btn, #mobile-reset-btn, #nuclear-reset');
            if (resetBtn) {
                console.log('📱 Reset clicked - switching to form frame');
                this.showFrame1();
            }
        });
        
        // NOTE: Frame switching to results is handled by the 'formSubmitted' event above
        // We don't need to listen for Calculate button clicks because the form submission
        // event is dispatched after successful validation and calculation
        
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
            // AGGRESSIVELY show form, hide results
            this.leftPanel.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
            this.rightPanel.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
            
            // Update main content layout for single column
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.gridTemplateColumns = '1fr';
                mainContent.classList.add('mobile-frame-switching');
            }
            
            // Show both Calculate and Reset buttons in Frame 1
            const calculateBtn = document.getElementById('nuclear-calculate');
            const resetBtn = document.getElementById('nuclear-reset');
            if (calculateBtn) {
                calculateBtn.style.display = 'block !important';
                calculateBtn.style.visibility = 'visible !important';
                calculateBtn.style.opacity = '1 !important';
                calculateBtn.style.pointerEvents = 'auto !important';
                calculateBtn.style.position = 'absolute !important';
                calculateBtn.style.right = '20px !important';
                calculateBtn.style.bottom = '20px !important';
            }
            if (resetBtn) {
                resetBtn.style.display = 'block !important';
                resetBtn.style.visibility = 'visible !important';
                resetBtn.style.opacity = '1 !important';
                resetBtn.style.pointerEvents = 'auto !important';
                resetBtn.style.position = 'absolute !important';
                resetBtn.style.right = '104px !important';
                resetBtn.style.bottom = '20px !important';
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log('📱 Frame 1 (form) displayed - both buttons visible');
        }
    }
    
    /**
     * Show only frame2 (results)
     */
    showFrame2() {
        if (!this.isMobile) return;
        
        this.currentFrame = 'frame2';
        
        if (this.leftPanel && this.rightPanel) {
            // AGGRESSIVELY hide form, show results
            this.leftPanel.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
            this.rightPanel.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
            
            // Update main content layout for single column
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.style.gridTemplateColumns = '1fr';
                mainContent.classList.add('mobile-frame-switching');
            }
            
            // In Frame 2: Hide Calculate button, show ONLY Reset button with same styling as Frame 1
            const calculateBtn = document.getElementById('nuclear-calculate');
            const resetBtn = document.getElementById('nuclear-reset');
            if (calculateBtn) {
                calculateBtn.style.display = 'none !important';
                calculateBtn.style.visibility = 'hidden !important';
                calculateBtn.style.opacity = '0 !important';
                calculateBtn.style.pointerEvents = 'none !important';
            }
            if (resetBtn) {
                // CENTER the Reset button in Frame 2 for maximum visibility
                resetBtn.style.display = 'block !important';
                resetBtn.style.visibility = 'visible !important';
                resetBtn.style.opacity = '1 !important';
                resetBtn.style.pointerEvents = 'auto !important';
                resetBtn.style.position = 'fixed !important';
                resetBtn.style.left = '50% !important';
                resetBtn.style.bottom = '20px !important';
                resetBtn.style.transform = 'translateX(-50%) translateZ(0) !important';
                resetBtn.style.webkitTransform = 'translateX(-50%) translateZ(0) !important';
                resetBtn.style.width = '72px !important';
                resetBtn.style.height = '72px !important';
                resetBtn.style.borderRadius = '50% !important';
                resetBtn.style.border = '4px solid #ffffff !important';
                resetBtn.style.background = '#e74c3c !important';
                resetBtn.style.color = '#ffffff !important';
                resetBtn.style.fontSize = '12px !important';
                resetBtn.style.fontWeight = '900 !important';
                resetBtn.style.textAlign = 'center !important';
                resetBtn.style.lineHeight = '1.2 !important';
                resetBtn.style.boxShadow = '0 12px 40px rgba(0,0,0,0.9) !important';
                resetBtn.style.cursor = 'pointer !important';
                resetBtn.style.zIndex = '2147483648 !important';
                resetBtn.style.webkitTapHighlightColor = 'transparent !important';
                resetBtn.style.webkitAppearance = 'none !important';
                resetBtn.style.appearance = 'none !important';
                resetBtn.style.willChange = 'transform !important';
                resetBtn.style.margin = '0 !important';
                console.log('📱 Reset button CENTERED for Frame 2');
            }
            
            // AGGRESSIVELY ensure nuclear container is visible and positioned correctly
            const nuclearContainer = document.getElementById('nuclear-buttons');
            if (nuclearContainer) {
                nuclearContainer.style.cssText = `
                    position: fixed !important;
                    bottom: 0px !important;
                    left: 0px !important;
                    right: 0px !important;
                    width: 100vw !important;
                    height: 120px !important;
                    z-index: 2147483647 !important;
                    pointer-events: none !important;
                    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%) !important;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                `;
                console.log('📱 Nuclear container forced visible in Frame 2');
            }
            
            // Double-check Reset button is visible after a short delay
            setTimeout(() => {
                const resetBtnCheck = document.getElementById('nuclear-reset');
                if (resetBtnCheck) {
                    resetBtnCheck.style.display = 'block !important';
                    resetBtnCheck.style.visibility = 'visible !important';
                    resetBtnCheck.style.opacity = '1 !important';
                    resetBtnCheck.style.zIndex = '2147483647 !important';
                    console.log('📱 Reset button double-checked and forced visible');
                }
            }, 100);
            
            // Scroll to top to show results
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log('📱 Frame 2 (results) displayed - only Reset button visible');
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