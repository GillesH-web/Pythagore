@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================
echo  Déploiement Numérologie de Pythagore
echo  Automated GitHub Pages Deployment
echo ========================================
echo.

REM Set project-specific variables
set "PROJECT_NAME=Numérologie de Pythagore"
set "COMMIT_MESSAGE=Deploy: Numérologie de Pythagore v1.8.0 with all latest features"
set "EXPECTED_REPO_URL=https://github.com/GillesH-web/Pythagore.git"
set "EXPECTED_USERNAME=GillesH-web"

echo Vérification de l'installation Git...
echo Checking Git installation...
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: Git n'est pas installé sur ce système
    echo ❌ ERROR: Git is not installed on this system
    echo.
    echo 📥 Pour installer Git:
    echo 📥 To install Git:
    echo    1. Allez sur: https://git-scm.com/download/win
    echo    1. Go to: https://git-scm.com/download/win
    echo    2. Téléchargez et installez Git avec les paramètres par défaut
    echo    2. Download and install Git with default settings
    echo    3. Redémarrez votre terminal/PowerShell
    echo    3. Restart your terminal/PowerShell
    echo    4. Relancez ce script
    echo    4. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Git est installé et disponible
echo ✅ Git is installed and available
for /f "tokens=*" %%i in ('git --version') do echo    Version: %%i
echo.REM Rep
ository initialization
echo 📁 Initialisation du dépôt Git...
echo 📁 Initializing Git repository...
echo.

if exist ".git" (
    echo ℹ️  Dépôt Git existant détecté
    echo ℹ️  Existing Git repository detected
    echo.
    set /p CONTINUE="Continuer avec le dépôt existant? (y/n): "
    if /i "!CONTINUE!" neq "y" (
        echo Opération annulée par l'utilisateur
        echo Operation cancelled by user
        pause
        exit /b 0
    )
) else (
    echo Initialisation d'un nouveau dépôt Git...
    echo Initializing new Git repository...
    git init
    if %errorlevel% neq 0 (
        echo ❌ ERREUR: Impossible d'initialiser le dépôt Git
        echo ❌ ERROR: Failed to initialize Git repository
        pause
        exit /b 1
    )
    echo ✅ Dépôt Git initialisé avec succès
    echo ✅ Git repository initialized successfully
    echo.
)

REM Configure Git user if needed
echo 👤 Vérification de la configuration utilisateur Git...
echo 👤 Checking Git user configuration...

for /f "tokens=*" %%i in ('git config user.name 2^>nul') do set "GIT_USER_NAME=%%i"
for /f "tokens=*" %%i in ('git config user.email 2^>nul') do set "GIT_USER_EMAIL=%%i"

if "!GIT_USER_NAME!"=="" (
    set /p GIT_USER_NAME="Entrez votre nom Git / Enter your Git name: "
    git config user.name "!GIT_USER_NAME!"
)

if "!GIT_USER_EMAIL!"=="" (
    set /p GIT_USER_EMAIL="Entrez votre email Git / Enter your Git email: "
    git config user.email "!GIT_USER_EMAIL!"
)

echo ✅ Configuration utilisateur: !GIT_USER_NAME! ^<!GIT_USER_EMAIL!^>
echo ✅ User configuration: !GIT_USER_NAME! ^<!GIT_USER_EMAIL!^>
echo.

REM Stage all files
echo 📦 Ajout des fichiers au dépôt...
echo 📦 Adding files to repository...
git add .
if %errorlevel% neq 0 (
    echo ❌ ERREUR: Impossible d'ajouter les fichiers
    echo ❌ ERROR: Failed to add files
    pause
    exit /b 1
)

echo ✅ Fichiers ajoutés avec succès
echo ✅ Files added successfully
echo.

REM Create commit
echo 💾 Création du commit...
echo 💾 Creating commit...
git commit -m "%COMMIT_MESSAGE%"
if %errorlevel% neq 0 (
    echo ℹ️  Aucun changement à commiter ou commit déjà existant
    echo ℹ️  No changes to commit or commit already exists
)

echo ✅ Commit créé avec succès
echo ✅ Commit created successfully
echo.REM Remote
 repository configuration
echo 🔗 Configuration du dépôt distant GitHub...
echo 🔗 Configuring GitHub remote repository...
echo.

REM Check if remote already exists
for /f "tokens=*" %%i in ('git remote get-url origin 2^>nul') do set "EXISTING_REMOTE=%%i"

