/**
 * Calculator Class - Handles all numerology calculations
 * Pythagore Numerology Application
 */
class Calculator {
    /**
     * Converts a letter to its numerological number (1-9)
     * @param {string} letter - Single letter to convert
     * @returns {number} - Numerological value (1-9) or 0 if invalid
     */
    letterToNumber(letter) {
        if (!letter || typeof letter !== 'string') return 0;
        const code = letter.toUpperCase().charCodeAt(0);
        if (code < 65 || code > 90) return 0;
        return ((code - 65) % 9) + 1;
    }

    /**
     * Calculates Output 1 - Chemin de vie (Life Path Number)
     * Based on birth date digits sum reduced to single digit
     * @param {string} birthDate - Birth date in YYYY-MM-DD format
     * @returns {number} - Life path number (1-9)
     */
    calculateOutput1(birthDate) {
        const date = new Date(birthDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        
        const allDigits = day + month + year;
        let sum = allDigits.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        
        return this.reduceToSingleDigit(sum);
    }

    /**
     * Reduces any number to a single digit (1-9)
     * @param {number} number - Number to reduce
     * @returns {number} - Single digit (1-9)
     */
    reduceToSingleDigit(number) {
        if (number <= 0) return 1;
        
        while (number > 9) {
            let sum = 0;
            const numberString = number.toString();
            for (let digit of numberString) {
                sum += parseInt(digit, 10);
            }
            number = sum;
        }
        
        return number === 0 ? 9 : number;
    }

    /**
     * Calculates Output 2 - Grille d'inclusion (Inclusion Grid)
     * Shows occurrence count of each number (1-9) in full name
     * @param {Object} firstNames - Object containing firstName1, firstName2, firstName3
     * @param {string} lastName - Last name
     * @returns {Array} - Array of objects with number, count, and display properties
     */
    calculateOutput2(firstNames, lastName) {
        let allLetters = '';
        
        if (firstNames.firstName1) allLetters += firstNames.firstName1;
        if (firstNames.firstName2) allLetters += firstNames.firstName2;
        if (firstNames.firstName3) allLetters += firstNames.firstName3;
        if (lastName) allLetters += lastName;

        const occurrences = {};
        for (let i = 1; i <= 9; i++) occurrences[i] = 0;

        for (let letter of allLetters.toUpperCase()) {
            const number = this.letterToNumber(letter);
            if (number >= 1 && number <= 9) {
                occurrences[number]++;
            }
        }

        const result = [];
        for (let i = 1; i <= 9; i++) {
            result.push({
                number: i,
                count: occurrences[i],
                display: occurrences[i] === 0 ? 'ô' : occurrences[i].toString()
            });
        }
        return result;
    }

    /**
     * Calculates Output 3 - Nombre d'expression (Expression Number)
     * Based on first name and last name letters sum reduced to single digit
     * @param {Object} firstNames - Object containing firstName1, firstName2, firstName3
     * @param {string} lastName - Last name
     * @returns {number} - Expression number (1-9)
     */
    calculateOutput3(firstNames, lastName) {
        let allLetters = '';
        
        if (firstNames.firstName1) allLetters += firstNames.firstName1;
        if (lastName) allLetters += lastName;

        let sum = 0;
        for (let letter of allLetters.toUpperCase()) {
            const number = this.letterToNumber(letter);
            if (number >= 1 && number <= 9) {
                sum += number;
            }
        }

        return this.reduceToSingleDigit(sum);
    }

    /**
     * Calculates Output 4 & 5 - Life Cycles
     * Determines the three life cycles and their age ranges based on life path number
     * @param {string} birthDate - Birth date in YYYY-MM-DD format
     * @param {number} output1 - Life path number from calculateOutput1
     * @returns {Object} - Object containing cycle1, cycle2, and cycle3 with age ranges and values
     */
    calculateCycles(birthDate, output1) {
        const date = new Date(birthDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const cycle1Ages = {
            1: "De la naissance à 27 ans", 2: "De la naissance à 26 ans", 
            3: "De la naissance à 25 ans", 4: "De la naissance à 24 ans",
            5: "De la naissance à 32 ans", 6: "De la naissance à 31 ans",
            7: "De la naissance à 30 ans", 8: "De la naissance à 29 ans",
            9: "De la naissance à 28 ans"
        };

        const cycle2Ages = {
            1: "De 27 à 54 ans", 2: "De 26 à 53 ans", 3: "De 25 à 52 ans", 
            4: "De 24 à 60 ans", 5: "De 32 à 59 ans", 6: "De 31 à 58 ans",
            7: "De 30 à 57 ans", 8: "De 29 à 56 ans", 9: "De 28 à 55 ans"
        };

        const cycle3Ages = {
            1: "A partir de 54 ans", 2: "A partir de 53 ans", 3: "A partir de 52 ans",
            4: "A partir de 60 ans", 5: "A partir de 59 ans", 6: "A partir de 58 ans",
            7: "A partir de 57 ans", 8: "A partir de 56 ans", 9: "A partir de 55 ans"
        };

        return {
            cycle1: {
                ageRange: cycle1Ages[output1],
                value: this.reduceToSingleDigit(month),
                label: "Cycle 1"
            },
            cycle2: {
                ageRange: cycle2Ages[output1], 
                value: this.reduceToSingleDigit(day),
                label: "Cycle 2"
            },
            cycle3: {
                ageRange: cycle3Ages[output1],
                value: this.reduceToSingleDigit(year),
                label: "Cycle 3"
            }
        };
    }

    /**
     * Calculates Réalisation 1 - First Realization Phase
     * Based on birth day + birth month, reduced to single digit
     * @param {string} birthDate - Birth date in YYYY-MM-DD format
     * @returns {number} - Realization 1 number (1-9)
     */
    calculateRealization1(birthDate) {
        const date = new Date(birthDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        
        const sum = day + month;
        return this.reduceToSingleDigit(sum);
    }
}