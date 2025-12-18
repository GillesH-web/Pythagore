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
                e.preventDefault();
                e.stopPropagation();
                this.generatePDF();
                console.log('📄 PDF generation triggered - page data preserved');
            }
            if (e.target.id === 'print-results-btn') {
                e.preventDefault();
                e.stopPropagation();
                window.print();
                console.log('🖨️ Print triggered - page data preserved');
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
            
            // Calculate and display health analysis in Tab 4
            const healthData = this.calculator.calculateHealthAnalysis(formData);
            this.resultsDisplay.displayHealthAnalysis(healthData, formData);

            // Switch to Tab 1 (Piliers) after calculation is complete
            if (typeof switchTab === 'function') {
                switchTab('tab1');
                console.log('📊 Switched to Tab 1 (Piliers) after calculation');
            } else {
                // Fallback: manually switch to tab 1
                this.switchToTab1();
            }

            console.log('📊 All calculations completed:', { output1, output2, output3, cycles, realizationData, healthData });
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
        
        // Disable ALL calculate buttons (desktop and mobile)
        document.getElementById('submit-btn').disabled = true;
        
        // Disable mobile FAB button
        const mobileSubmitBtn = document.getElementById('mobile-submit-btn');
        if (mobileSubmitBtn) {
            mobileSubmitBtn.disabled = true;
        }
        
        // Disable super simple mobile button
        const simpleCalculateBtn = document.getElementById('simple-calculate');
        if (simpleCalculateBtn) {
            simpleCalculateBtn.disabled = true;
            simpleCalculateBtn.style.background = '#95a5a6';
            simpleCalculateBtn.style.opacity = '0.7';
        }
        
        // Disable nuclear mobile button
        const nuclearCalculateBtn = document.getElementById('nuclear-calculate');
        if (nuclearCalculateBtn) {
            nuclearCalculateBtn.disabled = true;
            nuclearCalculateBtn.style.background = '#95a5a6 !important';
            nuclearCalculateBtn.style.opacity = '0.7 !important';
        }

        console.log('🔄 Form reset completed - all calculate buttons disabled');
    }

    /**
     * Manually switches to Tab 1 (Piliers) - fallback method
     */
    switchToTab1() {
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        // Remove active class from all tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Activate Tab 1 button
        const tab1Btn = document.getElementById('tab1-btn');
        if (tab1Btn) {
            tab1Btn.classList.add('active');
        }
        
        // Show Tab 1 panel
        const tab1Panel = document.getElementById('tab1-panel');
        if (tab1Panel) {
            tab1Panel.classList.add('active');
        }
        
        console.log('📊 Manually switched to Tab 1 (Piliers)');
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
        // FRAME STATE PRESERVATION: Capture current state before PDF generation (outside try block for scope)
        const preservedState = this.captureFrameState();
        console.log('📄 Frame state captured before PDF generation:', preservedState);
        
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

            // Calculate health analysis data (4th Tab)
            const healthData = this.calculator.calculateHealthAnalysis(formData);

            // Add pyramid background with stars at the bottom
            this.addPyramidBackground(doc);

            // Compact PDF Header
            doc.setFillColor(44, 62, 80);
            doc.rect(0, 0, 210, 20, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Numérologie de Pythagore v2.3.0', 105, 13, { align: 'center' });

            // Compact Client Information
            const names = [formData.firstName1, formData.firstName2, formData.firstName3].filter(Boolean).join(' ');
            const fullName = `${names} ${formData.lastName}`;
            const formattedDate = new Date(formData.birthDate).toLocaleDateString('fr-FR');
            
            doc.setFillColor(232, 244, 253);
            doc.rect(10, 25, 190, 12, 'F');
            doc.setTextColor(44, 62, 80);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`${fullName} - Né(e) le ${formattedDate}`, 105, 33, { align: 'center' });

            // ULTRA-COMPACT LAYOUT - All 5 sections on one page
            
            // Section 1: Piliers (Top Left & Right) - Reduced height
            this.addCompactTabSection(doc, 'Piliers', 42);
            this.addCompactResultBox(doc, 'Chemin de vie', output1, 15, 50, 85, 16);
            this.addCompactResultBox(doc, 'Nombre d\'expression', output3, 110, 50, 85, 16);
            
            // Section 2: Grille d'inclusion (Top Center, Ultra-Compact)
            this.addUltraCompactInclusionGrid(doc, output2, 15, 70);

            // Section 3: Cycles (Horizontal Layout) - Reduced height
            this.addCompactTabSection(doc, 'Cycles', 100);
            this.addCompactCycleBox(doc, cycles.cycle1, 15, 108, 60, 10);
            this.addCompactCycleBox(doc, cycles.cycle2, 80, 108, 60, 10);
            this.addCompactCycleBox(doc, cycles.cycle3, 145, 108, 50, 10);

            // Section 4: Phase de réalisation (2x2 Grid) - Reduced height
            this.addCompactTabSection(doc, 'Phase de réalisation', 125);
            this.addCompactRealizationBox(doc, realizationData.output6, 15, 133, 90, 10);
            this.addCompactRealizationBox(doc, realizationData.output7, 110, 133, 90, 10);
            this.addCompactRealizationBox(doc, realizationData.output8, 15, 146, 90, 10);
            this.addCompactRealizationBox(doc, realizationData.output9, 110, 146, 90, 10);

            // Section 5: Santé - Sentiments - Hérédité (4th Tab) - NEW
            this.addCompactTabSection(doc, 'Santé - Sentiments - Hérédité', 165);
            this.addCompactHealthBox(doc, 'Santé', healthData.health, 15, 173, 60, 25);
            this.addCompactHealthBox(doc, 'Sentiments', healthData.feelings, 80, 173, 60, 25);
            this.addCompactHealthBox(doc, 'Hérédité', healthData.heredity, 145, 173, 50, 25);

            // Compact Footer
            doc.setTextColor(127, 140, 141);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 105, 285, { align: 'center' });

            // Mobile PDF Generation with Safari Tab Opening
            const fileName = `numerologie_${fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            
            // Detect mobile devices (iPhone, iPad, Android)
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                            (window.innerWidth <= 768 && 'ontouchstart' in window);
            
            if (isMobile) {
                try {
                    console.log('📱 Mobile device detected - opening PDF in Safari tab');
                    
                    // Create PDF blob for mobile
                    const pdfBlob = doc.output('blob');
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    
                    // Open PDF in new Safari tab
                    const newTab = window.open(pdfUrl, '_blank');
                    
                    if (newTab) {
                        console.log('✅ PDF opened in new Safari tab successfully');
                        
                        // Clean up the blob URL after a delay to allow the tab to load
                        setTimeout(() => {
                            URL.revokeObjectURL(pdfUrl);
                            console.log('🧹 PDF blob URL cleaned up');
                        }, 5000);
                    } else {
                        // Fallback if popup is blocked
                        console.warn('⚠️ Popup blocked - falling back to download');
                        throw new Error('Popup blocked');
                    }
                } catch (error) {
                    console.error('❌ Mobile PDF tab opening failed:', error);
                    console.log('📱 Falling back to download method');
                    
                    // Fallback to download on mobile if tab opening fails
                    doc.save(fileName);
                    alert('PDF généré avec succès ! Vérifiez vos téléchargements.');
                }
            } else {
                // Desktop: use traditional download method
                console.log('🖥️ Desktop device detected - downloading PDF');
                doc.save(fileName);
            }

            console.log('📄 Enhanced PDF generated successfully:', fileName);
            
            // FRAME STATE PRESERVATION: Restore state after PDF generation
            setTimeout(() => {
                this.restoreFrameState(preservedState);
                console.log('📄 Frame state restored after PDF generation');
            }, 100);
            
        } catch (error) {
            console.error('❌ PDF generation error:', error);
            
            // FRAME STATE PRESERVATION: Restore state even on error
            setTimeout(() => {
                this.restoreFrameState(preservedState);
                console.log('📄 Frame state restored after PDF error');
            }, 100);
            
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
        
        // Stars at the bottom of pyramid with soft blue outlines
        doc.setGState(new doc.GState({opacity: 0.6}));
        doc.setDrawColor(135, 206, 235); // Soft blue color (Sky Blue)
        doc.setLineWidth(0.5);
        
        // Draw multiple stars at the bottom of the pyramid
        const starPositions = [
            { x: 80, y: 135 },   // Left star
            { x: 105, y: 140 },  // Center star (slightly lower)
            { x: 130, y: 135 }   // Right star
        ];
        
        starPositions.forEach(pos => {
            this.drawStar(doc, pos.x, pos.y, 3, 5); // radius=3, points=5
        });
        
        // Reset opacity
        doc.setGState(new doc.GState({opacity: 1}));
    }

    /**
     * Draws a star shape with soft blue outline
     * @param {Object} doc - jsPDF document
     * @param {number} centerX - X coordinate of star center
     * @param {number} centerY - Y coordinate of star center
     * @param {number} radius - Radius of the star
     * @param {number} points - Number of star points (default 5)
     */
    drawStar(doc, centerX, centerY, radius, points = 5) {
        const outerRadius = radius;
        const innerRadius = radius * 0.4;
        const angleStep = (Math.PI * 2) / points;
        
        let starPath = '';
        
        for (let i = 0; i < points * 2; i++) {
            const angle = i * angleStep / 2 - Math.PI / 2;
            const currentRadius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = centerX + Math.cos(angle) * currentRadius;
            const y = centerY + Math.sin(angle) * currentRadius;
            
            if (i === 0) {
                starPath = `M ${x} ${y}`;
            } else {
                starPath += ` L ${x} ${y}`;
            }
        }
        starPath += ' Z'; // Close the path
        
        // Draw the star outline only (no fill)
        doc.path(starPath).stroke();
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

    // ===== COMPACT PDF LAYOUT FUNCTIONS =====

    /**
     * Adds a compact tab section header
     */
    addCompactTabSection(doc, title, y) {
        doc.setFillColor(52, 152, 219);
        doc.rect(10, y, 190, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 15, y + 6);
    }

    /**
     * Adds a compact result box (for Piliers)
     */
    addCompactResultBox(doc, title, value, x, y, width, height) {
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(233, 236, 239);
        doc.rect(x, y, width, height, 'FD');
        
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x + width/2, y + 6, { align: 'center' });
        
        doc.setTextColor(39, 174, 96);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(value.toString(), x + width/2, y + 16, { align: 'center' });
    }

    /**
     * Adds compact inclusion grid table
     */
    addCompactInclusionGrid(doc, output2, x, y) {
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Grille d\'inclusion', x, y + 4);
        
        // Compact table - 5 columns x 2 rows
        const colWidth = 38;
        const rowHeight = 10;
        
        // Table header
        doc.setFillColor(52, 152, 219);
        doc.rect(x, y + 6, 190, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('Nombre', x + 5, y + 10);
        doc.text('Occurrences', x + 100, y + 10);
        
        // Table rows - display in 2 columns to save space
        const itemsPerRow = 5;
        output2.forEach((item, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            const cellX = x + (col * colWidth);
            const cellY = y + 12 + (row * 8);
            
            if (row < 2) { // Only show first 2 rows to fit on page
                const bgColor = index % 2 === 0 ? [248, 249, 250] : [255, 255, 255];
                doc.setFillColor(...bgColor);
                doc.rect(cellX, cellY, colWidth, 8, 'F');
                
                // Display number in black
                doc.setTextColor(44, 62, 80);
                doc.setFontSize(7);
                doc.text(`${item.number}:`, cellX + 2, cellY + 5);
                
                // Display occurrence value in green
                doc.setTextColor(39, 174, 96); // Green color
                doc.setFontSize(7);
                doc.text(item.display, cellX + 12, cellY + 5);
            }
        });
    }

    /**
     * Adds a compact cycle box
     */
    addCompactCycleBox(doc, cycle, x, y, width, height) {
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(233, 236, 239);
        doc.rect(x, y, width, height, 'FD');
        
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(cycle.label, x + 2, y + 4);
        
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(cycle.ageRange, x + 2, y + 8);
        
        doc.setTextColor(39, 174, 96);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(cycle.value.toString(), x + width - 8, y + 8, { align: 'center' });
    }

    /**
     * Adds a compact realization box
     */
    addCompactRealizationBox(doc, realization, x, y, width, height) {
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(233, 236, 239);
        doc.rect(x, y, width, height, 'FD');
        
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(realization.label, x + 2, y + 4);
        
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(realization.description, x + 2, y + 8);
        
        doc.setTextColor(39, 174, 96);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(realization.value.toString(), x + width - 8, y + 8, { align: 'center' });
    }

    /**
     * Adds ultra-compact inclusion grid table (more compact than regular compact)
     */
    addUltraCompactInclusionGrid(doc, output2, x, y) {
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Grille d\'inclusion', x, y + 3);
        
        // Ultra-compact table - 9 columns x 1 row
        const colWidth = 20;
        
        // Display all 9 numbers in a single row
        output2.forEach((item, index) => {
            const cellX = x + (index * colWidth);
            const cellY = y + 6;
            
            // Alternating background colors
            const bgColor = index % 2 === 0 ? [248, 249, 250] : [255, 255, 255];
            doc.setFillColor(...bgColor);
            doc.rect(cellX, cellY, colWidth, 12, 'F');
            
            // Display number
            doc.setTextColor(44, 62, 80);
            doc.setFontSize(6);
            doc.text(`${item.number}:`, cellX + 1, cellY + 4);
            
            // Display occurrence value
            doc.setTextColor(39, 174, 96);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(item.display, cellX + 10, cellY + 8, { align: 'center' });
        });
    }

    /**
     * Adds a compact health analysis box
     */
    addCompactHealthBox(doc, title, healthData, x, y, width, height) {
        // Set border color based on category
        let borderColor = [52, 152, 219]; // Default blue
        if (title.includes('Santé')) borderColor = [231, 76, 60]; // Red
        else if (title.includes('Sentiments')) borderColor = [233, 30, 99]; // Pink
        else if (title.includes('Hérédité')) borderColor = [156, 39, 176]; // Purple
        
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.5);
        doc.rect(x, y, width, height, 'FD');
        
        // Title
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x + 2, y + 4);
        
        // Number
        doc.setTextColor(...borderColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(healthData.number.toString(), x + width - 8, y + 6, { align: 'center' });
        
        // Tendencies (truncated)
        doc.setTextColor(44, 62, 80);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        const tendencies = healthData.tendencies.substring(0, 60) + '...';
        doc.text(tendencies, x + 2, y + 10, { maxWidth: width - 4 });
        
        // Advice (truncated)
        doc.setFontSize(5);
        const advice = healthData.advice.substring(0, 50) + '...';
        doc.text(advice, x + 2, y + 15, { maxWidth: width - 4 });
        
        // Attention (truncated)
        doc.setTextColor(231, 76, 60);
        const attention = healthData.attention.substring(0, 45) + '...';
        doc.text(attention, x + 2, y + 20, { maxWidth: width - 4 });
    }

    // ===== FRAME STATE PRESERVATION METHODS =====

    /**
     * Captures the current frame state before PDF generation
     * @returns {Object} - Captured state object
     */
    captureFrameState() {
        try {
            // Capture form data
            const formData = this.getFormData();
            
            // Capture results content
            const resultsContainer = document.getElementById('results-container');
            const resultsHTML = resultsContainer ? resultsContainer.innerHTML : '';
            
            // Capture frame visibility
            const leftPanel = document.querySelector('.left-panel');
            const rightPanel = document.querySelector('.right-panel');
            
            // Capture active tab
            const activeTab = document.querySelector('.tab-btn.active');
            const activeTabId = activeTab ? activeTab.id : null;
            
            // Capture button states
            const submitBtn = document.getElementById('submit-btn');
            const mobileSubmitBtn = document.getElementById('mobile-submit-btn');
            
            const state = {
                formData: formData,
                resultsHTML: resultsHTML,
                frameVisibility: {
                    leftPanelDisplay: leftPanel ? leftPanel.style.display : '',
                    rightPanelDisplay: rightPanel ? rightPanel.style.display : '',
                    leftPanelVisible: leftPanel ? !leftPanel.classList.contains('hidden') : true,
                    rightPanelVisible: rightPanel ? !rightPanel.classList.contains('hidden') : true
                },
                activeTabId: activeTabId,
                buttonStates: {
                    submitDisabled: submitBtn ? submitBtn.disabled : true,
                    mobileSubmitDisabled: mobileSubmitBtn ? mobileSubmitBtn.disabled : true
                },
                timestamp: Date.now()
            };
            
            return state;
        } catch (error) {
            console.error('❌ Error capturing frame state:', error);
            return null;
        }
    }

    /**
     * Restores the frame state after PDF generation
     * @param {Object} state - Previously captured state object
     */
    restoreFrameState(state) {
        try {
            if (!state) {
                console.warn('⚠️ No state to restore');
                return;
            }
            
            // Restore form data
            if (state.formData) {
                const form = document.getElementById('client-form');
                if (form) {
                    Object.keys(state.formData).forEach(fieldName => {
                        const field = document.getElementById(fieldName);
                        if (field && state.formData[fieldName]) {
                            field.value = state.formData[fieldName];
                        }
                    });
                }
            }
            
            // Restore results content
            if (state.resultsHTML) {
                const resultsContainer = document.getElementById('results-container');
                if (resultsContainer) {
                    resultsContainer.innerHTML = state.resultsHTML;
                }
            }
            
            // Restore frame visibility
            if (state.frameVisibility) {
                const leftPanel = document.querySelector('.left-panel');
                const rightPanel = document.querySelector('.right-panel');
                
                if (leftPanel && state.frameVisibility.leftPanelDisplay !== undefined) {
                    leftPanel.style.display = state.frameVisibility.leftPanelDisplay;
                }
                if (rightPanel && state.frameVisibility.rightPanelDisplay !== undefined) {
                    rightPanel.style.display = state.frameVisibility.rightPanelDisplay;
                }
            }
            
            // Restore active tab
            if (state.activeTabId) {
                const activeTab = document.getElementById(state.activeTabId);
                if (activeTab) {
                    // Remove active from all tabs
                    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                    
                    // Restore active tab
                    activeTab.classList.add('active');
                    const tabNumber = state.activeTabId.replace('tab', '').replace('-btn', '');
                    const activePanel = document.getElementById(`tab${tabNumber}-panel`);
                    if (activePanel) {
                        activePanel.classList.add('active');
                    }
                }
            }
            
            // Restore button states
            if (state.buttonStates) {
                const submitBtn = document.getElementById('submit-btn');
                const mobileSubmitBtn = document.getElementById('mobile-submit-btn');
                
                if (submitBtn) {
                    submitBtn.disabled = state.buttonStates.submitDisabled;
                }
                if (mobileSubmitBtn) {
                    mobileSubmitBtn.disabled = state.buttonStates.mobileSubmitDisabled;
                }
            }
            
            console.log('✅ Frame state restored successfully');
            
        } catch (error) {
            console.error('❌ Error restoring frame state:', error);
        }
    }
}