if "!EXISTING_REMOTE!"=="" (
    echo Aucun dépôt distant configuré
    echo No remote repository configured
    echo.
    
    echo 📋 URL de dépôt recommandée: %EXPECTED_REPO_URL%
    echo 📋 Recommended repository URL: %EXPECTED_REPO_URL%
    echo.
    
    set /p REPO_URL="Entrez l'URL de votre dépôt GitHub / Enter your GitHub repository URL: "
    
    if "!REPO_URL!"=="" (
        echo ❌ ERREUR: L'URL du dépôt ne peut pas être vide
        echo ❌ ERROR: Repository URL cannot be empty
        pause
        exit /b 1
    )
    
    echo Ajout du dépôt distant...
    echo Adding remote repository...
    git remote add origin "!REPO_URL!"
    if %errorlevel% neq 0 (
        echo ❌ ERREUR: Impossible d'ajouter le dépôt distant
        echo ❌ ERROR: Failed to add remote repository
        pause
        exit /b 1
    )
    
    echo ✅ Dépôt distant ajouté: !REPO_URL!
    echo ✅ Remote repository added: !REPO_URL!
) else (
    echo ℹ️  Dépôt distant existant: !EXISTING_REMOTE!
    echo ℹ️  Existing remote repository: !EXISTING_REMOTE!
    set "REPO_URL=!EXISTING_REMOTE!"
)
echo.

REM Authentication setup
echo 🔐 Configuration de l'authentification GitHub...
echo 🔐 Setting up GitHub authentication...
echo.

echo 👤 Nom d'utilisateur recommandé: %EXPECTED_USERNAME%
echo 👤 Recommended username: %EXPECTED_USERNAME%
echo.

set /p GITHUB_USERNAME="Entrez votre nom d'utilisateur GitHub / Enter your GitHub username: "
if "!GITHUB_USERNAME!"=="" (
    echo ❌ ERREUR: Le nom d'utilisateur ne peut pas être vide
    echo ❌ ERROR: Username cannot be empty
    pause
    exit /b 1
)

echo.
echo 🔑 Personal Access Token requis
echo 🔑 Personal Access Token required
echo.
echo ℹ️  Pour créer un token:
echo ℹ️  To create a token:
echo    1. Allez sur GitHub.com ^> Settings ^> Developer settings
echo    1. Go to GitHub.com ^> Settings ^> Developer settings
echo    2. Personal access tokens ^> Tokens (classic)
echo    2. Personal access tokens ^> Tokens (classic)
echo    3. Generate new token ^> Cochez "repo"
echo    3. Generate new token ^> Check "repo"
echo.

REM Note: Windows batch doesn't have built-in password masking
REM We'll use a workaround or ask user to be careful
echo ⚠️  ATTENTION: Le token sera visible pendant la saisie
echo ⚠️  WARNING: Token will be visible during input
echo    Assurez-vous que personne ne regarde votre écran
echo    Make sure nobody is looking at your screen
echo.

set /p GITHUB_TOKEN="Entrez votre Personal Access Token / Enter your Personal Access Token: "
if "!GITHUB_TOKEN!"=="" (
    echo ❌ ERREUR: Le token ne peut pas être vide
    echo ❌ ERROR: Token cannot be empty
    pause
    exit /b 1
)

echo.
echo ✅ Authentification configurée
echo ✅ Authentication configured
echo.REM Deploy
ment to GitHub
echo 🚀 Déploiement vers GitHub...
echo 🚀 Deploying to GitHub...
echo.

echo ℹ️  Préparation du push avec authentification...
echo ℹ️  Preparing push with authentication...

REM Create a temporary credential helper for this session
git config --local credential.helper store

REM Create temporary credentials file
echo https://!GITHUB_USERNAME!:!GITHUB_TOKEN!@github.com > .git-credentials
git config --local credential.helper "store --file=.git-credentials"

echo 📤 Push en cours vers GitHub...
echo 📤 Pushing to GitHub...
echo.

REM Attempt to push
git push -u origin main
set PUSH_RESULT=%errorlevel%

REM Clean up credentials immediately
if exist ".git-credentials" del ".git-credentials" >nul 2>&1
git config --local --unset credential.helper >nul 2>&1

REM Clear token variable for security
set "GITHUB_TOKEN="

