/**
 * ResultsDisplay Class - Handles all results rendering and display
 * Pythagore Numerology Application
 */
class ResultsDisplay {
    /**
     * Displays the main results (Output 1, 2, 3) in Tab 1
     * @param {number} output1 - Life path number
     * @param {Array} output2 - Inclusion grid data
     * @param {number} output3 - Expression number
     * @param {Object} clientData - Client information
     */
    displayResults(output1, output2, output3, clientData) {
        console.log('🎯 Displaying results:', { output1, output2, output3, clientData });
        
        this.clearResults();
        this.showClientInfo(clientData);
        
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';
        
        const output1Section = this.createOutputSection('Chemin de vie', '', output1, 'output1');
        resultsContainer.appendChild(output1Section);
        
        const output3Section = this.createOutputSection('Nombre d\'expression', '', output3, 'output3');
        resultsContainer.appendChild(output3Section);
        
        const output2Section = this.createOutput2Section(output2);
        resultsContainer.appendChild(output2Section);
        
        document.getElementById('empty-state').style.display = 'none';
        resultsContainer.style.display = 'grid';
        
        // Only show panel actions on desktop (hide on mobile)
        const isMobile = window.innerWidth <= 480 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const panelActions = document.getElementById('panel-actions');
        if (panelActions && !isMobile) {
            panelActions.style.display = 'flex';
        } else if (panelActions && isMobile) {
            panelActions.style.display = 'none';
        }
        
        console.log('✅ Results displayed successfully');
    }

    /**
     * Displays the life cycles (Output 4 & 5) in Tab 2
     * @param {Object} cycles - Cycles data with cycle1, cycle2, cycle3
     * @param {Object} clientData - Client information
     */
    displayCycles(cycles, clientData) {
        console.log('🔄 Displaying cycles (Output 4 & 5):', cycles);
        
        const cyclesContainer = document.getElementById('cycles-container');
        cyclesContainer.innerHTML = '';
        
        const cycle1Section = this.createCycleSection(cycles.cycle1);
        cyclesContainer.appendChild(cycle1Section);
        
        const cycle2Section = this.createCycleSection(cycles.cycle2);
        cyclesContainer.appendChild(cycle2Section);
        
        const cycle3Section = this.createCycleSection(cycles.cycle3);
        cyclesContainer.appendChild(cycle3Section);
        
        // Add caption at the bottom
        const captionSection = this.createCycleCaption();
        cyclesContainer.appendChild(captionSection);
        
        document.getElementById('cycles-empty-state').style.display = 'none';
        cyclesContainer.style.display = 'grid';
        
        console.log('✅ Cycles (Output 4 & 5) displayed successfully in Tab 2');
    }

    /**
     * Displays the realization phase content in Tab 3
     * @param {Object} realizationData - Realization phase data with output6, output7, output8, output9
     * @param {Object} clientData - Client information
     */
    displayRealization(realizationData, clientData) {
        console.log('🎯 Displaying realization phase:', realizationData);
        
        const realizationContainer = document.getElementById('realization-container');
        realizationContainer.innerHTML = '';
        
        // Create 4 realization outputs in sequential order: 1, 2, 3, 4
        const output6Section = this.createRealizationSection(realizationData.output6);
        realizationContainer.appendChild(output6Section);
        
        const output7Section = this.createRealizationSection(realizationData.output7);
        realizationContainer.appendChild(output7Section);
        
        const output8Section = this.createRealizationSection(realizationData.output8);
        realizationContainer.appendChild(output8Section);
        
        const output9Section = this.createRealizationSection(realizationData.output9);
        realizationContainer.appendChild(output9Section);
        
        // Add caption at the bottom (same as tab 2)
        const captionSection = this.createCycleCaption();
        realizationContainer.appendChild(captionSection);
        
        document.getElementById('realization-empty-state').style.display = 'none';
        realizationContainer.style.display = 'grid';
        
        console.log('✅ Realization phase displayed successfully in Tab 3');
    }

