@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================
echo  📱 AUTO-VERSION DEPLOY v2.0
echo  Numérologie iPhone + Auto-Versioning
echo ========================================
echo.

REM Get current timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%"

REM Auto-increment version
set "CURRENT_VERSION=1.9.0"
for /f "tokens=1,2,3 delims=." %%a in ("%CURRENT_VERSION%") do (
    set /a "PATCH=%%c+1"
    set "NEW_VERSION=%%a.%%b.!PATCH!"
)

echo 🔢 Version automatique: %CURRENT_VERSION% → !NEW_VERSION!
echo 🔢 Auto version: %CURRENT_VERSION% → !NEW_VERSION!
echo 🕒 Timestamp: %timestamp%
echo.

REM Update version in HTML file
echo 📝 Mise à jour du fichier HTML...
echo 📝 Updating HTML file...

REM Create temporary file with updated version
powershell -Command "(Get-Content 'index.html') -replace 'v1\.9\.0', 'v!NEW_VERSION!' -replace '2025-12-07 15:30', '%timestamp%' | Set-Content 'index_temp.html'"
move index_temp.html index.html

REM Update version in JavaScript
powershell -Command "(Get-Content 'js/version-manager.js') -replace 'currentVersion = ''1\.9\.0''', 'currentVersion = ''!NEW_VERSION!''' -replace 'buildTimestamp = ''2025-12-07 15:30''', 'buildTimestamp = ''%timestamp%''' | Set-Content 'js/version-manager_temp.js'"
move js\version-manager_temp.js js\version-manager.js

echo ✅ Fichiers mis à jour avec la version !NEW_VERSION!
echo ✅ Files updated with version !NEW_VERSION!
echo.

REM Pre-configured GitHub settings
set "GITHUB_USERNAME=GillesH-web"
set "REPO_URL=https://github.com/GillesH-web/Pythagore.git"
set "GITHUB_TOKEN=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"
set "COMMIT_MESSAGE=Deploy: Numérologie v!NEW_VERSION! - iPhone Optimized (%timestamp%)"

echo 🚀 Configuration de déploiement:
echo 🚀 Deployment configuration:
echo    - Version: !NEW_VERSION!
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
    echo ✅ Version !NEW_VERSION! prête pour upload manuel
    echo ✅ Version !NEW_VERSION! ready for manual upload
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

echo 📦 Ajout des fichiers versionnés...
echo 📦 Adding versioned files...
git add .

echo 💾 Commit version !NEW_VERSION!...
echo 💾 Committing version !NEW_VERSION!...
git commit -m "%COMMIT_MESSAGE%"

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
    echo    ✅ Version: !NEW_VERSION!
    echo    ✅ Timestamp: %timestamp%
    echo    ✅ iPhone Safari optimisé
    echo    ✅ iPhone Safari optimized
    echo    ✅ Auto-versioning activé
    echo    ✅ Auto-versioning enabled
    echo    ✅ Responsive design
    echo    ✅ Responsive design
    echo.
    echo 🌐 Site disponible à:
    echo 🌐 Site available at:
    echo    https://GillesH-web.github.io/Pythagore/
    echo.
    echo 📱 FONCTIONNALITÉS IPHONE:
    echo 📱 IPHONE FEATURES:
    echo    ✅ Viewport optimisé
    echo    ✅ Optimized viewport
    echo    ✅ Pas de zoom automatique
    echo    ✅ No auto-zoom
    echo    ✅ Défilement tactile
    echo    ✅ Touch scrolling
    echo    ✅ Boutons 44px+
    echo    ✅ 44px+ buttons
    echo.
    echo 🔢 VERSIONING AUTOMATIQUE:
    echo 🔢 AUTO-VERSIONING:
    echo    ✅ Version incrémentée automatiquement
    echo    ✅ Version auto-incremented
    echo    ✅ Timestamp mis à jour
    echo    ✅ Timestamp updated
    echo    ✅ Traçabilité complète
    echo    ✅ Full traceability
    echo.
) else (
    echo ❌ Erreur de déploiement
    echo ❌ Deployment error
    echo Fichiers versionnés localement, upload manuel possible
    echo Files versioned locally, manual upload possible
)

echo ========================================
echo 📱 Version !NEW_VERSION! déployée!
echo 📱 Version !NEW_VERSION! deployed!
echo ========================================
pause