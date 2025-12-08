/**
 * Auto-Versioning System for Numérologie de Pythagore
 * Automatically updates version numbers and timestamps
 */

class VersionManager {
    constructor() {
        this.currentVersion = '1.9.1';
        this.buildTimestamp = '2025-12-08 10:49';
        this.init();
    }

    init() {
        // Update version display on page load
        this.updateVersionDisplay();
        
        // Set up automatic versioning on changes
        this.setupAutoVersioning();
        
        // Log version info
        console.log(`🔢 Numérologie de Pythagore ${this.currentVersion}`);
        console.log(`🕒 Build: ${this.buildTimestamp}`);
    }

    updateVersionDisplay() {
        // Update version in header
        const versionElement = document.getElementById('app-version');
        if (versionElement) {
            versionElement.textContent = `v${this.currentVersion}`;
        }

        // Update build info
        const buildInfoElement = document.getElementById('build-info');
        if (buildInfoElement) {
            buildInfoElement.textContent = `Build: ${this.buildTimestamp}`;
        }

        // Update page title
        document.title = `Numérologie de Pythagore v${this.currentVersion}`;
    }

    getCurrentTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    incrementVersion(type = 'patch') {
        const versionParts = this.currentVersion.split('.').map(Number);
        
        switch (type) {
            case 'major':
                versionParts[0]++;
                versionParts[1] = 0;
                versionParts[2] = 0;
                break;
            case 'minor':
                versionParts[1]++;
                versionParts[2] = 0;
                break;
            case 'patch':
            default:
                versionParts[2]++;
                break;
        }
        
        this.currentVersion = versionParts.join('.');
        this.buildTimestamp = this.getCurrentTimestamp();
        
        // Update display
        this.updateVersionDisplay();
        
        // Log the change
        console.log(`📈 Version updated to ${this.currentVersion} at ${this.buildTimestamp}`);
        
        return this.currentVersion;
    }

    setupAutoVersioning() {
        // Track form submissions as version-worthy changes
        const form = document.getElementById('client-form');
        if (form) {
            let calculationCount = 0;
            form.addEventListener('submit', () => {
                calculationCount++;
                if (calculationCount % 5 === 0) {
                    // Increment patch version every 5 calculations
                    this.incrementVersion('patch');
                }
            });
        }

        // Track tab switches as minor interactions
        const tabButtons = document.querySelectorAll('.tab-btn');
        let tabSwitchCount = 0;
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabSwitchCount++;
                // Update timestamp on significant interactions
                if (tabSwitchCount % 10 === 0) {
                    this.buildTimestamp = this.getCurrentTimestamp();
                    this.updateVersionDisplay();
                }
            });
        });
    }

    getVersionInfo() {
        return {
            version: this.currentVersion,
            timestamp: this.buildTimestamp,
            fullVersion: `v${this.currentVersion} (${this.buildTimestamp})`
        };
    }

    // Manual version update methods
    updateToVersion(newVersion, reason = 'Manual update') {
        this.currentVersion = newVersion;
        this.buildTimestamp = this.getCurrentTimestamp();
        this.updateVersionDisplay();
        
        console.log(`🔄 Version manually updated to ${newVersion}: ${reason}`);
        return this.getVersionInfo();
    }

    // Feature-based versioning
    addFeature(featureName) {
        this.incrementVersion('minor');
        console.log(`✨ New feature added: ${featureName}`);
        return this.getVersionInfo();
    }

    fixBug(bugDescription) {
        this.incrementVersion('patch');
        console.log(`🐛 Bug fixed: ${bugDescription}`);
        return this.getVersionInfo();
    }

    majorRelease(releaseName) {
        this.incrementVersion('major');
        console.log(`🚀 Major release: ${releaseName}`);
        return this.getVersionInfo();
    }
}

// Initialize version manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.versionManager = new VersionManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VersionManager;
}