    /**
     * Creates a realization section for Tab 3
     * @param {Object} realization - Realization data with label, description, and value
     * @returns {HTMLElement} - Created realization section element
     */
    createRealizationSection(realization) {
        const section = document.createElement('div');
        section.className = 'realization-item';
        
        section.innerHTML = `
            <h3>${realization.label}</h3>
            <div class="realization-description">${realization.description}</div>
            <div class="realization-value">${realization.value}</div>
        `;
        
        return section;
    }

    /**
     * Creates a result section for Output 1 and 3
     * @param {string} title - Section title
     * @param {string} subtitle - Section subtitle
     * @param {number} value - Numeric value to display
     * @param {string} className - CSS class name
     * @returns {HTMLElement} - Created section element
     */
    createOutputSection(title, subtitle, value, className) {
        const section = document.createElement('div');
        section.className = `result-item ${className}`;
        
        section.innerHTML = `
            <h3>${title}</h3>
            <div class="subtitle">${subtitle}</div>
            <div class="result-value">${value}</div>
        `;
        
        return section;
    }

    /**
     * Creates a cycle section for Tab 2
     * @param {Object} cycle - Cycle data with label, ageRange, and value
     * @returns {HTMLElement} - Created cycle section element
     */
    createCycleSection(cycle) {
        const section = document.createElement('div');
        section.className = 'cycle-item';
        
        section.innerHTML = `
            <h3>${cycle.label}</h3>
            <div class="cycle-age-range">${cycle.ageRange}</div>
            <div class="cycle-value">${cycle.value}</div>
        `;
        
        return section;
    }

    /**
     * Creates a caption section for Tab 2 cycles
     * @returns {HTMLElement} - Created caption section element
     */
    createCycleCaption() {
        const section = document.createElement('div');
        section.className = 'cycle-caption';
        
        section.innerHTML = `
            <div class="cycle-caption-text">Attention +/- 2 ans</div>
        `;
        
        return section;
    }

    /**
     * Creates the Output 2 section (Inclusion Grid)
     * @param {Array} output2Data - Array of occurrence data
     * @returns {HTMLElement} - Created section element
     */
    createOutput2Section(output2Data) {
        const section = document.createElement('div');
        section.className = 'result-item output2';
        
        const tableHTML = this.formatOutput2Table(output2Data);
        
        section.innerHTML = `
            <h3>Grille d'inclusion</h3>
            <div class="subtitle"></div>
            ${tableHTML}
        `;
        
        return section;
    }

    /**
     * Formats the occurrence data into an HTML table
     * @param {Array} occurrenceData - Array of occurrence objects
     * @returns {string} - HTML table string
     */
    formatOutput2Table(occurrenceData) {
        let tableHTML = '<table class="occurrence-table"><thead><tr><th>Nombre</th><th>Occurrences</th></tr></thead><tbody>';
        
        occurrenceData.forEach(item => {
            const displayValue = item.count === 0 ? '<span class="zero-count">ô</span>' : item.display;
            tableHTML += `<tr><td class="number-${item.number}">${item.number}</td><td>${displayValue}</td></tr>`;
        });
        
        tableHTML += '</tbody></table>';
        return tableHTML;
    }

    /**
     * Shows client information in the header
     * @param {Object} clientData - Client data object
     */
    showClientInfo(clientData) {
        const clientInfoHeader = document.getElementById('client-info-header');
        const names = [clientData.firstName1, clientData.firstName2, clientData.firstName3].filter(Boolean).join(' ');
        const fullName = `${names} ${clientData.lastName.toUpperCase()}`;
        const formattedDate = new Date(clientData.birthDate).toLocaleDateString('fr-FR');
        
        clientInfoHeader.innerHTML = `<strong>${fullName}</strong> - Né(e) le ${formattedDate}`;
        clientInfoHeader.style.display = 'block';
    }

