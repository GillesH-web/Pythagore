@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================
echo  📱 TIMESTAMP DEPLOY v2.1
echo  Systematic Timestamp Updates
echo ========================================
echo.

REM Get current timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%"

REM Get current version from HTML file
for /f "tokens=*" %%i in ('powershell -Command "(Get-Content 'index.html' | Select-String 'v[0-9]+\.[0-9]+\.[0-9]+').Matches[0].Value"') do set "CURRENT_VERSION=%%i"
set "CURRENT_VERSION=!CURRENT_VERSION:v=!"

REM Ask user for deployment type
echo 🔢 Version actuelle: v!CURRENT_VERSION!
echo 🔢 Current version: v!CURRENT_VERSION!
echo 🕒 Nouveau timestamp: %timestamp%
echo 🕒 New timestamp: %timestamp%
echo.

echo Choisissez le type de déploiement:
echo Choose deployment type:
echo   1. Timestamp seulement (recommandé pour corrections mineures)
echo   1. Timestamp only (recommended for minor fixes)
echo   2. Version + Timestamp (pour nouvelles fonctionnalités)
echo   2. Version + Timestamp (for new features)
echo.

set /p DEPLOY_TYPE="Entrez votre choix (1 ou 2) / Enter your choice (1 or 2): "

if "!DEPLOY_TYPE!"=="1" (
    set "NEW_VERSION=!CURRENT_VERSION!"
    set "COMMIT_MESSAGE=Update: iPhone Safari fixes + Eva signature - %timestamp%"
    echo ✅ Déploiement avec timestamp seulement
    echo ✅ Timestamp-only deployment
) else if "!DEPLOY_TYPE!"=="2" (
    REM Auto-increment version
    for /f "tokens=1,2,3 delims=." %%a in ("!CURRENT_VERSION!") do (
        set /a "PATCH=%%c+1"
        set "NEW_VERSION=%%a.%%b.!PATCH!"
    )
    set "COMMIT_MESSAGE=Deploy: Numérologie v!NEW_VERSION! - iPhone Safari + Eva signature (%timestamp%)"
    echo ✅ Déploiement avec nouvelle version
    echo ✅ New version deployment
    echo 🔢 Version: v!CURRENT_VERSION! → v!NEW_VERSION!
) else (
    echo ❌ Choix invalide, utilisation du timestamp seulement
    echo ❌ Invalid choice, using timestamp only
    set "NEW_VERSION=!CURRENT_VERSION!"
    set "COMMIT_MESSAGE=Update: iPhone Safari fixes + Eva signature - %timestamp%"
)

echo.
echo 📝 Mise à jour des fichiers...
echo 📝 Updating files...

REM Update HTML file with new version and timestamp
powershell -Command "(Get-Content 'index.html') -replace 'v[0-9]+\.[0-9]+\.[0-9]+', 'v!NEW_VERSION!' -replace '[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}', '%timestamp%' | Set-Content 'index_temp.html'"
move index_temp.html index.html

REM Update version manager if it exists
if exist "js\version-manager.js" (
    powershell -Command "(Get-Content 'js/version-manager.js') -replace 'currentVersion = ''[0-9]+\.[0-9]+\.[0-9]+''', 'currentVersion = ''!NEW_VERSION!''' -replace 'buildTimestamp = ''[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}''', 'buildTimestamp = ''%timestamp%''' | Set-Content 'js/version-manager_temp.js'"
    move js\version-manager_temp.js js\version-manager.js
)

echo ✅ Fichiers mis à jour
echo ✅ Files updated
echo    - Version: v!NEW_VERSION!
echo    - Timestamp: %timestamp%
echo.

REM Pre-configured GitHub settings
set "GITHUB_USERNAME=GillesH-web"
set "REPO_URL=https://github.com/GillesH-web/Pythagore.git"
set "GITHUB_TOKEN=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"

