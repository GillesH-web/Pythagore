/**
 * InterfaceSwitcher - Manages switching between mobile and desktop interfaces
 * Activates appropriate interface based on device type
 * Handles smooth transitions and state preservation
 */
class InterfaceSwitcher {
    constructor(deviceManager) {
        this.deviceManager = deviceManager;
        this.currentInterface = null;
        this.transitionInProgress = false;
        this.stateSyncManager = null;
        
        // Interface states
        this.interfaces = {
            MOBILE: 'mobile',
            DESKTOP: 'desktop'
        };
        
        this.init();
    }
    
    /**
     * Initialize interface switcher
     */
    init() {
        console.log('🔄 InterfaceSwitcher: Initializing...');
        
        // Determine initial interface based on device
        const deviceType = this.deviceManager.getDeviceType();
        this.currentInterface = (deviceType === 'smartphone' || deviceType === 'tablet') 
            ? this.interfaces.MOBILE 
            : this.interfaces.DESKTOP;
        
        // Activate initial interface
        this.activateInterface(this.currentInterface, false);
        
        // Listen for device changes
        this.deviceManager.onDeviceChange((changeInfo) => {
            this.handleDeviceChange(changeInfo);
        });
        
        console.log(`🔄 InterfaceSwitcher: Initialized with ${this.currentInterface} interface`);
    }
    
    /**
     * Set state sync manager
     * @param {object} stateSyncManager - State synchronization manager
     */
    setStateSyncManager(stateSyncManager) {
        this.stateSyncManager = stateSyncManager;
        console.log('🔄 InterfaceSwitcher: State sync manager connected');
    }
    
    /**
     * Handle device type change
     * @param {object} changeInfo - Device change information
     */
    handleDeviceChange(changeInfo) {
        console.log('🔄 Device changed:', changeInfo);
        
        const { currentType, previousType } = changeInfo;
        
        // Determine new interface
        const newInterface = (currentType === 'smartphone' || currentType === 'tablet')
            ? this.interfaces.MOBILE
            : this.interfaces.DESKTOP;
        
        // Switch interface if needed
        if (newInterface !== this.currentInterface) {
            console.log(`🔄 Switching interface: ${this.currentInterface} → ${newInterface}`);
            this.switchInterface(newInterface);
        }
    }
    
    /**
     * Switch to a different interface
     * @param {string} targetInterface - Target interface ('mobile' or 'desktop')
     */
    switchInterface(targetInterface) {
        if (this.transitionInProgress) {
            console.warn('🔄 Transition already in progress, ignoring switch request');
            return;
        }
        
        if (targetInterface === this.currentInterface) {
            console.log('🔄 Already on target interface, no switch needed');
            return;
        }
        
        this.transitionInProgress = true;
        
        // Preserve current state
        if (this.stateSyncManager) {
            this.stateSyncManager.captureState();
        }
        
        // Deactivate current interface
        this.deactivateInterface(this.currentInterface);
        
        // Activate new interface
        this.activateInterface(targetInterface, true);
        
        // Update current interface
        this.currentInterface = targetInterface;
        
        // Restore state
        if (this.stateSyncManager) {
            this.stateSyncManager.restoreState();
        }
        
        this.transitionInProgress = false;
        
        console.log(`✅ Interface switched to: ${targetInterface}`);
    }
    
    /**
     * Activate an interface
     * @param {string} interfaceType - Interface to activate
     * @param {boolean} animated - Whether to animate the transition
     */
    activateInterface(interfaceType, animated = false) {
        console.log(`🔄 Activating ${interfaceType} interface...`);
        
        if (interfaceType === this.interfaces.MOBILE) {
            this.activateMobileInterface(animated);
        } else {
            this.activateDesktopInterface(animated);
        }
    }
    
    /**
     * Deactivate an interface
     * @param {string} interfaceType - Interface to deactivate
     */
    deactivateInterface(interfaceType) {
        console.log(`🔄 Deactivating ${interfaceType} interface...`);
        
        if (interfaceType === this.interfaces.MOBILE) {
            this.deactivateMobileInterface();
        } else {
            this.deactivateDesktopInterface();
        }
    }
    
