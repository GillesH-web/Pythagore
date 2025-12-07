@echo off
echo ========================================
echo  Push to GitHub Repository
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo ERROR: Git repository not initialized
    echo Please run setup-git.bat first
    pause
    exit /b 1
)

REM Prompt for GitHub repository URL
set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo ERROR: Repository URL cannot be empty
    pause
    exit /b 1
)

echo.
echo Adding remote repository...
git remote add origin %REPO_URL%

echo.
echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  Successfully pushed to GitHub!
    echo ========================================
    echo.
    echo Your site will be available at:
    echo https://USERNAME.github.io/REPOSITORY-NAME/
    echo.
    echo To enable GitHub Pages:
    echo 1. Go to your repository on GitHub
    echo 2. Click Settings tab
    echo 3. Scroll to Pages section
    echo 4. Select "Deploy from a branch"
    echo 5. Choose "main" branch and "/ (root)" folder
    echo 6. Click Save
    echo.
) else (
    echo.
    echo ERROR: Failed to push to GitHub
    echo Please check your repository URL and try again
    echo.
)

pause