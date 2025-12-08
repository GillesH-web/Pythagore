/**
 * StateSyncManager - Manages application state synchronization
 * Preserves form data and results during interface/frame switches
 * Ensures seamless transitions without data loss
 */
class StateSyncManager {
    constructor() {
        this.state = {
            formData: {},
            resultsData: {},
            activeTab: 1,
            calculated: false
        };
        
        this.storageKey = 'numerologie_app_state';
        
        this.init();
    }
    
    /**
     * Initialize state sync manager
     */
    init() {
        console.log('💾 StateSyncManager: Initializing...');
        
        // Load saved state if exists
        this.loadState();
        
        // Set up auto-save on form changes
        this.setupAutoSave();
        
        console.log('💾 StateSyncManager: Initialized');
    }
    
    /**
     * Set up automatic state saving
     */
    setupAutoSave() {
        // Listen for form input changes
        const form = document.getElementById('client-form');
        if (form) {
            form.addEventListener('input', () => {
                this.captureFormState();
                this.saveState();
            });
        }
        
        // Listen for tab changes
        document.addEventListener('click', (event) => {
            const tabBtn = event.target.closest('.tab-btn');
            if (tabBtn) {
                const tabId = tabBtn.id.replace('-btn', '').replace('tab', '');
                this.state.activeTab = parseInt(tabId) || 1;
                this.saveState();
            }
        });
        
        console.log('💾 Auto-save enabled');
    }
    
    /**
     * Capture complete application state
     */
    captureState() {
        console.log('💾 Capturing complete state...');
        this.captureFormState();
        this.captureResultsState();
        this.saveState();
    }
    
    /**
     * Capture form state
     */
    captureFormState() {
        const formData = {
            firstName1: this.getInputValue('firstName1'),
            firstName2: this.getInputValue('firstName2'),
            firstName3: this.getInputValue('firstName3'),
            lastName: this.getInputValue('lastName'),
            birthDate: this.getInputValue('birthDate')
        };
        
        this.state.formData = formData;
        console.log('💾 Form state captured:', formData);
    }
    
    /**
     * Capture results state
     */
    captureResultsState() {
        // Check if results are displayed
        const resultsContainer = document.getElementById('results-container');
        const calculated = resultsContainer && resultsContainer.style.display !== 'none';
        
        // Get active tab
        const activeTabBtn = document.querySelector('.tab-btn.active');
        const activeTab = activeTabBtn ? parseInt(activeTabBtn.id.replace('tab', '').replace('-btn', '')) : 1;
        
        // Capture results HTML (if exists)
        const resultsHTML = resultsContainer ? resultsContainer.innerHTML : '';
        const cyclesHTML = document.getElementById('cycles-container')?.innerHTML || '';
        const realizationHTML = document.getElementById('realization-container')?.innerHTML || '';
        
        this.state.resultsData = {
            calculated,
            activeTab,
            resultsHTML,
            cyclesHTML,
            realizationHTML
        };
        
        this.state.calculated = calculated;
        this.state.activeTab = activeTab;
        
        console.log('💾 Results state captured:', { calculated, activeTab });
    }
    
    /**
     * Restore complete application state
     */
    restoreState() {
        console.log('💾 Restoring complete state...');
        this.restoreFormState();
        this.restoreResultsState();
    }
    
    /**
     * Restore form state
     */
    restoreFormState() {
        const { formData } = this.state;
        
        if (formData && Object.keys(formData).length > 0) {
            this.setInputValue('firstName1', formData.firstName1);
            this.setInputValue('firstName2', formData.firstName2);
            this.setInputValue('firstName3', formData.firstName3);
            this.setInputValue('lastName', formData.lastName);
            this.setInputValue('birthDate', formData.birthDate);
            
            console.log('💾 Form state restored');
        }
    }
    
