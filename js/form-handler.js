/**
 * FormHandler Class - Handles all form interactions and user events
 * Pythagore Numerology Application
 */
class FormHandler {
    constructor() {
        this.validator = new Validator();
        this.calculator = new Calculator();
        this.resultsDisplay = new ResultsDisplay();
        this.initializeEventListeners();
    }

    /**
     * Initialize all event listeners for the form and buttons
     */
    initializeEventListeners() {
        const form = document.getElementById('client-form');
        const submitBtn = document.getElementById('submit-btn');
        const resetBtn = document.getElementById('reset-btn');

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Reset button
        resetBtn.addEventListener('click', () => {
            this.resetForm();
        });

        // Mobile FAB buttons (iPhone Safari alternative)
        const mobileSubmitBtn = document.getElementById('mobile-submit-btn');
        const mobileResetBtn = document.getElementById('mobile-reset-btn');
        
        if (mobileSubmitBtn) {
            mobileSubmitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
        
        if (mobileResetBtn) {
            mobileResetBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }

        // Input validation on type and blur
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateForm();
                this.validateField(input.name, input.value);
            });
            input.addEventListener('blur', () => {
                this.validateField(input.name, input.value);
            });
        });

        // Action buttons (PDF and Print)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'generate-pdf-btn') {
                this.generatePDF();
            }
            if (e.target.id === 'print-results-btn') {
                window.print();
            }
        });
    }

    /**
     * Validates a single form field
     * @param {string} fieldName - Name of the field to validate
     * @param {string} value - Value to validate
     */
    validateField(fieldName, value) {
        const fieldGroup = document.querySelector(`#${fieldName}`).closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);

        let validation;
        if (fieldName === 'birthDate') {
            validation = this.validator.validateDate(value);
        } else if (fieldName === 'firstName1' || fieldName === 'lastName') {
            if (!value.trim()) {
                validation = { 
                    isValid: false, 
                    message: fieldName === 'firstName1' ? 'Le premier prénom est obligatoire' : 'Le nom de famille est obligatoire' 
                };
            } else {
                validation = this.validator.validateName(value);
            }
        } else {
            validation = this.validator.validateName(value);
        }

        if (!validation.isValid) {
            fieldGroup.classList.add('error');
            errorElement.textContent = validation.message;
            errorElement.classList.add('show');
        } else {
            fieldGroup.classList.remove('error');
            errorElement.classList.remove('show');
        }
    }

    /**
     * Validates the entire form and enables/disables submit button
     * @returns {Object} - Validation result object
     */
    validateForm() {
        const formData = this.getFormData();
        const validation = this.validator.validateAll(formData);
        const submitBtn = document.getElementById('submit-btn');
        const mobileSubmitBtn = document.getElementById('mobile-submit-btn');

        // Update both desktop and mobile submit buttons
        submitBtn.disabled = !validation.isValid;
        if (mobileSubmitBtn) {
            mobileSubmitBtn.disabled = !validation.isValid;
        }
        
        return validation;
    }

    /**
     * Gets all form data as an object
     * @returns {Object} - Form data object
     */
    getFormData() {
        return {
            firstName1: document.getElementById('firstName1').value.trim(),
            firstName2: document.getElementById('firstName2').value.trim(),
            firstName3: document.getElementById('firstName3').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            birthDate: document.getElementById('birthDate').value
        };
    }

    /**
     * Handles form submission and calculations
     */
    handleSubmit() {
        const formData = this.getFormData();
        const validation = this.validateForm();

        if (!validation.isValid) {
            Object.keys(validation.errors).forEach(fieldName => {
                this.showValidationError(fieldName, validation.errors[fieldName]);
            });
            return;
        }

        try {
            // Calculate all outputs including cycles (Output 4 & 5)
            const output1 = this.calculator.calculateOutput1(formData.birthDate);
            const output2 = this.calculator.calculateOutput2(formData, formData.lastName);
            const output3 = this.calculator.calculateOutput3(formData, formData.lastName);
            const cycles = this.calculator.calculateCycles(formData.birthDate, output1);

            // Display results in Tab 1, cycles in Tab 2, and realization in Tab 3
            this.resultsDisplay.displayResults(output1, output2, output3, formData);
            this.resultsDisplay.displayCycles(cycles, formData);
            
            // Create realization data with 4 outputs (Réalisation 1, 2, 3, 4)
            const realizationData = {
                output6: {
                    label: 'Réalisation 1',
                    description: this.getRealization1AgeRange(output1),
                    value: this.calculator.calculateRealization1(formData.birthDate)
                },
                output7: {
                    label: 'Réalisation 2', 
                    description: this.getRealization2AgeRange(output1),
                    value: this.calculator.calculateRealization2(formData.birthDate) // Day + Year
                },
                output8: {
                    label: 'Réalisation 3',
                    description: this.getRealization3AgeRange(output1), 
                    value: this.calculator.calculateRealization3(formData.birthDate) // Réalisation 1 + Réalisation 2
                },
                output9: {
                    label: 'Réalisation 4',
                    description: this.getRealization4AgeRange(output1),
                    value: this.calculator.calculateRealization4(formData.birthDate) // Year + Month
                }
            };
            this.resultsDisplay.displayRealization(realizationData, formData);

            console.log('📊 All calculations completed:', { output1, output2, output3, cycles, realizationData });
        } catch (error) {
            console.error('❌ Calculation error:', error);
            alert('Une erreur est survenue lors du calcul. Veuillez réessayer.');
        }
    }

    /**
     * Shows validation error for a specific field
     * @param {string} fieldName - Name of the field
     * @param {string} message - Error message to display
     */
    showValidationError(fieldName, message) {
        const fieldGroup = document.querySelector(`#${fieldName}`).closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);

        fieldGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    /**
     * Resets the form to its initial state
     */
    resetForm() {
        const form = document.getElementById('client-form');
        form.reset();
        
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });

        this.resultsDisplay.clearResults();
        document.getElementById('submit-btn').disabled = true;

        console.log('🔄 Form reset completed');
    }

    /**
     * Gets the age range for Réalisation 1 based on Life Path Number
     * @param {number} output1 - Life path number (1-9)
     * @returns {string} - Age range description
     */
    getRealization1AgeRange(output1) {
        const realization1Ages = {
            1: "De 0 à 35 ans",
            2: "De 0 à 34 ans", 
            3: "De 0 à 33 ans",
            4: "De 0 à 32 ans",
            5: "De 0 à 31 ans",
            6: "De 0 à 30 ans",
            7: "De 0 à 29 ans",
            8: "De 0 à 28 ans",
            9: "De 0 à 27 ans"
        };
        return realization1Ages[output1] || "De 0 à 35 ans";
    }

    /**
     * Gets the age range for Réalisation 2 based on Life Path Number
     * @param {number} output1 - Life path number (1-9)
     * @returns {string} - Age range description
     */
    getRealization2AgeRange(output1) {
        const realization2Ages = {
            1: "De 35 à 44 ans",
            2: "De 34 à 43 ans",
            3: "De 33 à 42 ans",
            4: "De 32 à 41 ans",
            5: "De 31 à 40 ans",
            6: "De 30 à 39 ans",
            7: "De 29 à 38 ans",
            8: "De 28 à 37 ans",
            9: "De 27 à 36 ans"
        };
        return realization2Ages[output1] || "De 35 à 44 ans";
    }

    /**
     * Gets the age range for Réalisation 3 based on Life Path Number
     * @param {number} output1 - Life path number (1-9)
     * @returns {string} - Age range description
     */
    getRealization3AgeRange(output1) {
        const realization3Ages = {
            1: "De 44 à 53 ans",
            2: "De 43 à 52 ans",
            3: "De 42 à 51 ans",
            4: "De 41 à 50 ans",
            5: "De 40 à 49 ans",
            6: "De 39 à 48 ans",
            7: "De 38 à 47 ans",
            8: "De 37 à 46 ans",
            9: "De 36 à 45 ans"
        };
        return realization3Ages[output1] || "De 44 à 53 ans";
    }

    /**
     * Gets the age range for Réalisation 4 based on Life Path Number
     * @param {number} output1 - Life path number (1-9)
     * @returns {string} - Age range description
     */
    getRealization4AgeRange(output1) {
        const realization4Ages = {
            1: "53 ans et plus",
            2: "52 ans et plus",
            3: "51 ans et plus",
            4: "50 ans et plus",
            5: "49 ans et plus",
            6: "48 ans et plus",
            7: "47 ans et plus",
            8: "46 ans et plus",
            9: "45 ans et plus"
        };
        return realization4Ages[output1] || "53 ans et plus";
    }

    /**
     * Generates a PDF report with enhanced layout matching the web interface
     */
    generatePDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');

            const formData = this.getFormData();
            const output1 = this.calculator.calculateOutput1(formData.birthDate);
            const output2 = this.calculator.calculateOutput2(formData, formData.lastName);
            const output3 = this.calculator.calculateOutput3(formData, formData.lastName);
            const cycles = this.calculator.calculateCycles(formData.birthDate, output1);

            // Calculate realization data (Réalisation 1, 2, 3, 4)
            const realizationData = {
                output6: { label: 'Réalisation 1', description: this.getRealization1AgeRange(output1), value: this.calculator.calculateRealization1(formData.birthDate) },
                output7: { label: 'Réalisation 2', description: this.getRealization2AgeRange(output1), value: this.calculator.calculateRealization2(formData.birthDate) },
                output8: { label: 'Réalisation 3', description: this.getRealization3AgeRange(output1), value: this.calculator.calculateRealization3(formData.birthDate) },
                output9: { label: 'Réalisation 4', description: this.getRealization4AgeRange(output1), value: this.calculator.calculateRealization4(formData.birthDate) }
            };

            // Add pyramid/eye background (simplified for PDF)
            this.addPyramidBackground(doc);

            // PDF Header with enhanced styling
            doc.setFillColor(44, 62, 80);
            doc.rect(0, 0, 210, 25, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('Numérologie de Pythagore v1.8.0', 105, 16, { align: 'center' });

            // Client Information Header
            const names = [formData.firstName1, formData.firstName2, formData.firstName3].filter(Boolean).join(' ');
            const fullName = `${names} ${formData.lastName}`;
            const formattedDate = new Date(formData.birthDate).toLocaleDateString('fr-FR');
            
            doc.setFillColor(232, 244, 253);
            doc.rect(15, 30, 180, 15, 'F');
            doc.setTextColor(44, 62, 80);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${fullName} - Né(e) le ${formattedDate}`, 105, 40, { align: 'center' });

            // Tab 1: Piliers Section
            this.addTabSection(doc, 'Piliers', 55);
            this.addResultBox(doc, 'Chemin de vie', output1, 20, 70, 80, 25);
            this.addResultBox(doc, 'Nombre d\'expression', output3, 110, 70, 80, 25);
            this.addInclusionGrid(doc, output2, 20, 100);

            // Tab 2: Cycles Section
            this.addTabSection(doc, 'Cycles', 140);
            this.addCycleBox(doc, cycles.cycle1, 20, 155, 170, 15);
            this.addCycleBox(doc, cycles.cycle2, 20, 175, 170, 15);
            this.addCycleBox(doc, cycles.cycle3, 20, 195, 170, 15);
            
            // Add cycle caption
            doc.setTextColor(231, 76, 60);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            doc.text('Attention +/- 2 ans', 25, 220);

            // Tab 3: Phase de réalisation Section
            this.addTabSection(doc, 'Phase de réalisation', 230);
            this.addRealizationBox(doc, realizationData.output6, 20, 245, 170, 15);
            this.addRealizationBox(doc, realizationData.output7, 20, 260, 170, 15);
            this.addRealizationBox(doc, realizationData.output8, 20, 275, 170, 15);
            this.addRealizationBox(doc, realizationData.output9, 20, 290, 170, 15);

            // Footer
            doc.setTextColor(127, 140, 141);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 105, 290, { align: 'center' });

            // Save PDF
            const fileName = `numerologie_${fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            console.log('📄 Enhanced PDF generated successfully:', fileName);
        } catch (error) {
            console.error('❌ PDF generation error:', error);
            alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
        }
    }

    /**
     * Adds pyramid/eye background to PDF
     */
    addPyramidBackground(doc) {
        // Simplified pyramid outline
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.3);
        doc.setGState(new doc.GState({opacity: 0.15}));
        
        // Pyramid triangle
        doc.triangle(105, 60, 160, 130, 50, 130);
        
        // Eye circle (simplified)
        doc.setFillColor(255, 215, 0);
        doc.circle(105, 75, 8, 'F');
        doc.setFillColor(0, 0, 0);
        doc.circle(105, 75, 3, 'F');
        
        // Reset opacity
        doc.setGState(new doc.GState({opacity: 1}));
    }

    /**
     * Adds a tab section header
     */
    addTabSection(doc, title, y) {
        doc.setFillColor(52, 152, 219);
        doc.rect(15, y, 180, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 20, y + 7);
    }

    /**
     * Adds a result box (for Piliers)
     */
    addResultBox(doc, title, value, x, y, width, height) {
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(233, 236, 239);
        doc.rect(x, y, width, height, 'FD');
        
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x + width/2, y + 8, { align: 'center' });
        
        doc.setTextColor(39, 174, 96);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(value.toString(), x + width/2, y + 20, { align: 'center' });
    }

    /**
     * Adds inclusion grid table
     */
    addInclusionGrid(doc, output2, x, y) {
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Grille d\'inclusion', x, y + 5);
        
        // Table header
        doc.setFillColor(52, 152, 219);
        doc.rect(x, y + 8, 170, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text('Nombre', x + 5, y + 14);
        doc.text('Occurrences', x + 90, y + 14);
        
        // Table rows
        output2.forEach((item, index) => {
            const rowY = y + 16 + (index * 6);
            const bgColor = index % 2 === 0 ? [248, 249, 250] : [255, 255, 255];
            doc.setFillColor(...bgColor);
            doc.rect(x, rowY, 170, 6, 'F');
            
            doc.setTextColor(44, 62, 80);
            doc.setFontSize(8);
            doc.text(item.number.toString(), x + 5, rowY + 4);
            doc.text(item.display, x + 90, rowY + 4);
        });
    }

    /**
     * Adds a cycle box
     */
    addCycleBox(doc, cycle, x, y, width, height) {
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(233, 236, 239);
        doc.rect(x, y, width, height, 'FD');
        
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(cycle.label, x + 5, y + 6);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(cycle.ageRange, x + 5, y + 11);
        
        doc.setTextColor(39, 174, 96);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(cycle.value.toString(), x + width - 15, y + 10, { align: 'center' });
    }

    /**
     * Adds a realization box
     */
    addRealizationBox(doc, realization, x, y, width, height) {
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(233, 236, 239);
        doc.rect(x, y, width, height, 'FD');
        
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(realization.label, x + 5, y + 6);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(realization.description, x + 5, y + 11);
        
        doc.setTextColor(39, 174, 96);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(realization.value.toString(), x + width - 15, y + 10, { align: 'center' });
    }
}