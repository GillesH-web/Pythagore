/**
 * DeviceDetectionManager - Manages device type detection and monitoring
 * Detects smartphone, tablet, and desktop devices based on viewport, user agent, and touch capabilities
 * Provides event-driven notifications for device changes
 */
class DeviceDetectionManager {
    constructor() {
        this.deviceType = null;
        this.previousDeviceType = null;
        this.listeners = [];
        this.storageKey = 'numerologie_device_preference';
        
        // Device detection criteria
        this.criteria = {
            smartphone: {
                maxWidth: 480,
                userAgents: /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i,
                minTouchPoints: 1
            },
            tablet: {
                minWidth: 481,
                maxWidth: 1024,
                userAgents: /iPad|Android(?!.*Mobile)/i,
                minTouchPoints: 1
            },
            desktop: {
                minWidth: 1025,
                maxTouchPoints: 0
            }
        };
        
        this.init();
    }
    
    /**
     * Initialize device detection
     */
    init() {
        console.log('📱 DeviceDetectionManager: Initializing...');
        
        // Detect initial device type
        this.deviceType = this.detectDevice();
        this.previousDeviceType = this.deviceType;
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load saved preference if exists
        this.loadDevicePreference();
        
        console.log(`📱 DeviceDetectionManager: Initialized - Device Type: ${this.deviceType}`);
    }
    
    /**
     * Detect current device type
     * @returns {string} - 'smartphone', 'tablet', or 'desktop'
     */
    detectDevice() {
        const width = window.innerWidth;
        const userAgent = navigator.userAgent;
        const touchPoints = navigator.maxTouchPoints || 0;
        const hasTouch = 'ontouchstart' in window || touchPoints > 0;
        
        console.log(`📱 Detection - Width: ${width}px, Touch Points: ${touchPoints}, Has Touch: ${hasTouch}`);
        
        // Check for smartphone
        if (this.isSmartphone(width, userAgent, touchPoints, hasTouch)) {
            return 'smartphone';
        }
        
        // Check for tablet
        if (this.isTablet(width, userAgent, touchPoints, hasTouch)) {
            return 'tablet';
        }
        
        // Default to desktop
        return 'desktop';
    }
    
    /**
     * Check if device is a smartphone
     * @param {number} width - Viewport width
     * @param {string} userAgent - User agent string
     * @param {number} touchPoints - Number of touch points
     * @param {boolean} hasTouch - Has touch capability
     * @returns {boolean}
     */
    isSmartphone(width = window.innerWidth, userAgent = navigator.userAgent, touchPoints = navigator.maxTouchPoints, hasTouch = 'ontouchstart' in window) {
        const criteria = this.criteria.smartphone;
        
        // Check viewport width
        const isSmallScreen = width <= criteria.maxWidth;
        
        // Check user agent
        const isSmartphoneUA = criteria.userAgents.test(userAgent);
        
        // Check touch capability
        const hasTouchCapability = hasTouch && touchPoints >= criteria.minTouchPoints;
        
        // Smartphone if small screen OR (smartphone UA AND touch)
        return isSmallScreen || (isSmartphoneUA && hasTouchCapability);
    }
    
    /**
     * Check if device is a tablet
     * @param {number} width - Viewport width
     * @param {string} userAgent - User agent string
     * @param {number} touchPoints - Number of touch points
     * @param {boolean} hasTouch - Has touch capability
     * @returns {boolean}
     */
    isTablet(width = window.innerWidth, userAgent = navigator.userAgent, touchPoints = navigator.maxTouchPoints, hasTouch = 'ontouchstart' in window) {
        const criteria = this.criteria.tablet;
        
        // Check viewport width
        const isMediumScreen = width >= criteria.minWidth && width <= criteria.maxWidth;
        
        // Check user agent
        const isTabletUA = criteria.userAgents.test(userAgent);
        
        // Check touch capability
        const hasTouchCapability = hasTouch && touchPoints >= criteria.minTouchPoints;
        
        // Tablet if medium screen with touch OR tablet UA with touch
        return (isMediumScreen && hasTouchCapability) || (isTabletUA && hasTouchCapability);
    }
    
    /**
     * Check if device is a desktop
     * @returns {boolean}
     */
    isDesktop() {
        return this.deviceType === 'desktop';
    }
    
    /**
     * Get current device type
     * @returns {string} - 'smartphone', 'tablet', or 'desktop'
     */
    getDeviceType() {
        return this.deviceType;
    }
    