    /**
     * Activate mobile interface
     * @param {boolean} animated - Whether to animate
     */
    activateMobileInterface(animated = false) {
        const body = document.body;
        const mainContent = document.querySelector('.main-content');
        const leftPanel = document.querySelector('.left-panel');
        const rightPanel = document.querySelector('.right-panel');
        
        // Add mobile interface class
        body.classList.add('mobile-interface-active');
        body.classList.remove('desktop-interface-active');
        
        if (animated) {
            body.classList.add('interface-transition');
        }
        
        // Apply mobile layout
        if (mainContent) {
            mainContent.style.display = 'flex';
            mainContent.style.flexDirection = 'column';
            mainContent.style.height = 'calc(100vh - 80px - env(safe-area-inset-bottom, 0px))';
            mainContent.style.overflow = 'hidden';
            mainContent.style.gap = '0';
        }
        
        // Mobile-specific panel styling
        if (leftPanel) {
            leftPanel.style.flex = '0 0 auto';
            leftPanel.style.maxHeight = '40vh';
            leftPanel.style.overflowY = 'auto';
            leftPanel.style.webkitOverflowScrolling = 'touch';
            leftPanel.style.padding = '10px';
            leftPanel.style.borderBottom = '3px solid #3498db';
        }
        
        if (rightPanel) {
            rightPanel.style.flex = '1';
            rightPanel.style.display = 'flex';
            rightPanel.style.flexDirection = 'column';
            rightPanel.style.overflow = 'hidden';
            rightPanel.style.padding = '10px';
            rightPanel.style.minHeight = '50vh';
        }
        
        // Hide desktop-specific elements
        this.hideDesktopElements();
        
        // Show mobile-specific elements
        this.showMobileElements();
        
        // Remove animation class after transition
        if (animated) {
            setTimeout(() => {
                body.classList.remove('interface-transition');
            }, 300);
        }
        
        console.log('✅ Mobile interface activated');
    }
    
    /**
     * Activate desktop interface
     * @param {boolean} animated - Whether to animate
     */
    activateDesktopInterface(animated = false) {
        const body = document.body;
        const mainContent = document.querySelector('.main-content');
        const leftPanel = document.querySelector('.left-panel');
        const rightPanel = document.querySelector('.right-panel');
        
        // Add desktop interface class
        body.classList.add('desktop-interface-active');
        body.classList.remove('mobile-interface-active');
        
        if (animated) {
            body.classList.add('interface-transition');
        }
        
        // Apply desktop layout
        if (mainContent) {
            mainContent.style.display = 'grid';
            mainContent.style.gridTemplateColumns = '1fr 2fr';
            mainContent.style.flexDirection = '';
            mainContent.style.height = '';
            mainContent.style.overflow = '';
            mainContent.style.gap = '20px';
        }
        
        // Desktop-specific panel styling
        if (leftPanel) {
            leftPanel.style.flex = '';
            leftPanel.style.maxHeight = '';
            leftPanel.style.overflowY = '';
            leftPanel.style.webkitOverflowScrolling = '';
            leftPanel.style.padding = '';
            leftPanel.style.borderBottom = '';
            leftPanel.style.display = 'flex';
        }
        
        if (rightPanel) {
            rightPanel.style.flex = '';
            rightPanel.style.display = 'flex';
            rightPanel.style.flexDirection = '';
            rightPanel.style.overflow = '';
            rightPanel.style.padding = '';
            rightPanel.style.minHeight = '';
        }
        
        // Show desktop-specific elements
        this.showDesktopElements();
        
        // Hide mobile-specific elements
        this.hideMobileElements();
        
        // Remove animation class after transition
        if (animated) {
            setTimeout(() => {
                body.classList.remove('interface-transition');
            }, 300);
        }
        
        console.log('✅ Desktop interface activated');
    }
    
    /**
     * Deactivate mobile interface
     */
    deactivateMobileInterface() {
        const body = document.body;
        body.classList.remove('mobile-interface-active');
        this.hideMobileElements();
    }
    
    /**
     * Deactivate desktop interface
     */
    deactivateDesktopInterface() {
        const body = document.body;
        body.classList.remove('desktop-interface-active');
        this.hideDesktopElements();
    }
    
