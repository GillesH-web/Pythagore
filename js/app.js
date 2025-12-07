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
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Numérologie de Pythagore application...');
    
    // Initialize the main form handler which coordinates all other modules
    new FormHandler();
    
    console.log('✅ Application initialized successfully with Output 4 & 5 in Tab 2');
});

// Make switchTab function globally available for onclick handlers
window.switchTab = switchTab;