echo 🚀 Configuration de déploiement:
echo 🚀 Deployment configuration:
echo    - Version: v!NEW_VERSION!
echo    - Timestamp: %timestamp%
echo    - Utilisateur: %GITHUB_USERNAME%
echo    - User: %GITHUB_USERNAME%
echo    - Dépôt: %REPO_URL%
echo    - Repository: %REPO_URL%
echo.

REM Check Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git requis pour le déploiement automatique
    echo ❌ Git required for automatic deployment
    echo.
    echo 📋 UPLOAD MANUEL:
    echo 📋 MANUAL UPLOAD:
    echo    1. Allez sur: https://github.com/GillesH-web/Pythagore
    echo    1. Go to: https://github.com/GillesH-web/Pythagore
    echo    2. Uploadez tous les fichiers mis à jour
    echo    2. Upload all updated files
    echo    3. Settings → Pages → Deploy from branch → main
    echo.
    echo ✅ Version v!NEW_VERSION! prête pour upload manuel
    echo ✅ Version v!NEW_VERSION! ready for manual upload
    pause
    exit /b 0
)

REM Git deployment
echo 📁 Configuration Git...
echo 📁 Git setup...
if not exist ".git" (
    git init
    git config user.name "%GITHUB_USERNAME%"
    git config user.email "gilles.hestin@gmail.com"
)

echo 📦 Ajout des fichiers avec timestamp...
echo 📦 Adding files with timestamp...
git add .

echo 💾 Commit avec timestamp systématique...
echo 💾 Committing with systematic timestamp...
git commit -m "!COMMIT_MESSAGE!"

echo 🔗 Configuration remote...
echo 🔗 Remote setup...
git remote remove origin >nul 2>&1
git remote add origin "%REPO_URL%"

echo 🚀 Push vers GitHub...
echo 🚀 Pushing to GitHub...
echo https://%GITHUB_USERNAME%:%GITHUB_TOKEN%@github.com > .git-credentials
git config credential.helper "store --file=.git-credentials"

git push -u origin main
set RESULT=%errorlevel%

del .git-credentials >nul 2>&1
git config --unset credential.helper >nul 2>&1

if %RESULT% equ 0 (
    echo.
    echo ✅ 🎉 DÉPLOIEMENT RÉUSSI!
    echo ✅ 🎉 DEPLOYMENT SUCCESSFUL!
    echo.
    echo 📊 RÉSUMÉ:
    echo 📊 SUMMARY:
    echo    ✅ Version: v!NEW_VERSION!
    echo    ✅ Timestamp: %timestamp%
    echo    ✅ iPhone Safari optimisé
    echo    ✅ iPhone Safari optimized
    echo    ✅ Eva signature avec étoile
    echo    ✅ Eva signature with star
    echo    ✅ Timestamp systématique
    echo    ✅ Systematic timestamp
    echo.
    echo 🌐 Site disponible à:
    echo 🌐 Site available at:
    echo    https://GillesH-web.github.io/Pythagore/
    echo.
    echo 📱 CORRECTIONS IPHONE SAFARI:
    echo 📱 IPHONE SAFARI FIXES:
    echo    ✅ Bouton calculer visible
    echo    ✅ Calculate button visible
    echo    ✅ Safe area compliance
    echo    ✅ Safe area compliance
    echo    ✅ Boutons 48px tactiles
    echo    ✅ 48px touch buttons
    echo.
    echo 🕒 TIMESTAMP SYSTÉMATIQUE:
    echo 🕒 SYSTEMATIC TIMESTAMP:
    echo    ✅ Mis à jour à chaque déploiement
    echo    ✅ Updated on every deployment
    echo    ✅ Traçabilité complète
    echo    ✅ Full traceability
    echo    ✅ Indépendant du versioning
    echo    ✅ Independent of versioning
    echo.
) else (
    echo ❌ Erreur de déploiement
    echo ❌ Deployment error
    echo Fichiers mis à jour localement, upload manuel possible
    echo Files updated locally, manual upload possible
)

echo ========================================
echo 📱 v!NEW_VERSION! déployée avec timestamp %timestamp%!
echo 📱 v!NEW_VERSION! deployed with timestamp %timestamp%!
echo ========================================
pause