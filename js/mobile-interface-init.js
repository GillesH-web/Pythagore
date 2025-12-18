/**
 * Mobile Interface Initialization
 * Integrates all mobile interface components and initializes the system
 * Connects DeviceDetectionManager, InterfaceSwitcher, MobileFrameController, and StateSyncManager
 */

// Global mobile interface system
window.mobileInterfaceSystem = {
    deviceManager: null,
    interfaceSwitcher: null,
    frameController: null,
    stateSyncManager: null,
    initialized: false
};

/**
 * Initialize the mobile interface system
 */
function initializeMobileInterface() {
    console.log('🚀 Initializing Mobile Interface System...');
    
    try {
        // 1. Initialize Device Detection Manager
        console.log('📱 Step 1: Initializing Device Detection Manager...');
        window.mobileInterfaceSystem.deviceManager = new DeviceDetectionManager();
        
        // 2. Initialize State Sync Manager
        console.log('💾 Step 2: Initializing State Sync Manager...');
        window.mobileInterfaceSystem.stateSyncManager = new StateSyncManager();
        
        // 3. Initialize Interface Switcher
        console.log('🔄 Step 3: Initializing Interface Switcher...');
        window.mobileInterfaceSystem.interfaceSwitcher = new InterfaceSwitcher(
            window.mobileInterfaceSystem.deviceManager
        );
        
        // Connect state sync manager to interface switcher
        window.mobileInterfaceSystem.interfaceSwitcher.setStateSyncManager(
            window.mobileInterfaceSystem.stateSyncManager
        );
        
        // 4. Initialize Mobile Frame Controller (only for mobile devices)
        const deviceType = window.mobileInterfaceSystem.deviceManager.getDeviceType();
        if (deviceType === 'smartphone' || deviceType === 'tablet') {
            console.log('📱 Step 4: Initializing Mobile Frame Controller...');
            window.mobileInterfaceSystem.frameController = new MobileFrameController();
        } else {
            console.log('🖥️ Step 4: Skipping Mobile Frame Controller (desktop device)');
        }
        
        // 5. Restore saved state
        console.log('💾 Step 5: Restoring saved state...');
        window.mobileInterfaceSystem.stateSyncManager.restoreState();
        
        // 6. Set up global event listeners
        setupGlobalEventListeners();
        
        // Mark as initialized
        window.mobileInterfaceSystem.initialized = true;
        
        console.log('✅ Mobile Interface System initialized successfully!');
        console.log('📊 System Status:', getMobileInterfaceStatus());
        
        // Expose debug functions to window
        window.debugMobileInterface = debugMobileInterface;
        window.getMobileInterfaceStatus = getMobileInterfaceStatus;
        
    } catch (error) {
        console.error('❌ Failed to initialize Mobile Interface System:', error);
        throw error;
    }
}

/**
 * Set up global event listeners
 */
function setupGlobalEventListeners() {
    console.log('🎧 Setting up global event listeners...');
    
    // Listen for device changes
    if (window.mobileInterfaceSystem.deviceManager) {
        window.mobileInterfaceSystem.deviceManager.onDeviceChange((changeInfo) => {
            console.log('📱 Device changed:', changeInfo);
            
            // Update frame controller if needed
            const { currentType, previousType } = changeInfo;
            
            // Initialize or destroy frame controller based on device type
            if ((currentType === 'smartphone' || currentType === 'tablet') && !window.mobileInterfaceSystem.frameController) {
                console.log('📱 Creating Mobile Frame Controller for mobile device');
                window.mobileInterfaceSystem.frameController = new MobileFrameController();
            } else if (currentType === 'desktop' && window.mobileInterfaceSystem.frameController) {
                console.log('🖥️ Mobile device switched to desktop - frame controller still available');
            }
        });
    }
    
    // Listen for form submissions
    const form = document.getElementById('client-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            console.log('📝 Form submitted - capturing state');
            if (window.mobileInterfaceSystem.stateSyncManager) {
                window.mobileInterfaceSystem.stateSyncManager.captureState();
            }
        });
    }
    
    // Listen for reset button
    document.addEventListener('click', (event) => {
        const resetBtn = event.target.closest('#reset-btn, #mobile-reset-btn, #nuclear-reset');
        if (resetBtn) {
            // FRAME STATE PRESERVATION: Skip reset if PDF generation is in progress
            if (window.pdfGenerationInProgress) {
                console.log('🔒 Reset blocked - PDF generation in progress');
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            
            console.log('🔄 Reset button clicked - clearing state');
            if (window.mobileInterfaceSystem.stateSyncManager) {
                // Don't clear state immediately, just capture current empty state
                setTimeout(() => {
                    window.mobileInterfaceSystem.stateSyncManager.captureState();
                }, 100);
            }
        }
    });
    
    console.log('✅ Global event listeners set up');
}

