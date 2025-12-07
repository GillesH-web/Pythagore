@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================
echo  📱 DEPLOY: Numérologie iPhone Optimized
echo  GitHub Pages Deployment v2.0
echo ========================================
echo.

REM Pre-configured settings for your project
set "GITHUB_USERNAME=GillesH-web"
set "REPO_URL=https://github.com/GillesH-web/Pythagore.git"
set "GITHUB_TOKEN=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"
set "COMMIT_MESSAGE=Deploy: Numérologie v1.8.0 - iPhone Safari Optimized"

echo ✅ Configuration iPhone Safari:
echo ✅ iPhone Safari Configuration:
echo    - Utilisateur: %GITHUB_USERNAME%
echo    - User: %GITHUB_USERNAME%
echo    - Dépôt: %REPO_URL%
echo    - Repository: %REPO_URL%
echo    - Token: ghp_****************************
echo    - Optimisations: iPhone Safari, Touch, Responsive
echo    - Optimizations: iPhone Safari, Touch, Responsive
echo.

REM Check Git installation
echo 🔍 Vérification Git...
echo 🔍 Checking Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git non installé. Téléchargez depuis:
    echo ❌ Git not installed. Download from:
    echo    https://git-scm.com/download/win
    echo.
    echo 📱 Alternative: Upload manuel via navigateur
    echo 📱 Alternative: Manual upload via browser
    echo    1. Allez sur: https://github.com/GillesH-web/Pythagore
    echo    1. Go to: https://github.com/GillesH-web/Pythagore
    echo    2. Glissez-déposez tous les fichiers
    echo    2. Drag and drop all files
    echo    3. Settings → Pages → Deploy from branch → main
    echo.
    pause
    exit /b 1
)

echo ✅ Git disponible
echo ✅ Git available
echo.

REM Initialize repository if needed
echo 📁 Configuration du dépôt...
echo 📁 Repository setup...
if not exist ".git" (
    git init
    git config user.name "%GITHUB_USERNAME%"
    git config user.email "gilles.hestin@gmail.com"
    echo ✅ Nouveau dépôt initialisé
    echo ✅ New repository initialized
) else (
    echo ✅ Dépôt existant détecté
    echo ✅ Existing repository detected
)

REM Stage files with iPhone optimizations
echo 📦 Ajout des fichiers optimisés iPhone...
echo 📦 Adding iPhone-optimized files...
git add .

echo 💾 Commit des améliorations iPhone...
echo 💾 Committing iPhone improvements...
git commit -m "%COMMIT_MESSAGE%"

REM Configure remote
echo 🔗 Configuration GitHub...
echo 🔗 GitHub configuration...
git remote remove origin >nul 2>&1
git remote add origin "%REPO_URL%"

REM Deploy with authentication
echo 🚀 Déploiement vers GitHub...
echo 🚀 Deploying to GitHub...

REM Create temporary credentials
echo https://%GITHUB_USERNAME%:%GITHUB_TOKEN%@github.com > .git-credentials
git config credential.helper "store --file=.git-credentials"

REM Push to GitHub
git push -u origin main
set DEPLOY_RESULT=%errorlevel%

REM Cleanup credentials
del .git-credentials >nul 2>&1
git config --unset credential.helper >nul 2>&1

if %DEPLOY_RESULT% equ 0 (
    echo.
    echo ✅ 🎉 DÉPLOIEMENT RÉUSSI!
    echo ✅ 🎉 DEPLOYMENT SUCCESSFUL!
    echo.
    echo 📱 AMÉLIORATIONS IPHONE INCLUSES:
    echo 📱 IPHONE IMPROVEMENTS INCLUDED:
    echo    ✅ Viewport optimisé pour iPhone
    echo    ✅ iPhone-optimized viewport
    echo    ✅ Support du notch/Dynamic Island
    echo    ✅ Notch/Dynamic Island support
    echo    ✅ Prévention du zoom automatique
    echo    ✅ Auto-zoom prevention
    echo    ✅ Défilement tactile fluide
    echo    ✅ Smooth touch scrolling
    echo    ✅ Boutons tactiles 44px minimum
    echo    ✅ 44px minimum touch targets
    echo    ✅ Layout responsive mobile
    echo    ✅ Mobile responsive layout
    echo.
    echo 🌐 Votre site iPhone-optimisé sera disponible à:
    echo 🌐 Your iPhone-optimized site will be available at:
    echo    https://GillesH-web.github.io/Pythagore/
    echo.
    echo 📋 ACTIVATION GITHUB PAGES:
    echo 📋 GITHUB PAGES ACTIVATION:
    echo    1. https://github.com/GillesH-web/Pythagore
    echo    2. Settings → Pages
    echo    3. Deploy from branch → main → / (root)
    echo    4. Save
    echo    5. Attendez 5-10 minutes
    echo    5. Wait 5-10 minutes
    echo.
    echo 📱 TEST SUR IPHONE:
    echo 📱 IPHONE TESTING:
    echo    - Interface tactile optimisée
    echo    - Touch-optimized interface
    echo    - Pas de zoom accidentel
    echo    - No accidental zooming
    echo    - Défilement fluide
    echo    - Smooth scrolling
    echo    - Boutons faciles à toucher
    echo    - Easy-to-touch buttons
    echo.
) else (
    echo ❌ Erreur de déploiement
    echo ❌ Deployment error
    echo Vérifiez votre connexion et réessayez
    echo Check your connection and try again
)

echo ========================================
echo 📱 Déploiement iPhone terminé!
echo 📱 iPhone deployment completed!
echo ========================================
pause