    /**
     * Restore results state
     */
    restoreResultsState() {
        const { resultsData } = this.state;
        
        if (resultsData && resultsData.calculated) {
            // Restore results HTML
            if (resultsData.resultsHTML) {
                const resultsContainer = document.getElementById('results-container');
                if (resultsContainer) {
                    resultsContainer.innerHTML = resultsData.resultsHTML;
                    resultsContainer.style.display = 'grid';
                }
            }
            
            // Restore cycles HTML
            if (resultsData.cyclesHTML) {
                const cyclesContainer = document.getElementById('cycles-container');
                if (cyclesContainer) {
                    cyclesContainer.innerHTML = resultsData.cyclesHTML;
                    cyclesContainer.style.display = 'grid';
                }
            }
            
            // Restore realization HTML
            if (resultsData.realizationHTML) {
                const realizationContainer = document.getElementById('realization-container');
                if (realizationContainer) {
                    realizationContainer.innerHTML = resultsData.realizationHTML;
                    realizationContainer.style.display = 'grid';
                }
            }
            
            // Hide empty states
            const emptyStates = document.querySelectorAll('.empty-state');
            emptyStates.forEach(state => state.style.display = 'none');
            
            // Show panel actions
            const panelActions = document.getElementById('panel-actions');
            if (panelActions) {
                panelActions.style.display = 'flex';
            }
            
            // Restore active tab
            if (resultsData.activeTab) {
                this.switchToTab(resultsData.activeTab);
            }
            
            console.log('💾 Results state restored');
        }
    }
    
    /**
     * Switch to specific tab
     * @param {number} tabNumber - Tab number (1, 2, or 3)
     */
    switchToTab(tabNumber) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Add active class to target tab
        const tabBtn = document.getElementById(`tab${tabNumber}-btn`);
        const tabPanel = document.getElementById(`tab${tabNumber}-panel`);
        
        if (tabBtn) tabBtn.classList.add('active');
        if (tabPanel) tabPanel.classList.add('active');
    }
    
    /**
     * Get input value
     * @param {string} id - Input element ID
     * @returns {string} - Input value
     */
    getInputValue(id) {
        const input = document.getElementById(id);
        return input ? input.value : '';
    }
    
    /**
     * Set input value
     * @param {string} id - Input element ID
     * @param {string} value - Value to set
     */
    setInputValue(id, value) {
        const input = document.getElementById(id);
        if (input && value) {
            input.value = value;
        }
    }
    
    /**
     * Save state to localStorage
     */
    saveState() {
        try {
            const stateToSave = {
                ...this.state,
                timestamp: Date.now()
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(stateToSave));
            console.log('💾 State saved to localStorage');
        } catch (error) {
            console.warn('💾 Could not save state:', error);
        }
    }
    
    /**
     * Load state from localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const loadedState = JSON.parse(saved);
                
                // Check if state is recent (within 24 hours)
                const age = Date.now() - (loadedState.timestamp || 0);
                if (age < 86400000) { // 24 hours
                    this.state = loadedState;
                    console.log('💾 State loaded from localStorage');
                    return true;
                } else {
                    console.log('💾 Saved state is too old, ignoring');
                }
            }
        } catch (error) {
            console.warn('💾 Could not load state:', error);
        }
        return false;
    }
    
    /**
     * Clear saved state
     */
    clearState() {
        this.state = {
            formData: {},
            resultsData: {},
            activeTab: 1,
            calculated: false
        };
        
        try {
            localStorage.removeItem(this.storageKey);
            console.log('💾 State cleared');
        } catch (error) {
            console.warn('💾 Could not clear state:', error);
        }
    }
    
    /**
     * Get current state
     * @returns {object} - Current state
     */
    getState() {
        return { ...this.state };
    }
    
    /**
     * Check if results are calculated
     * @returns {boolean}
     */
    isCalculated() {
        return this.state.calculated;
    }
    
    /**
     * Get active tab
     * @returns {number} - Active tab number
     */
    getActiveTab() {
        return this.state.activeTab;
    }
    
    /**
     * Get debug information
     * @returns {object} - Debug information
     */
    getDebugInfo() {
        return {
            state: this.getState(),
            storageKey: this.storageKey,
            hasFormData: Object.keys(this.state.formData).length > 0,
            hasResultsData: Object.keys(this.state.resultsData).length > 0,
            calculated: this.state.calculated,
            activeTab: this.state.activeTab
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateSyncManager;
}
