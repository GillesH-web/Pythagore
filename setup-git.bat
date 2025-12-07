@echo off
echo ========================================
echo  Git Repository Setup for Numerologie
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b 1
)

echo Git is installed. Proceeding with repository setup...
echo.

REM Initialize git repository
echo Initializing Git repository...
git init

REM Add all files
echo Adding all files to repository...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: Numerologie de Pythagore v1.8.0 - Complete application with 3 tabs, cycle calculations, and realization phases"

echo.
echo ========================================
echo  Repository initialized successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Create a repository on GitHub
echo 2. Copy the repository URL
echo 3. Run: git remote add origin YOUR_REPO_URL
echo 4. Run: git push -u origin main
echo.
pause