if %PUSH_RESULT% neq 0 (
    echo.
    echo ❌ ERREUR: Échec du push vers GitHub
    echo ❌ ERROR: Failed to push to GitHub
    echo.
    echo 🔍 Causes possibles:
    echo 🔍 Possible causes:
    echo    - Token invalide ou expiré
    echo    - Invalid or expired token
    echo    - Permissions insuffisantes (vérifiez que "repo" est coché)
    echo    - Insufficient permissions (check that "repo" is selected)
    echo    - URL de dépôt incorrecte
    echo    - Incorrect repository URL
    echo    - Problème de réseau
    echo    - Network issue
    echo.
    echo 💡 Solutions:
    echo 💡 Solutions:
    echo    1. Vérifiez votre token sur GitHub.com
    echo    1. Verify your token on GitHub.com
    echo    2. Assurez-vous que le dépôt existe et est accessible
    echo    2. Make sure repository exists and is accessible
    echo    3. Relancez le script avec les bonnes informations
    echo    3. Run the script again with correct information
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ 🎉 DÉPLOIEMENT RÉUSSI!
echo ✅ 🎉 DEPLOYMENT SUCCESSFUL!
echo.
echo 📊 Résumé du déploiement:
echo 📊 Deployment summary:
echo    - Projet: %PROJECT_NAME%
echo    - Project: %PROJECT_NAME%
echo    - Dépôt: !REPO_URL!
echo    - Repository: !REPO_URL!
echo    - Utilisateur: !GITHUB_USERNAME!
echo    - User: !GITHUB_USERNAME!
echo    - Commit: %COMMIT_MESSAGE%
echo    - Commit: %COMMIT_MESSAGE%
echo.REM GitHu
b Pages activation guide
echo 🌐 ACTIVATION DE GITHUB PAGES
echo 🌐 GITHUB PAGES ACTIVATION
echo ========================================
echo.

REM Extract username and repo name from URL for live site URL
for /f "tokens=4,5 delims=/" %%a in ("!REPO_URL!") do (
    set "EXTRACTED_USER=%%a"
    set "EXTRACTED_REPO=%%b"
)

REM Remove .git extension if present
set "EXTRACTED_REPO=!EXTRACTED_REPO:.git=!"

echo 🔗 Votre site sera disponible à:
echo 🔗 Your site will be available at:
echo    https://!EXTRACTED_USER!.github.io/!EXTRACTED_REPO!/
echo.

echo 📋 ÉTAPES POUR ACTIVER GITHUB PAGES:
echo 📋 STEPS TO ACTIVATE GITHUB PAGES:
echo.
echo    1. 🌐 Allez sur votre dépôt GitHub:
echo    1. 🌐 Go to your GitHub repository:
echo       !REPO_URL!
echo.
echo    2. ⚙️  Cliquez sur l'onglet "Settings"
echo    2. ⚙️  Click on the "Settings" tab
echo.
echo    3. 📄 Dans la barre latérale gauche, trouvez "Pages"
echo    3. 📄 In the left sidebar, find "Pages"
echo.
echo    4. 🔧 Sous "Source", sélectionnez:
echo    4. 🔧 Under "Source", select:
echo       - "Deploy from a branch"
echo       - Branch: "main"
echo       - Folder: "/ (root)"
echo.
echo    5. 💾 Cliquez sur "Save"
echo    5. 💾 Click "Save"
echo.
echo    6. ⏳ Attendez 5-10 minutes pour la propagation
echo    6. ⏳ Wait 5-10 minutes for propagation
echo.

echo 🎯 FONCTIONNALITÉS INCLUSES:
echo 🎯 INCLUDED FEATURES:
echo    ✅ Interface 3 onglets (Piliers, Cycles, Phase de réalisation)
echo    ✅ 3-tab interface (Piliers, Cycles, Phase de réalisation)
echo    ✅ Calculs de cycles avec réduction des chiffres
echo    ✅ Cycle calculations with digit reduction
echo    ✅ 4 résultats de réalisation avec espacement optimal
echo    ✅ 4 realization results with optimal spacing
echo    ✅ Génération PDF professionnelle
echo    ✅ Professional PDF generation
echo    ✅ Design responsive
echo    ✅ Responsive design
echo    ✅ Interface en français
echo    ✅ French language interface
echo.

echo 🔧 DÉPANNAGE:
echo 🔧 TROUBLESHOOTING:
echo    - Assurez-vous que le dépôt est PUBLIC (requis pour GitHub Pages gratuit)
echo    - Make sure repository is PUBLIC (required for free GitHub Pages)
echo    - Vérifiez que index.html est dans le répertoire racine
echo    - Verify that index.html is in the root directory
echo    - Les changements peuvent prendre 5-10 minutes à apparaître
echo    - Changes may take 5-10 minutes to appear
echo    - Videz le cache de votre navigateur si nécessaire
echo    - Clear your browser cache if needed
echo.

echo 📞 SUPPORT:
echo 📞 SUPPORT:
echo    - Documentation GitHub Pages: https://docs.github.com/pages
echo    - En cas de problème, vérifiez les logs dans l'onglet Actions
echo    - If issues occur, check logs in the Actions tab
echo.

REM Final cleanup
echo 🧹 Nettoyage final...
echo 🧹 Final cleanup...

REM Clear any remaining sensitive variables
set "GITHUB_USERNAME="
set "REPO_URL="
set "GIT_USER_NAME="
set "GIT_USER_EMAIL="

echo ✅ Nettoyage terminé
echo ✅ Cleanup completed
echo.

echo ========================================
echo 🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!
echo 🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Merci d'avoir utilisé le déployeur automatique!
echo Thank you for using the automatic deployer!
echo.

pause
endlocal