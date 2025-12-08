/**
 * Mobile Form Compactor - Ultra-compact form layout for iPhone
 * Ensures all form fields and buttons fit on screen without scrolling
 */

function compactMobileForm() {
    const isMobile = window.innerWidth <= 480 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (!isMobile) {
        console.log('📱 Not mobile device, skipping form compaction');
        return;
    }
    
    console.log('📱 MOBILE FORM COMPACTOR: Starting ultra-compact layout...');
    
    // Get viewport height
    const viewportHeight = window.innerHeight || window.visualViewport?.height || document.documentElement.clientHeight;
    console.log(`📱 Viewport height: ${viewportHeight}px`);
    
    // Calculate available space (viewport - header - buttons)
    const headerHeight = 60; // Approximate header height
    const buttonHeight = 120; // Fixed button area height
    const availableHeight = viewportHeight - headerHeight - buttonHeight;
    
    console.log(`📱 Available height for form: ${availableHeight}px`);
    
    // Get form elements
    const leftPanel = document.querySelector('.left-panel');
    const formGroups = document.querySelectorAll('.form-group');
    const formTitle = leftPanel?.querySelector('h2');
    
    if (!leftPanel || formGroups.length === 0) {
        console.warn('📱 Form elements not found');
        return;
    }
    
    // ULTRA COMPACT: Make form fit in available space with minimal padding
    leftPanel.style.cssText = `
        height: ${availableHeight}px !important;
        max-height: ${availableHeight}px !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 8px 12px 5px 12px !important;
        margin-bottom: 0 !important;
    `;
    
    // Compact title
    if (formTitle) {
        formTitle.style.cssText = `
            font-size: 14px !important;
            margin: 0 0 6px 0 !important;
            padding: 0 0 4px 0 !important;
            border-bottom: 1px solid #ecf0f1 !important;
        `;
    }
    
    // Ultra compact form groups
    formGroups.forEach((group, index) => {
        group.style.cssText = `
            margin-bottom: 4px !important;
            padding: 0 !important;
        `;
        
        // Compact labels
        const label = group.querySelector('label');
        if (label) {
            label.style.cssText = `
                display: block !important;
                margin-bottom: 2px !important;
                font-size: 12px !important;
                font-weight: 600 !important;
                color: #2c3e50 !important;
                line-height: 1.2 !important;
            `;
        }
        
        // Compact inputs
        const input = group.querySelector('input');
        if (input) {
            input.style.cssText = `
                width: 100% !important;
                height: 36px !important;
                padding: 6px 10px !important;
                font-size: 14px !important;
                border: 1px solid #bdc3c7 !important;
                border-radius: 6px !important;
                -webkit-appearance: none !important;
                appearance: none !important;
                background: white !important;
            `;
        }
        
        // Hide error messages initially (they'll show when needed)
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.style.cssText = `
                font-size: 11px !important;
                margin-top: 2px !important;
                line-height: 1.2 !important;
            `;
        }
    });
    
    // HIDE standard form buttons - we only use floating round buttons on mobile
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
        formActions.style.display = 'none !important';
    }
    
    // HIDE panel action buttons (PDF, Print) on mobile
    const panelActions = document.querySelector('.panel-actions');
    if (panelActions) {
        panelActions.style.display = 'none !important';
    }
    
    // Ensure the round floating buttons (nuclear buttons) are visible
    const nuclearButtons = document.getElementById('nuclear-buttons');
    if (nuclearButtons) {
        nuclearButtons.style.cssText = `
            position: fixed !important;
            bottom: 0px !important;
            left: 0px !important;
            right: 0px !important;
            width: 100vw !important;
            height: ${buttonHeight}px !important;
            z-index: 2147483647 !important;
            pointer-events: none !important;
            background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 100%) !important;
            display: flex !important;
            align-items: flex-end !important;
            justify-content: flex-end !important;
            padding: 15px !important;
        `;
    }
    
    // Adjust container to account for fixed buttons - minimal padding
    const container = document.querySelector('.container');
    if (container) {
        container.style.cssText = `
            height: 100vh !important;
            height: 100dvh !important;
            padding: 5px !important;
            padding-bottom: ${buttonHeight}px !important;
            overflow: hidden !important;
        `;
    }
    
    // Adjust main content - maximize space
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.cssText = `
            height: calc(100vh - 70px - ${buttonHeight}px) !important;
            height: calc(100dvh - 70px - ${buttonHeight}px) !important;
            overflow: hidden !important;
            gap: 0 !important;
        `;
    }
    
    // Optimize right panel (Frame 2) spacing
    const rightPanel = document.querySelector('.right-panel');
    if (rightPanel) {
        rightPanel.style.cssText = `
            height: ${availableHeight}px !important;
            max-height: ${availableHeight}px !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            padding: 8px 12px 5px 12px !important;
            margin-bottom: 0 !important;
        `;
    }
    
    console.log('✅ MOBILE FORM COMPACTOR: Ultra-compact layout applied');
    console.log(`📱 Form height: ${availableHeight}px, Button area: ${buttonHeight}px`);
}

// Run on load and resize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', compactMobileForm);
} else {
    compactMobileForm();
}

window.addEventListener('load', compactMobileForm);
window.addEventListener('resize', compactMobileForm);
window.addEventListener('orientationchange', () => {
    setTimeout(compactMobileForm, 300);
});

// Export for debugging
window.compactMobileForm = compactMobileForm;