    /**
     * Clears all results and resets the display to empty state
     */
    clearResults() {
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        
        const cyclesContainer = document.getElementById('cycles-container');
        cyclesContainer.innerHTML = '';
        cyclesContainer.style.display = 'none';
        
        const realizationContainer = document.getElementById('realization-container');
        realizationContainer.innerHTML = '';
        realizationContainer.style.display = 'none';
        
        const healthContainer = document.getElementById('health-container');
        healthContainer.innerHTML = '';
        healthContainer.style.display = 'none';
        
        document.getElementById('empty-state').style.display = 'block';
        document.getElementById('cycles-empty-state').style.display = 'block';
        document.getElementById('realization-empty-state').style.display = 'block';
        document.getElementById('health-empty-state').style.display = 'block';
        document.getElementById('client-info-header').style.display = 'none';
        document.getElementById('panel-actions').style.display = 'none';
    }

    /**
     * Displays health, feelings and heredity analysis in Tab 4
     * @param {Object} healthData - Health analysis data
     * @param {Object} clientData - Client information
     */
    displayHealthAnalysis(healthData, clientData) {
        console.log('🏥 Displaying health analysis:', { healthData, clientData });
        
        const healthContainer = document.getElementById('health-container');
        healthContainer.innerHTML = '';
        
        // Create health analysis sections
        const healthSection = this.createHealthSection('Santé', healthData.health, 'health-icon', '🏥');
        healthContainer.appendChild(healthSection);
        
        const feelingsSection = this.createHealthSection('Sentiments', healthData.feelings, 'feelings-icon', '💝');
        healthContainer.appendChild(feelingsSection);
        
        const hereditySection = this.createHealthSection('Hérédité', healthData.heredity, 'heredity-icon', '🧬');
        healthContainer.appendChild(hereditySection);
        
        document.getElementById('health-empty-state').style.display = 'none';
        healthContainer.style.display = 'grid';
        
        // Apply 30% space optimization automatically
        this.applyOptimization();
        
        console.log('✅ Health analysis displayed successfully with 30% space optimization');
    }

    /**
     * Creates a health analysis section
     * @param {string} title - Section title
     * @param {Object} data - Section data
     * @param {string} className - CSS class name
     * @param {string} icon - Emoji icon
     * @returns {HTMLElement} - Section element
     */
    createHealthSection(title, data, className, icon) {
        const section = document.createElement('div');
        section.className = `health-section ${className}`;
        
        section.innerHTML = `
            <div class="health-header">
                <span class="health-icon">${icon}</span>
                <h3>${title}</h3>
            </div>
            <div class="health-content">
                <div class="health-number">
                    <span class="health-value">${data.number}</span>
                    <span class="health-label">Nombre dominant</span>
                </div>
                <div class="health-description">
                    <p><strong>Tendances:</strong> ${data.tendencies}</p>
                    <p><strong>Conseils:</strong> ${data.advice}</p>
                    <p><strong>Points d'attention:</strong> ${data.attention}</p>
                </div>
            </div>
        `;
        
        return section;
    }

    /**
     * Applies 30% space optimization to the health analysis display
     * Reduces padding, margins, and gaps while preserving content and readability
     */
    applyOptimization() {
        console.log('🔧 Applying 30% space optimization to Tab 4');
        
        const healthContainer = document.getElementById('health-container');
        if (!healthContainer) {
            console.warn('⚠️ Health container not found for optimization');
            return;
        }
        
        // Apply optimization to main container
        healthContainer.classList.add('optimized');
        
        // Apply optimization to all sections and their components
        const sections = healthContainer.querySelectorAll('.health-section');
        sections.forEach(section => {
            section.classList.add('optimized');
            
            // Optimize header
            const header = section.querySelector('.health-header');
            if (header) header.classList.add('optimized');
            
            // Optimize content
            const content = section.querySelector('.health-content');
            if (content) content.classList.add('optimized');
            
            // Optimize number display
            const number = section.querySelector('.health-number');
            if (number) number.classList.add('optimized');
            
            // Optimize description
            const description = section.querySelector('.health-description');
            if (description) description.classList.add('optimized');
        });
        
        console.log('✅ 30% space optimization applied successfully');
    }
}