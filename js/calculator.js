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

    /**
     * Calculates Réalisation 2 - Second Realization Phase
     * Based on birth day + birth year, reduced to single digit
     * @param {string} birthDate - Birth date in YYYY-MM-DD format
     * @returns {number} - Realization 2 number (1-9)
     */
    calculateRealization2(birthDate) {
        const date = new Date(birthDate);
        const day = date.getDate();
        const year = date.getFullYear();
        
        const sum = day + year;
        return this.reduceToSingleDigit(sum);
    }

    /**
     * Calculates Réalisation 3 - Third Realization Phase
     * Based on Réalisation 1 + Réalisation 2, reduced to single digit
     * @param {string} birthDate - Birth date in YYYY-MM-DD format
     * @returns {number} - Realization 3 number (1-9)
     */
    calculateRealization3(birthDate) {
        const realization1 = this.calculateRealization1(birthDate);
        const realization2 = this.calculateRealization2(birthDate);
        
        const sum = realization1 + realization2;
        return this.reduceToSingleDigit(sum);
    }

    /**
     * Calculates Réalisation 4 - Fourth Realization Phase
     * Based on birth year + birth month, reduced to single digit
     * @param {string} birthDate - Birth date in YYYY-MM-DD format
     * @returns {number} - Realization 4 number (1-9)
     */
    calculateRealization4(birthDate) {
        const date = new Date(birthDate);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const sum = year + month;
        return this.reduceToSingleDigit(sum);
    }

    /**
     * Calculates health, feelings and heredity analysis
     * @param {Object} formData - Form data with names and birth date
     * @returns {Object} - Health analysis data
     */
    calculateHealthAnalysis(formData) {
        const healthNumber = this.calculateHealthNumber(formData);
        const feelingsNumber = this.calculateFeelingsNumber(formData);
        const heredityNumber = this.calculateHeredityNumber(formData);
        
        return {
            health: {
                number: healthNumber,
                tendencies: this.getHealthTendencies(healthNumber),
                advice: this.getHealthAdvice(healthNumber),
                attention: this.getHealthAttention(healthNumber)
            },
            feelings: {
                number: feelingsNumber,
                tendencies: this.getFeelingsTendencies(feelingsNumber),
                advice: this.getFeelingsAdvice(feelingsNumber),
                attention: this.getFeelingsAttention(feelingsNumber)
            },
            heredity: {
                number: heredityNumber,
                tendencies: this.getHeredityTendencies(heredityNumber),
                advice: this.getHeredityAdvice(heredityNumber),
                attention: this.getHeredityAttention(heredityNumber)
            }
        };
    }

    /**
     * Calculates health number based on first name only
     * @param {Object} formData - Form data
     * @returns {number} - Health number (1-9)
     */
    calculateHealthNumber(formData) {
        const firstName1 = formData.firstName1.toUpperCase();
        let firstName1Sum = 0;
        
        for (let char of firstName1) {
            firstName1Sum += this.letterToNumber(char);
        }
        
        return this.reduceToSingleDigit(firstName1Sum);
    }

    /**
     * Calculates feelings number based on firstName2 and firstName3
     * @param {Object} formData - Form data
     * @returns {number} - Feelings number (1-9)
     */
    calculateFeelingsNumber(formData) {
        let firstName2Sum = 0;
        let firstName3Sum = 0;
        
        if (formData.firstName2) {
            const firstName2 = formData.firstName2.toUpperCase();
            for (let char of firstName2) {
                firstName2Sum += this.letterToNumber(char);
            }
        }
        
        if (formData.firstName3) {
            const firstName3 = formData.firstName3.toUpperCase();
            for (let char of firstName3) {
                firstName3Sum += this.letterToNumber(char);
            }
        }
        
        const totalSum = firstName2Sum + firstName3Sum;
        return this.reduceToSingleDigit(totalSum);
    }

    /**
     * Calculates heredity number based on family name
     * @param {Object} formData - Form data
     * @returns {number} - Heredity number (1-9)
     */
    calculateHeredityNumber(formData) {
        const lastName = formData.lastName.toUpperCase();
        let sum = 0;
        
        for (let char of lastName) {
            sum += this.letterToNumber(char);
        }
        
        return this.reduceToSingleDigit(sum);
    }

    /**
     * Get health tendencies based on health number
     * @param {number} number - Health number
     * @returns {string} - Health tendencies description
     */
    getHealthTendencies(number) {
        const tendencies = {
            1: "Énergie vitale forte, tendance aux maux de tête, problèmes cardiaques possibles",
            2: "Sensibilité du système nerveux, problèmes digestifs, fragilité émotionnelle",
            3: "Bonne vitalité générale, attention à la gorge et aux voies respiratoires",
            4: "Constitution robuste, tendance aux problèmes osseux et articulaires",
            5: "Système nerveux actif, attention aux addictions, problèmes de circulation",
            6: "Équilibre général, sensibilité au niveau du cœur et des reins",
            7: "Fragilité du système immunitaire, tendance aux troubles psychosomatiques",
            8: "Force physique, attention aux excès, problèmes de foie possibles",
            9: "Énergie fluctuante, sensibilité aux infections, besoin de repos régulier"
        };
        return tendencies[number] || tendencies[1];
    }

    /**
     * Get health advice based on health number
     * @param {number} number - Health number
     * @returns {string} - Health advice
     */
    getHealthAdvice(number) {
        const advice = {
            1: "Pratiquez la méditation, évitez le surmenage, exercice physique régulier",
            2: "Alimentation équilibrée, gestion du stress, environnement calme",
            3: "Expression créative, chant, évitez les environnements pollués",
            4: "Activité physique structurée, étirements, alimentation riche en calcium",
            5: "Variété dans l'alimentation, évitez les excitants, voyages bénéfiques",
            6: "Vie familiale harmonieuse, activités artistiques, soins esthétiques",
            7: "Moments de solitude, méditation, contact avec la nature",
            8: "Modération dans tout, gestion du stress professionnel, massages",
            9: "Activités humanitaires, évitez l'isolement, thérapies alternatives"
        };
        return advice[number] || advice[1];
    }

    /**
     * Get health attention points based on health number
     * @param {number} number - Health number
     * @returns {string} - Health attention points
     */
    getHealthAttention(number) {
        const attention = {
            1: "Évitez l'autoritarisme excessif, surveillez la tension artérielle",
            2: "Attention aux troubles anxieux, évitez les conflits",
            3: "Ne négligez pas les signaux de fatigue, évitez la dispersion",
            4: "Attention à la rigidité mentale et physique, évitez la sédentarité",
            5: "Surveillez les excès, attention aux accidents, évitez l'instabilité",
            6: "Ne vous sacrifiez pas pour les autres, évitez la possessivité",
            7: "Attention à l'isolement excessif, évitez les pensées négatives",
            8: "Surveillez l'ambition démesurée, attention aux troubles digestifs",
            9: "Évitez l'épuisement émotionnel, attention aux allergies"
        };
        return attention[number] || attention[1];
    }

    /**
     * Get feelings tendencies based on feelings number
     * @param {number} number - Feelings number
     * @returns {string} - Feelings tendencies description
     */
    getFeelingsTendencies(number) {
        const tendencies = {
            1: "Leadership émotionnel, indépendance affective, passion intense",
            2: "Sensibilité extrême, besoin d'harmonie, coopération naturelle",
            3: "Expression émotionnelle créative, optimisme, sociabilité",
            4: "Stabilité émotionnelle, loyauté, besoin de sécurité affective",
            5: "Liberté émotionnelle, curiosité sentimentale, adaptabilité",
            6: "Amour familial, responsabilité affective, dévouement",
            7: "Profondeur émotionnelle, introspection, spiritualité",
            8: "Ambition dans les relations, contrôle émotionnel, intensité",
            9: "Compassion universelle, idéalisme, générosité émotionnelle"
        };
        return tendencies[number] || tendencies[1];
    }

    /**
     * Get feelings advice based on feelings number
     * @param {number} number - Feelings number
     * @returns {string} - Feelings advice
     */
    getFeelingsAdvice(number) {
        const advice = {
            1: "Cultivez la patience, apprenez à écouter, tempérez votre ego",
            2: "Affirmez-vous davantage, fixez des limites, cultivez la confiance",
            3: "Canalisez votre énergie, évitez la superficialité, soyez authentique",
            4: "Ouvrez-vous au changement, exprimez vos émotions, soyez flexible",
            5: "Approfondissez vos relations, cultivez la constance, évitez la fuite",
            6: "Prenez soin de vous, évitez le sacrifice excessif, gardez votre indépendance",
            7: "Partagez vos émotions, évitez l'isolement, cultivez l'empathie",
            8: "Développez la tendresse, évitez la domination, cultivez l'humilité",
            9: "Ancrez-vous dans le réel, évitez l'idéalisation, protégez votre énergie"
        };
        return advice[number] || advice[1];
    }

    /**
     * Get feelings attention points based on feelings number
     * @param {number} number - Feelings number
     * @returns {string} - Feelings attention points
     */
    getFeelingsAttention(number) {
        const attention = {
            1: "Attention à l'égocentrisme, évitez l'impatience en amour",
            2: "Évitez la dépendance affective, attention à la manipulation",
            3: "Attention à l'inconstance, évitez les relations superficielles",
            4: "Évitez la possessivité, attention à la jalousie excessive",
            5: "Attention à l'infidélité, évitez l'engagement par peur",
            6: "Évitez le contrôle excessif, attention au sacrifice de soi",
            7: "Attention à la froideur apparente, évitez l'isolement émotionnel",
            8: "Évitez la domination, attention aux relations intéressées",
            9: "Attention à l'épuisement émotionnel, évitez l'utopie relationnelle"
        };
        return attention[number] || attention[1];
    }

    /**
     * Get heredity tendencies based on heredity number
     * @param {number} number - Heredity number
     * @returns {string} - Heredity tendencies description
     */
    getHeredityTendencies(number) {
        const tendencies = {
            1: "Héritage de leadership, force de caractère familiale, indépendance ancestrale",
            2: "Sensibilité héréditaire, coopération familiale, diplomatie ancestrale",
            3: "Créativité familiale, expression artistique héritée, joie de vivre",
            4: "Stabilité familiale, traditions solides, persévérance héréditaire",
            5: "Liberté ancestrale, aventure familiale, adaptabilité héritée",
            6: "Amour familial fort, responsabilité héréditaire, dévouement ancestral",
            7: "Sagesse familiale, spiritualité héritée, recherche de vérité",
            8: "Ambition familiale, réussite matérielle héritée, pouvoir ancestral",
            9: "Humanisme familial, générosité héritée, idéalisme ancestral"
        };
        return tendencies[number] || tendencies[1];
    }

    /**
     * Get heredity advice based on heredity number
     * @param {number} number - Heredity number
     * @returns {string} - Heredity advice
     */
    getHeredityAdvice(number) {
        const advice = {
            1: "Honorez l'héritage familial tout en gardant votre individualité",
            2: "Cultivez l'harmonie familiale, médiez les conflits ancestraux",
            3: "Exprimez la créativité familiale, partagez la joie héritée",
            4: "Préservez les traditions tout en permettant l'évolution",
            5: "Équilibrez liberté personnelle et liens familiaux",
            6: "Servez la famille sans vous oublier, transmettez l'amour",
            7: "Partagez la sagesse familiale, cultivez la spiritualité",
            8: "Utilisez l'héritage matériel avec sagesse et générosité",
            9: "Canalisez l'idéalisme familial vers des actions concrètes"
        };
        return advice[number] || advice[1];
    }

    /**
     * Get heredity attention points based on heredity number
     * @param {number} number - Heredity number
     * @returns {string} - Heredity attention points
     */
    getHeredityAttention(number) {
        const attention = {
            1: "Évitez de reproduire l'autoritarisme familial, libérez-vous des schémas",
            2: "Attention à la dépendance familiale excessive, affirmez votre individualité",
            3: "Évitez la superficialité héritée, cultivez la profondeur",
            4: "Attention à la rigidité familiale, permettez l'innovation",
            5: "Évitez l'instabilité héritée, créez vos propres racines",
            6: "Attention au sacrifice familial excessif, préservez votre autonomie",
            7: "Évitez l'isolement familial, partagez votre sagesse",
            8: "Attention à l'avidité héritée, cultivez la générosité",
            9: "Évitez l'utopie familiale, ancrez-vous dans la réalité"
        };
        return attention[number] || attention[1];
    }
}