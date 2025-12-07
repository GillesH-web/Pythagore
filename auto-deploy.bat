@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================
echo  AUTO-DEPLOY: Numérologie de Pythagore
echo  All credentials pre-configured
echo ========================================
echo.

REM Pre-configured settings
set "GITHUB_USERNAME=GillesH-web"
set "REPO_URL=https://github.com/GillesH-web/Pythagore.git"
set "GITHUB_TOKEN=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"
set "COMMIT_MESSAGE=Deploy: Numérologie de Pythagore v1.8.0 with all latest features"

echo ✅ Configuration pré-remplie:
echo ✅ Pre-filled configuration:
echo    - Utilisateur: %GITHUB_USERNAME%
echo    - User: %GITHUB_USERNAME%
echo    - Dépôt: %REPO_URL%
echo    - Repository: %REPO_URL%
echo    - Token: ghp_****************************
echo.

REM Check Git installation
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git n'est pas installé. Installez Git depuis:
    echo ❌ Git is not installed. Install Git from:
    echo    https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git détecté
echo ✅ Git detected
echo.

REM Initialize repository if needed
if not exist ".git" (
    echo 📁 Initialisation du dépôt...
    git init
    git config user.name "%GITHUB_USERNAME%"
    git config user.email "gilles.hestin@gmail.com"
)

echo 📦 Ajout des fichiers...
git add .

echo 💾 Création du commit...
git commit -m "%COMMIT_MESSAGE%"

echo 🔗 Configuration du dépôt distant...
git remote remove origin >nul 2>&1
git remote add origin "%REPO_URL%"

echo 🚀 Push vers GitHub...
echo https://%GITHUB_USERNAME%:%GITHUB_TOKEN%@github.com > .git-credentials
git config credential.helper "store --file=.git-credentials"

git push -u origin main

REM Cleanup
del .git-credentials >nul 2>&1
git config --unset credential.helper >nul 2>&1

if %errorlevel% equ 0 (
    echo.
    echo ✅ 🎉 SUCCÈS! Votre site sera disponible à:
    echo ✅ 🎉 SUCCESS! Your site will be available at:
    echo    https://GillesH-web.github.io/Pythagore/
    echo.
    echo 📋 Pour activer GitHub Pages:
    echo 📋 To activate GitHub Pages:
    echo    1. Allez sur: https://github.com/GillesH-web/Pythagore
    echo    1. Go to: https://github.com/GillesH-web/Pythagore
    echo    2. Settings → Pages → Deploy from branch → main → Save
    echo.
) else (
    echo ❌ Erreur lors du push. Vérifiez votre connexion.
    echo ❌ Push error. Check your connection.
)

pause