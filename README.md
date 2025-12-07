# Numérologie de Pythagore v1.8.0

Une application web moderne pour calculer les nombres numérologiques selon les méthodes de Pythagore.

## 🌟 Fonctionnalités

### Calculs Numérologiques
- **Chemin de vie (Output 1)** - Basé sur la date de naissance
- **Grille d'inclusion (Output 2)** - Analyse des occurrences des nombres dans le nom complet
- **Nombre d'expression (Output 3)** - Basé sur le prénom principal et nom de famille
- **Cycles de vie (Output 4 & 5)** - Trois cycles de réalisation avec leurs périodes d'âge

### Interface Utilisateur
- **Interface à onglets** - Piliers et Cycles séparés pour une meilleure organisation
- **Validation en temps réel** - Vérification immédiate des saisies
- **Design responsive** - Optimisé pour tous les appareils
- **Génération PDF** - Rapports professionnels téléchargeables
- **Impression** - Fonction d'impression intégrée

## 🚀 Démo en Ligne

L'application est déployée sur GitHub Pages : [Voir la démo](https://votre-username.github.io/github-pages-pythagore)

## 📋 Prérequis

- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- JavaScript activé
- Connexion internet (pour les CDN externes)

## 🛠️ Installation Locale

### Cloner le Projet
```bash
git clone https://github.com/votre-username/github-pages-pythagore.git
cd github-pages-pythagore
```

### Serveur Local
Pour éviter les problèmes CORS, utilisez un serveur local :

#### Avec Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Avec Node.js
```bash
npx http-server
```

#### Avec PHP
```bash
php -S localhost:8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## 📁 Structure du Projet

```
github-pages-pythagore/
├── index.html              # Page principale
├── css/
│   └── styles.css          # Styles CSS organisés
├── js/
│   ├── app.js              # Coordinateur principal
│   ├── calculator.js       # Logique de calcul
│   ├── validator.js        # Validation des entrées
│   ├── results-display.js  # Affichage des résultats
│   ├── form-handler.js     # Gestion des formulaires
│   └── test-suite.js       # Suite de tests automatisés
├── assets/
│   └── images/             # Images et icônes
├── _config.yml             # Configuration GitHub Pages
├── .gitignore              # Fichiers à ignorer
└── README.md               # Documentation
```

## 🎯 Utilisation

### Saisie des Données
1. **Prénom 1** (obligatoire) - Premier prénom
2. **Prénom 2** (optionnel) - Deuxième prénom
3. **Prénom 3** (optionnel) - Troisième prénom
4. **Nom de famille** (obligatoire) - Nom de famille
5. **Date de naissance** (obligatoire) - Format JJ/MM/AAAA

### Validation
- Seules les lettres, espaces, tirets et apostrophes sont autorisés dans les noms
- La date de naissance doit être dans le passé
- Les champs obligatoires doivent être remplis

### Résultats
#### Onglet 1 : Piliers
- **Chemin de vie** - Votre nombre directeur
- **Nombre d'expression** - Votre potentiel
- **Grille d'inclusion** - Tableau des occurrences numériques

#### Onglet 2 : Cycles
- **Cycle 1** - Période de formation (basé sur le mois de naissance)
- **Cycle 2** - Période de réalisation (basé sur le jour de naissance)
- **Cycle 3** - Période de sagesse (basé sur l'année de naissance)

### Actions
- **Générer PDF** - Télécharge un rapport complet
- **Imprimer** - Imprime les résultats
- **Réinitialiser** - Efface tous les champs

## 🧪 Tests

### Suite de Tests Automatisés
Le projet inclut une suite de tests complète pour vérifier tous les calculs et fonctionnalités :

#### Accès aux Tests
- **Page de tests dédiée** : Ouvrez `test.html` dans votre navigateur
- **Tests automatiques** : Ajoutez `?test=true` à l'URL pour lancer les tests au chargement
- **Console développeur** : Les résultats sont affichés dans la console

#### Types de Tests
- **Tests unitaires** - Validation de chaque méthode de calcul
- **Tests d'intégration** - Scénarios complets avec données réelles
- **Tests de validation** - Vérification des règles de saisie
- **Tests de cas limites** - Gestion des valeurs extrêmes

#### Cas de Tests Inclus
```javascript
// Exemples de cas testés
- Jean-Pierre Martin, 15/03/1985 → Chemin de vie: 5
- Marie-Claire Dubois, 01/01/2000 → Chemin de vie: 4
- Conversion lettres: A=1, I=9, J=1, Z=8
- Réduction nombres: 11→2, 29→2, 0→9
```

### Lancer les Tests
```bash
# Serveur local puis ouvrir test.html
python -m http.server 8000
# Naviguer vers http://localhost:8000/test.html
```

## 🔧 Développement

### Architecture
L'application suit une architecture modulaire :

- **Calculator** - Tous les calculs numérologiques
- **Validator** - Validation des entrées utilisateur
- **ResultsDisplay** - Rendu et affichage des résultats
- **FormHandler** - Gestion des interactions utilisateur
- **App** - Coordination générale et initialisation

### Méthodes de Calcul

#### Chemin de Vie (Output 1)
```javascript
// Somme de tous les chiffres de la date de naissance
// Exemple: 15/03/1985 → 1+5+0+3+1+9+8+5 = 32 → 3+2 = 5
```

#### Grille d'Inclusion (Output 2)
```javascript
// Compte les occurrences de chaque nombre (1-9) dans le nom complet
// A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=1, K=2, etc.
```

#### Nombre d'Expression (Output 3)
```javascript
// Somme des valeurs numériques du prénom principal + nom de famille
// Réduit à un chiffre unique (1-9)
```

#### Cycles de Vie (Output 4 & 5)
```javascript
// Cycle 1: Mois de naissance
// Cycle 2: Jour de naissance  
// Cycle 3: Année de naissance
// Périodes d'âge basées sur le chemin de vie
```

## 🚀 Déploiement GitHub Pages

### Configuration Automatique
1. Forkez ou clonez ce repository
2. Activez GitHub Pages dans les paramètres du repository
3. Sélectionnez la branche `main` comme source
4. L'application sera disponible à `https://votre-username.github.io/github-pages-pythagore`

### Configuration Manuelle
1. Créez un nouveau repository sur GitHub
2. Uploadez tous les fichiers du projet
3. Allez dans Settings → Pages
4. Sélectionnez "Deploy from a branch"
5. Choisissez "main" et "/ (root)"
6. Cliquez sur "Save"

## 🎨 Personnalisation

### Styles CSS
Modifiez `css/styles.css` pour personnaliser l'apparence :
- Couleurs dans les variables CSS
- Tailles de police et espacements
- Animations et transitions

### Calculs
Modifiez `js/calculator.js` pour ajuster les méthodes de calcul :
- Correspondances lettres-nombres
- Logique de réduction
- Périodes des cycles

## 🐛 Dépannage

### Problèmes Courants
- **Erreur CORS** : Utilisez un serveur local
- **PDF ne se génère pas** : Vérifiez la connexion internet (CDN jsPDF)
- **Calculs incorrects** : Vérifiez la saisie des données

### Support Navigateurs
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Numérologie de Pythagore v1.8.0** - Découvrez votre chemin de vie numérique ! ✨