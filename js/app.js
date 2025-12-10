/**
 * Main Application File - Coordinates all modules and handles global functions
 * Pythagore Numerology Application v1.8.0
 */

console.log('🚀 Numérologie de Pythagore v1.8.0 - Starting with Output 4 & 5');

/**
 * Switches between tabs in the results panel
 * @param {string} tabName - Name of the tab to switch to ('tab1', 'tab2', or 'tab3')
 */
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    document.getElementById(tabName + '-btn').classList.add('active');
    document.getElementById(tabName + '-panel').classList.add('active');
    
    console.log('📋 Switched to ' + tabName);
}

/**
 * Application initialization
 * Runs when the DOM is fully loaded
 */
/**
 * Ensures clean page state on load/refresh - always show Frame 1 with empty form
 */
function initializeCleanPageState() {
    console.log('🔄 Initializing clean page state for Safari refresh bug fix...');
    
    // 1. Clear all form fields
    const form = document.getElementById('client-form');
    if (form) {
        form.reset();
        console.log('✅ Form cleared');
    }
    
    // 2. Clear all error states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
    
    // 3. Hide all results containers
    const resultContainers = ['results-container', 'cycles-container', 'realization-container'];
    resultContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    });
    
    // 4. Show empty states
    const emptyStates = ['empty-state', 'cycles-empty-state', 'realization-empty-state'];
    emptyStates.forEach(stateId => {
        const state = document.getElementById(stateId);
        if (state) {
            state.style.display = 'block';
        }
    });
    
    // 5. Hide client info header
    const clientHeader = document.getElementById('client-info-header');
    if (clientHeader) {
        clientHeader.style.display = 'none';
    }
    
    // 6. Hide panel actions
    const panelActions = document.getElementById('panel-actions');
    if (panelActions) {
        panelActions.style.display = 'none';
    }
    
    // 7. Ensure Tab 1 is active
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    const tab1Btn = document.getElementById('tab1-btn');
    const tab1Panel = document.getElementById('tab1-panel');
    if (tab1Btn) tab1Btn.classList.add('active');
    if (tab1Panel) tab1Panel.classList.add('active');
    
    // 8. For mobile: ensure Frame 1 is visible, Frame 2 is hidden; For desktop: ensure both frames are visible
    const isMobile = window.innerWidth <= 480 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    
    if (leftPanel) {
        leftPanel.style.display = 'flex';
        console.log('📱 Frame 1 (form) forced visible');
    }
    
    if (rightPanel) {
        if (isMobile) {
            rightPanel.style.display = 'none';
            console.log('📱 Frame 2 (results) forced hidden on mobile');
        } else {
            rightPanel.style.display = 'flex';
            console.log('🖥️ Frame 2 (results) forced visible on desktop');
        }
    }
    
    // 9. Disable all calculate buttons
    const calculateButtons = [
        'submit-btn', 
        'mobile-submit-btn', 
        'simple-calculate', 
        'nuclear-calculate'
    ];
    calculateButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.disabled = true;
            if (btnId === 'simple-calculate' || btnId === 'nuclear-calculate') {
                btn.style.background = '#95a5a6';
                btn.style.opacity = '0.7';
            }
        }
    });
    
    console.log('✅ Clean page state initialized - Frame 1 visible with empty form');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Numérologie de Pythagore application...');
    
    // CRITICAL: Initialize clean page state first (Safari refresh bug fix)
    initializeCleanPageState();
    
    // Initialize the main form handler which coordinates all other modules
    window.formHandler = new FormHandler();
    
    console.log('✅ Application initialized successfully with clean state');
});

// Enhanced Safari refresh handling - run on ALL pageshow events
window.addEventListener('pageshow', (event) => {
    console.log('🔄 Pageshow event detected - reinitializing clean state (persisted:', event.persisted, ')');
    // Always run clean state initialization, not just when persisted
    initializeCleanPageState();
});

// Additional Safari refresh event handlers
window.addEventListener('focus', () => {
    console.log('🔄 Window focus detected - ensuring clean state');
    setTimeout(initializeCleanPageState, 100);
});

window.addEventListener('popstate', () => {
    console.log('🔄 Popstate detected - ensuring clean state');
    initializeCleanPageState();
});

// Make switchTab function globally available for onclick handlers
window.switchTab = switchTab;