/**
 * Get mobile interface system status
 * @returns {object} - System status
 */
function getMobileInterfaceStatus() {
    const system = window.mobileInterfaceSystem;
    
    if (!system.initialized) {
        return { initialized: false, message: 'System not initialized' };
    }
    
    return {
        initialized: true,
        deviceType: system.deviceManager?.getDeviceType(),
        currentInterface: system.interfaceSwitcher?.getCurrentInterface(),
        currentFrame: system.frameController?.getCurrentFrame(),
        hasResults: system.stateSyncManager?.isCalculated(),
        activeTab: system.stateSyncManager?.getActiveTab(),
        viewport: system.deviceManager?.getViewportInfo(),
        capabilities: system.deviceManager?.getCapabilities()
    };
}

/**
 * Debug mobile interface system
 */
function debugMobileInterface() {
    console.log('🔍 Mobile Interface System Debug Info:');
    console.log('=====================================');
    
    const system = window.mobileInterfaceSystem;
    
    if (!system.initialized) {
        console.log('❌ System not initialized');
        return;
    }
    
    console.log('📱 Device Manager:', system.deviceManager?.getDebugInfo());
    console.log('🔄 Interface Switcher:', system.interfaceSwitcher?.getDebugInfo());
    console.log('📱 Frame Controller:', system.frameController?.getDebugInfo());
    console.log('💾 State Sync Manager:', system.stateSyncManager?.getDebugInfo());
    console.log('📊 System Status:', getMobileInterfaceStatus());
    
    console.log('=====================================');
}

/**
 * Force interface switch (for testing)
 * @param {string} interfaceType - 'mobile' or 'desktop'
 */
function forceInterface(interfaceType) {
    if (window.mobileInterfaceSystem.interfaceSwitcher) {
        window.mobileInterfaceSystem.interfaceSwitcher.forceInterface(interfaceType);
    } else {
        console.warn('Interface switcher not initialized');
    }
}

/**
 * Force frame switch (for testing)
 * @param {string} frame - 'form' or 'results'
 */
function forceFrame(frame) {
    if (window.mobileInterfaceSystem.frameController) {
        window.mobileInterfaceSystem.frameController.forceFrame(frame);
    } else {
        console.warn('Frame controller not initialized or not available on desktop');
    }
}

/**
 * Force device type (for testing)
 * @param {string} deviceType - 'smartphone', 'tablet', or 'desktop'
 */
function forceDeviceType(deviceType) {
    if (window.mobileInterfaceSystem.deviceManager) {
        window.mobileInterfaceSystem.deviceManager.forceDeviceType(deviceType);
    } else {
        console.warn('Device manager not initialized');
    }
}

// Expose testing functions
window.forceInterface = forceInterface;
window.forceFrame = forceFrame;
window.forceDeviceType = forceDeviceType;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileInterface);
} else {
    // DOM already loaded
    initializeMobileInterface();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (!window.mobileInterfaceSystem.initialized) {
        console.log('🔄 Initializing mobile interface on window load...');
        initializeMobileInterface();
    }
});

console.log('📱 Mobile Interface Init script loaded');