    /**
     * Show mobile-specific elements
     */
    showMobileElements() {
        // Show mobile FAB buttons
        const mobileFabContainer = document.getElementById('mobile-fab-container');
        if (mobileFabContainer) {
            mobileFabContainer.style.display = 'block';
        }
        
        // Show nuclear buttons if they exist
        const nuclearButtons = document.getElementById('nuclear-buttons');
        if (nuclearButtons) {
            nuclearButtons.style.display = 'block';
        }
        
        console.log('📱 Mobile elements shown');
    }
    
    /**
     * Hide mobile-specific elements
     */
    hideMobileElements() {
        // Hide mobile FAB buttons
        const mobileFabContainer = document.getElementById('mobile-fab-container');
        if (mobileFabContainer) {
            mobileFabContainer.style.display = 'none';
        }
        
        // DO NOT hide nuclear buttons - they are managed by mobile-frame-switcher.js
        // The nuclear buttons need to remain visible and are controlled by frame switching logic
        
        console.log('📱 Mobile elements hidden (nuclear buttons remain under frame switcher control)');
    }
    
    /**
     * Show desktop-specific elements
     */
    showDesktopElements() {
        // Show desktop form actions
        const formActions = document.querySelector('.form-actions');
        if (formActions) {
            formActions.style.display = 'flex';
        }
        
        // Show panel actions
        const panelActions = document.getElementById('panel-actions');
        if (panelActions) {
            panelActions.style.display = 'flex';
        }
        
        console.log('🖥️ Desktop elements shown');
    }
    
    /**
     * Hide desktop-specific elements
     */
    hideDesktopElements() {
        // Hide desktop form actions (mobile uses FAB buttons instead)
        const formActions = document.querySelector('.form-actions');
        if (formActions) {
            formActions.style.display = 'none';
        }
        
        console.log('🖥️ Desktop elements hidden');
    }
    
    /**
     * Get current interface
     * @returns {string} - Current interface type
     */
    getCurrentInterface() {
        return this.currentInterface;
    }
    
    /**
     * Check if mobile interface is active
     * @returns {boolean}
     */
    isMobileInterface() {
        return this.currentInterface === this.interfaces.MOBILE;
    }
    
    /**
     * Check if desktop interface is active
     * @returns {boolean}
     */
    isDesktopInterface() {
        return this.currentInterface === this.interfaces.DESKTOP;
    }
    
    /**
     * Check if transition is in progress
     * @returns {boolean}
     */
    isTransitioning() {
        return this.transitionInProgress;
    }
    
    /**
     * Force interface switch (for testing)
     * @param {string} interfaceType - Interface to switch to
     */
    forceInterface(interfaceType) {
        if (interfaceType === this.interfaces.MOBILE || interfaceType === this.interfaces.DESKTOP) {
            console.log(`🔄 Forcing interface to: ${interfaceType}`);
            this.switchInterface(interfaceType);
        } else {
            console.warn(`🔄 Invalid interface type: ${interfaceType}`);
        }
    }
    
    /**
     * Get debug information
     * @returns {object} - Debug information
     */
    getDebugInfo() {
        return {
            currentInterface: this.currentInterface,
            transitionInProgress: this.transitionInProgress,
            deviceType: this.deviceManager.getDeviceType(),
            hasStateSyncManager: !!this.stateSyncManager
        };
    }
}

// CSS for interface transitions
const interfaceSwitcherCSS = `
/* Interface transition animations */
.interface-transition {
    transition: all 0.3s ease-in-out !important;
}

.interface-transition * {
    transition: all 0.3s ease-in-out !important;
}

/* Mobile interface styles */
.mobile-interface-active .main-content {
    display: flex !important;
    flex-direction: column !important;
}

.mobile-interface-active .left-panel,
.mobile-interface-active .right-panel {
    width: 100% !important;
}

/* Desktop interface styles */
.desktop-interface-active .main-content {
    display: grid !important;
    grid-template-columns: 1fr 2fr !important;
}

.desktop-interface-active .left-panel,
.desktop-interface-active .right-panel {
    width: auto !important;
}
`;

// Inject CSS
function injectInterfaceSwitcherCSS() {
    const styleElement = document.createElement('style');
    styleElement.id = 'interface-switcher-styles';
    styleElement.textContent = interfaceSwitcherCSS;
    document.head.appendChild(styleElement);
}

// Auto-inject CSS when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectInterfaceSwitcherCSS);
} else {
    injectInterfaceSwitcherCSS();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InterfaceSwitcher;
}
