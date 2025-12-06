/**
 * ResultsDisplay class handles formatting and displaying calculation results
 */
class ResultsDisplay {
    constructor(resultsContainer) {
        this.container = resultsContainer;
    }
    
    /**
     * Display all three calculation results
     * @param {number} output1 - Sum of birth year digits reduced to single digit (1-9)
     * @param {Array} output2 - Array of occurrence data
     * @param {number} output3 - Reduced sum (1-9)
     * @param {object} clientData - Original client data for reference
     */
    displayResults(output1, output2, output3, clientData) {
        // Clear previous results to ensure clean display
        console.log('🧹 Clearing previous results...');
        this.container.innerHTML = '';
        
        console.log('📊 Displaying new results:', {
            output1: output1,
            output2_entries: output2.length,
            output3: output3,
            client: `${clientData.firstName} ${this.formatLastNames(clientData)}`
        });
        
        // Create results header
        const header = document.createElement('div');
        header.className = 'results-header';
        header.innerHTML = `
            <h2>Calculation Results</h2>
            <p class="client-info">Results for: ${clientData.firstName} ${this.formatLastNames(clientData)}</p>
        `;
        this.container.appendChild(header);
        
        // Create results grid
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'results-grid';
        
        // Output 1 - Birth Year Sum Reduced
        const output1Section = this.createOutputSection(
            'Output 1: Birth Year Sum Reduced',
            `Sum of birth year digits (${new Date(clientData.birthDate).getFullYear()}) reduced to single digit`,
            output1.toString(),
            'output1'
        );
        resultsGrid.appendChild(output1Section);
        
        // Output 2 - Letter Occurrence Count Table
        const output2Section = this.createOutput2Section(output2);
        resultsGrid.appendChild(output2Section);
        
        // Output 3 - Name Sum Reduced to Single Digit
        const output3Section = this.createOutputSection(
            'Output 3: Name Sum Reduced',
            'Sum of all name letters reduced to single digit',
            output3.toString(),
            'output3'
        );
        resultsGrid.appendChild(output3Section);
        
        this.container.appendChild(resultsGrid);
        
        // Add save/print options
        this.addSaveOptions(output1, output2, output3, clientData);
        
        // Show results section
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Create a standard output section
     * @param {string} title - Section title
     * @param {string} description - Section description
     * @param {string} value - Result value
     * @param {string} className - CSS class name
     * @returns {HTMLElement} - Section element
     */
    createOutputSection(title, description, value, className) {
        const section = document.createElement('div');
        section.className = `result-section ${className}`;
        section.innerHTML = `
            <div class="result-header">
                <h3>${title}</h3>
                <p class="result-description">${description}</p>
            </div>
            <div class="result-value">
                <span class="value-large">${value}</span>
            </div>
        `;
        return section;
    }
    
    /**
     * Create Output 2 section with occurrence table
     * @param {Array} output2Data - Array of occurrence data
     * @returns {HTMLElement} - Section element
     */
    createOutput2Section(output2Data) {
        const section = document.createElement('div');
        section.className = 'result-section output2';
        
        const header = document.createElement('div');
        header.className = 'result-header';
        header.innerHTML = `
            <h3>Output 2: Letter Occurrence Count</h3>
            <p class="result-description">Count of each number (1-9) from converted letters</p>
        `;
        section.appendChild(header);
        
        const tableContainer = document.createElement('div');
        tableContainer.className = 'result-value';
        tableContainer.appendChild(this.formatOutput2Table(output2Data));
        section.appendChild(tableContainer);
        
        return section;
    }
    
    /**
     * Format Output 2 data as a table
     * @param {Array} occurrenceData - Array of occurrence data
     * @returns {HTMLElement} - Table element
     */
    formatOutput2Table(occurrenceData) {
        const table = document.createElement('table');
        table.className = 'occurrence-table';
        
        // Create header row
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>Number</th><th>Count</th>';
        table.appendChild(headerRow);
        
        // Create data rows
        occurrenceData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="number-cell">${item.number}</td>
                <td class="count-cell ${item.count === 0 ? 'zero-count' : ''}">${item.display}</td>
            `;
            table.appendChild(row);
        });
        
        return table;
    }
    
    /**
     * Format last names for display
     * @param {object} clientData - Client data object
     * @returns {string} - Formatted last names
     */
    formatLastNames(clientData) {
        const lastNames = [];
        if (clientData.lastName1) lastNames.push(clientData.lastName1);
        if (clientData.lastName2) lastNames.push(clientData.lastName2);
        if (clientData.lastName3) lastNames.push(clientData.lastName3);
        return lastNames.join(' ');
    }
    
    /**
     * Add save and print options
     * @param {number} output1 - Output 1 result
     * @param {Array} output2 - Output 2 result
     * @param {number} output3 - Output 3 result
     * @param {object} clientData - Client data
     */
    addSaveOptions(output1, output2, output3, clientData) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'results-actions';
        actionsContainer.innerHTML = `
            <button type="button" id="save-results-btn" class="action-btn save-btn">
                💾 Save Results
            </button>
            <button type="button" id="print-results-btn" class="action-btn print-btn">
                🖨️ Print Results
            </button>
            <button type="button" id="new-calculation-btn" class="action-btn new-btn">
                ➕ New Calculation
            </button>
        `;
        this.container.appendChild(actionsContainer);
        
        // Add event listeners
        document.getElementById('save-results-btn').addEventListener('click', () => {
            this.saveResults(output1, output2, output3, clientData);
        });
        
        document.getElementById('print-results-btn').addEventListener('click', () => {
            this.printResults();
        });
        
        document.getElementById('new-calculation-btn').addEventListener('click', () => {
            this.startNewCalculation();
        });
    }
    
    /**
     * Save results as a text file
     * @param {number} output1 - Output 1 result
     * @param {Array} output2 - Output 2 result
     * @param {number} output3 - Output 3 result
     * @param {object} clientData - Client data
     */
    saveResults(output1, output2, output3, clientData) {
        const content = this.generatePrintableContent(output1, output2, output3, clientData);
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `calculation-results-${clientData.firstName}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * Print results
     */
    printResults() {
        window.print();
    }
    
    /**
     * Start new calculation (reset form)
     */
    startNewCalculation() {
        // Dispatch event to reset form
        const resetEvent = new CustomEvent('newCalculation');
        document.dispatchEvent(resetEvent);
    }
    
    /**
     * Generate printable content
     * @param {number} output1 - Output 1 result
     * @param {Array} output2 - Output 2 result
     * @param {number} output3 - Output 3 result
     * @param {object} clientData - Client data
     * @returns {string} - Formatted text content
     */
    generatePrintableContent(output1, output2, output3, clientData) {
        const date = new Date().toLocaleDateString();
        const birthYear = new Date(clientData.birthDate).getFullYear();
        
        let content = `PERSONAL DATA COLLECTOR - CALCULATION RESULTS\n`;
        content += `Generated on: ${date}\n`;
        content += `${'='.repeat(50)}\n\n`;
        
        content += `CLIENT INFORMATION:\n`;
        content += `Name: ${clientData.firstName} ${this.formatLastNames(clientData)}\n`;
        content += `Birth Date: ${clientData.birthDate}\n\n`;
        
        content += `CALCULATION RESULTS:\n\n`;
        
        content += `Output 1 - Birth Year Sum Reduced:\n`;
        content += `Sum of birth year digits (${birthYear}) reduced to single digit: ${output1}\n\n`;
        
        content += `Output 2 - Letter Occurrence Count:\n`;
        content += `Number | Count\n`;
        content += `-------|------\n`;
        output2.forEach(item => {
            content += `   ${item.number}   |   ${item.display}\n`;
        });
        content += `\n`;
        
        content += `Output 3 - Name Sum Reduced:\n`;
        content += `Sum of all name letters reduced to single digit: ${output3}\n\n`;
        
        content += `${'='.repeat(50)}\n`;
        content += `Generated by Personal Data Collector\n`;
        
        return content;
    }
}

// Unit tests for ResultsDisplay class
function runResultsDisplayTests() {
    let testsPassed = 0;
    let totalTests = 0;
    
    function test(description, testFunction) {
        totalTests++;
        try {
            testFunction();
            console.log(`✓ ${description}`);
            testsPassed++;
        } catch (error) {
            console.error(`✗ ${description}: ${error.message}`);
        }
    }
    
    // Create mock container
    const mockContainer = document.createElement('div');
    document.body.appendChild(mockContainer);
    
    const resultsDisplay = new ResultsDisplay(mockContainer);
    
    test('ResultsDisplay initializes correctly', () => {
        if (!resultsDisplay.container) {
            throw new Error('ResultsDisplay not initialized properly');
        }
    });
    
    test('formatLastNames combines last names correctly', () => {
        const clientData = {
            lastName1: 'Smith',
            lastName2: 'Johnson',
            lastName3: 'Brown'
        };
        const result = resultsDisplay.formatLastNames(clientData);
        if (result !== 'Smith Johnson Brown') {
            throw new Error(`Expected 'Smith Johnson Brown', got '${result}'`);
        }
    });
    
    test('formatLastNames handles missing last names', () => {
        const clientData = {
            lastName1: 'Smith'
        };
        const result = resultsDisplay.formatLastNames(clientData);
        if (result !== 'Smith') {
            throw new Error(`Expected 'Smith', got '${result}'`);
        }
    });
    
    test('formatOutput2Table creates table correctly', () => {
        const mockData = [
            { number: 1, count: 2, display: '2' },
            { number: 2, count: 0, display: 'ô' }
        ];
        const table = resultsDisplay.formatOutput2Table(mockData);
        
        if (table.tagName !== 'TABLE') {
            throw new Error('Should create a table element');
        }
        
        const rows = table.querySelectorAll('tr');
        if (rows.length !== 3) { // header + 2 data rows
            throw new Error(`Expected 3 rows, got ${rows.length}`);
        }
    });
    
    test('generatePrintableContent creates formatted text', () => {
        const mockOutput2 = [
            { number: 1, count: 1, display: '1' },
            { number: 2, count: 0, display: 'ô' }
        ];
        const mockClientData = {
            firstName: 'John',
            lastName1: 'Doe',
            birthDate: '1990-01-01'
        };
        
        const content = resultsDisplay.generatePrintableContent(24, mockOutput2, 5, mockClientData);
        
        if (!content.includes('CALCULATION RESULTS')) {
            throw new Error('Content should include results header');
        }
        
        if (!content.includes('John Doe')) {
            throw new Error('Content should include client name');
        }
        
        if (!content.includes('24')) {
            throw new Error('Content should include Output 1 result');
        }
    });
    
    // Cleanup
    document.body.removeChild(mockContainer);
    
    console.log(`\nResultsDisplay Tests: ${testsPassed}/${totalTests} passed`);
    return testsPassed === totalTests;
}

// Run tests if in development mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Uncomment the line below to run tests
    // runResultsDisplayTests();
}
// Test
 save and print functionality
function testSaveAndPrintFunctionality() {
    console.log('Testing save and print functionality...');
    
    // Create mock container
    const mockContainer = document.createElement('div');
    document.body.appendChild(mockContainer);
    
    const resultsDisplay = new ResultsDisplay(mockContainer);
    
    // Mock data
    const mockOutput1 = 24;
    const mockOutput2 = [
        { number: 1, count: 2, display: '2' },
        { number: 2, count: 1, display: '1' },
        { number: 3, count: 0, display: 'ô' }
    ];
    const mockOutput3 = 9;
    const mockClientData = {
        firstName: 'John',
        lastName1: 'Smith',
        birthDate: '1995-06-15'
    };
    
    try {
        // Test generatePrintableContent
        const content = resultsDisplay.generatePrintableContent(mockOutput1, mockOutput2, mockOutput3, mockClientData);
        
        if (!content.includes('CALCULATION RESULTS')) {
            throw new Error('Generated content missing header');
        }
        
        if (!content.includes('John Smith')) {
            throw new Error('Generated content missing client name');
        }
        
        if (!content.includes('24')) {
            throw new Error('Generated content missing Output 1');
        }
        
        if (!content.includes('ô')) {
            throw new Error('Generated content missing Output 2 zero occurrence');
        }
        
        if (!content.includes('9')) {
            throw new Error('Generated content missing Output 3');
        }
        
        console.log('✓ Save and print functionality working correctly');
        
        // Cleanup
        document.body.removeChild(mockContainer);
        
        return true;
        
    } catch (error) {
        console.error('✗ Save and print functionality test failed:', error.message);
        
        // Cleanup
        if (mockContainer.parentElement) {
            document.body.removeChild(mockContainer);
        }
        
        return false;
    }
}

// Export test function for use in main app
if (typeof window !== 'undefined') {
    window.testSaveAndPrintFunctionality = testSaveAndPrintFunctionality;
}