    /**
     * Get viewport information
     * @returns {object} - Viewport details
     */
    getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: this.getOrientation(),
            aspectRatio: (window.innerWidth / window.innerHeight).toFixed(2)
        };
    }
    
    /**
     * Get device orientation
     * @returns {string} - 'portrait' or 'landscape'
     */
    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
    
    /**
     * Get device capabilities
     * @returns {object} - Device capabilities
     */
    getCapabilities() {
        return {
            touch: 'ontouchstart' in window,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            hover: window.matchMedia('(hover: hover)').matches,
            pointer: window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine',
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }
    
    /**
     * Get browser information
     * @returns {object} - Browser details
     */
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        
        return {
            userAgent: userAgent,
            isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
            isChrome: /Chrome/.test(userAgent),
            isFirefox: /Firefox/.test(userAgent),
            isEdge: /Edg/.test(userAgent),
            isIOS: /iPhone|iPad|iPod/.test(userAgent),
            isAndroid: /Android/.test(userAgent)
        };
    }
    
    /**
     * Get complete device state
     * @returns {object} - Complete device state
     */
    getDeviceState() {
        return {
            type: this.deviceType,
            viewport: this.getViewportInfo(),
            capabilities: this.getCapabilities(),
            browser: this.getBrowserInfo()
        };
    }
    
    /**
     * Set up event listeners for device changes
     */
    setupEventListeners() {
        // Listen for window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Listen for orientation change
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
        
        // Listen for visibility change (tab switching)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        console.log('📱 DeviceDetectionManager: Event listeners set up');
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.checkDeviceChange();
        }, 250);
    }
    
    /**
     * Handle orientation change
     */
    handleOrientationChange() {
        // Delay to allow viewport to update
        setTimeout(() => {
            console.log(`📱 Orientation changed to: ${this.getOrientation()}`);
            this.checkDeviceChange();
        }, 100);
    }
    
    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (!document.hidden) {
            // Re-check device when tab becomes visible
            this.checkDeviceChange();
        }
    }
    
    /**
     * Check if device type has changed
     */
    checkDeviceChange() {
        const newDeviceType = this.detectDevice();
        
        if (newDeviceType !== this.deviceType) {
            console.log(`📱 Device type changed: ${this.deviceType} → ${newDeviceType}`);
            
            this.previousDeviceType = this.deviceType;
            this.deviceType = newDeviceType;
            
            // Save preference
            this.saveDevicePreference();
            
            // Notify listeners
            this.notifyListeners({
                previousType: this.previousDeviceType,
                currentType: this.deviceType,
                viewport: this.getViewportInfo()
            });
        }
    }
    
    /**
     * Register a callback for device changes
     * @param {function} callback - Callback function
     */
    onDeviceChange(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
            console.log(`📱 DeviceDetectionManager: Listener registered (${this.listeners.length} total)`);
        }
    }
    
    /**
     * Unregister a callback
     * @param {function} callback - Callback function to remove
     */
    offDeviceChange(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
            console.log(`📱 DeviceDetectionManager: Listener removed (${this.listeners.length} remaining)`);
        }
    }
    
    /**
     * Notify all listeners of device change
     * @param {object} changeInfo - Change information
     */
    notifyListeners(changeInfo) {
        console.log(`📱 DeviceDetectionManager: Notifying ${this.listeners.length} listeners`);
        
        this.listeners.forEach(callback => {
            try {
                callback(changeInfo);
            } catch (error) {
                console.error('📱 Error in device change listener:', error);
            }
        });
    }
    
    /**
     * Save device preference to localStorage
     */
    saveDevicePreference() {
        try {
            const preference = {
                deviceType: this.deviceType,
                timestamp: Date.now(),
                viewport: this.getViewportInfo()
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(preference));
            console.log('📱 Device preference saved:', preference);
        } catch (error) {
            console.warn('📱 Could not save device preference:', error);
        }
    }
    
    /**
     * Load device preference from localStorage
     */
    loadDevicePreference() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const preference = JSON.parse(saved);
                console.log('📱 Loaded device preference:', preference);
                
                // Check if preference is recent (within 1 hour)
                const age = Date.now() - preference.timestamp;
                if (age < 3600000) { // 1 hour
                    console.log('📱 Using saved device preference');
                    return preference;
                }
            }
        } catch (error) {
            console.warn('📱 Could not load device preference:', error);
        }
        return null;
    }
    
    /**
     * Force device type (for testing)
     * @param {string} type - Device type to force
     */
    forceDeviceType(type) {
        if (['smartphone', 'tablet', 'desktop'].includes(type)) {
            console.log(`📱 Forcing device type to: ${type}`);
            this.previousDeviceType = this.deviceType;
            this.deviceType = type;
            this.saveDevicePreference();
            this.notifyListeners({
                previousType: this.previousDeviceType,
                currentType: this.deviceType,
                forced: true
            });
        } else {
            console.warn(`📱 Invalid device type: ${type}`);
        }
    }
    
    /**
     * Reset to auto-detection
     */
    resetDetection() {
        console.log('📱 Resetting to auto-detection');
        localStorage.removeItem(this.storageKey);
        this.checkDeviceChange();
    }
    
    /**
     * Get debug information
     * @returns {object} - Debug information
     */
    getDebugInfo() {
        return {
            deviceType: this.deviceType,
            previousDeviceType: this.previousDeviceType,
            viewport: this.getViewportInfo(),
            capabilities: this.getCapabilities(),
            browser: this.getBrowserInfo(),
            listeners: this.listeners.length,
            criteria: this.criteria
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceDetectionManager;
}
