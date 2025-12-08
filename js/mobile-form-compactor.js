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
    
    // ULTRA COMPACT: Make form fit in available space
    leftPanel.style.cssText = `
        height: ${availableHeight}px !important;
        max-height: ${availableHeight}px !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 8px 12px !important;
        padding-bottom: 10px !important;
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
    
    // Ensure buttons are always visible and fixed
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
        formActions.style.cssText = `
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            height: ${buttonHeight}px !important;
            padding: 12px !important;
            margin: 0 !important;
            background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 20%) !important;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.15) !important;
            z-index: 10000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
        `;
        
        // Ensure buttons are visible and touchable
        const buttons = formActions.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.cssText = `
                flex: 1 !important;
                max-width: 160px !important;
                height: 50px !important;
                font-size: 15px !important;
                font-weight: 700 !important;
                border-radius: 10px !important;
                border: 2px solid transparent !important;
                cursor: pointer !important;
                -webkit-tap-highlight-color: transparent !important;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            `;
            
            // Style specific button types
            if (btn.classList.contains('btn-primary')) {
                btn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%) !important';
                btn.style.color = 'white !important';
                btn.style.borderColor = '#1e8449 !important';
            } else if (btn.classList.contains('btn-secondary')) {
                btn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important';
                btn.style.color = 'white !important';
                btn.style.borderColor = '#a93226 !important';
            }
        });
    }
    
    // Adjust container to account for fixed buttons
    const container = document.querySelector('.container');
    if (container) {
        container.style.cssText = `
            height: 100vh !important;
            height: 100dvh !important;
            padding: 5px !important;
            padding-bottom: ${buttonHeight + 10}px !important;
            overflow: hidden !important;
        `;
    }
    
    // Adjust main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.cssText = `
            height: calc(100vh - 70px - ${buttonHeight}px) !important;
            height: calc(100dvh - 70px - ${buttonHeight}px) !important;
            overflow: hidden !important;
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
