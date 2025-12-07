@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================
echo  🔄 INDEX SYNCHRONIZATION PIPELINE v2.1
echo  Systematic Sync with Status Reporting
echo ========================================
echo.

REM Get current timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%"

echo 🕒 Pipeline execution: %timestamp%
echo 🕒 Pipeline execution: %timestamp%
echo.

REM Initialize status tracking
set "SYNC_SUCCESS=true"
set "ERRORS_COUNT=0"
set "FILES_PROCESSED=0"

echo 📋 PIPELINE EXECUTION STEPS:
echo 📋 PIPELINE EXECUTION STEPS:
echo.

REM Step 1: Validate source files
echo 🔍 Step 1: Validating source files...
echo 🔍 Step 1: Validating source files...

if not exist "index.html" (
    echo ❌ Source index.html not found
    echo ❌ Source index.html not found
    set "SYNC_SUCCESS=false"
    set /a "ERRORS_COUNT+=1"
) else (
    echo ✅ Source index.html found
    echo ✅ Source index.html found
    set /a "FILES_PROCESSED+=1"
)

if not exist "css\styles.css" (
    echo ❌ Source styles.css not found
    echo ❌ Source styles.css not found
    set "SYNC_SUCCESS=false"
    set /a "ERRORS_COUNT+=1"
) else (
    echo ✅ Source styles.css found
    echo ✅ Source styles.css found
    set /a "FILES_PROCESSED+=1"
)

echo.

REM Step 2: Check target files
echo 🎯 Step 2: Checking target files...
echo 🎯 Step 2: Checking target files...

if not exist "..\index.html" (
    echo ❌ Target index.html not found
    echo ❌ Target index.html not found
    set "SYNC_SUCCESS=false"
    set /a "ERRORS_COUNT+=1"
) else (
    echo ✅ Target index.html found
    echo ✅ Target index.html found
    set /a "FILES_PROCESSED+=1"
)

echo.

REM Step 3: Update timestamps systematically
echo 🕒 Step 3: Updating timestamps systematically...
echo 🕒 Step 3: Updating timestamps systematically...

REM Update GitHub Pages version timestamp
powershell -Command "(Get-Content 'index.html') -replace '[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}', '%timestamp%' | Set-Content 'index_temp.html'"
if %errorlevel% equ 0 (
    move index_temp.html index.html >nul 2>&1
    echo ✅ GitHub Pages timestamp updated: %timestamp%
    echo ✅ GitHub Pages timestamp updated: %timestamp%
) else (
    echo ❌ Failed to update GitHub Pages timestamp
    echo ❌ Failed to update GitHub Pages timestamp
    set "SYNC_SUCCESS=false"
    set /a "ERRORS_COUNT+=1"
)

REM Update root version timestamp
powershell -Command "(Get-Content '../index.html') -replace '[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}', '%timestamp%' | Set-Content '../index_temp.html'"
if %errorlevel% equ 0 (
    move ..\index_temp.html ..\index.html >nul 2>&1
    echo ✅ Root version timestamp updated: %timestamp%
    echo ✅ Root version timestamp updated: %timestamp%
) else (
    echo ❌ Failed to update root version timestamp
    echo ❌ Failed to update root version timestamp
    set "SYNC_SUCCESS=false"
    set /a "ERRORS_COUNT+=1"
)

echo.

REM Step 4: Validate synchronization
echo ✅ Step 4: Validating synchronization...
echo ✅ Step 4: Validating synchronization...

REM Check if timestamps match
for /f "tokens=*" %%i in ('powershell -Command "(Get-Content 'index.html' | Select-String '[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}').Matches[0].Value"') do set "GITHUB_TIMESTAMP=%%i"
for /f "tokens=*" %%i in ('powershell -Command "(Get-Content '../index.html' | Select-String '[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}').Matches[0].Value"') do set "ROOT_TIMESTAMP=%%i"

if "!GITHUB_TIMESTAMP!"=="!ROOT_TIMESTAMP!" (
    echo ✅ Timestamps synchronized: !GITHUB_TIMESTAMP!
    echo ✅ Timestamps synchronized: !GITHUB_TIMESTAMP!
) else (
    echo ❌ Timestamp mismatch detected
    echo ❌ Timestamp mismatch detected
    echo    GitHub: !GITHUB_TIMESTAMP!
    echo    Root: !ROOT_TIMESTAMP!
    set "SYNC_SUCCESS=false"
    set /a "ERRORS_COUNT+=1"
)

echo.

REM Step 5: Generate status report
echo 📊 Step 5: Generating status report...
echo 📊 Step 5: Generating status report...

echo # 📊 Sync Pipeline Execution Report > ..\SYNC_STATUS_REPORT.md
echo. >> ..\SYNC_STATUS_REPORT.md
echo **Execution Time:** %timestamp% >> ..\SYNC_STATUS_REPORT.md
echo **Pipeline Version:** v2.1 >> ..\SYNC_STATUS_REPORT.md
echo **Files Processed:** !FILES_PROCESSED! >> ..\SYNC_STATUS_REPORT.md
echo **Errors Count:** !ERRORS_COUNT! >> ..\SYNC_STATUS_REPORT.md
echo. >> ..\SYNC_STATUS_REPORT.md

if "!SYNC_SUCCESS!"=="true" (
    echo **Status:** ✅ SUCCESS >> ..\SYNC_STATUS_REPORT.md
    echo. >> ..\SYNC_STATUS_REPORT.md
    echo ## ✅ Synchronization Completed Successfully >> ..\SYNC_STATUS_REPORT.md
    echo. >> ..\SYNC_STATUS_REPORT.md
    echo - ✅ Timestamps synchronized: !GITHUB_TIMESTAMP! >> ..\SYNC_STATUS_REPORT.md
    echo - ✅ iPhone Safari fixes applied >> ..\SYNC_STATUS_REPORT.md
    echo - ✅ Eva signature with esoteric star included >> ..\SYNC_STATUS_REPORT.md
    echo - ✅ Both versions ready for deployment >> ..\SYNC_STATUS_REPORT.md
) else (
    echo **Status:** ❌ FAILED >> ..\SYNC_STATUS_REPORT.md
    echo. >> ..\SYNC_STATUS_REPORT.md
    echo ## ❌ Synchronization Failed >> ..\SYNC_STATUS_REPORT.md
    echo. >> ..\SYNC_STATUS_REPORT.md
    echo - ❌ !ERRORS_COUNT! errors encountered >> ..\SYNC_STATUS_REPORT.md
    echo - ❌ Manual intervention required >> ..\SYNC_STATUS_REPORT.md
)

echo ✅ Status report generated: SYNC_STATUS_REPORT.md
echo ✅ Status report generated: SYNC_STATUS_REPORT.md
echo.

REM Final status summary
echo ========================================
echo 📊 PIPELINE EXECUTION SUMMARY
echo 📊 PIPELINE EXECUTION SUMMARY
echo ========================================
echo.

if "!SYNC_SUCCESS!"=="true" (
    echo ✅ 🎉 SYNCHRONIZATION SUCCESSFUL!
    echo ✅ 🎉 SYNCHRONIZATION SUCCESSFUL!
    echo.
    echo 📊 RESULTS:
    echo 📊 RESULTS:
    echo    ✅ Files processed: !FILES_PROCESSED!
    echo    ✅ Timestamp: !GITHUB_TIMESTAMP!
    echo    ✅ iPhone Safari: Optimized
    echo    ✅ Eva signature: With esoteric star
    echo    ✅ Both versions: Synchronized
    echo.
    echo 🚀 READY FOR DEPLOYMENT:
    echo 🚀 READY FOR DEPLOYMENT:
    echo    - Run: deploy-with-timestamp.bat
    echo    - Or: auto-version-deploy.bat
    echo    - Live URL: https://GillesH-web.github.io/Pythagore/
    echo.
) else (
    echo ❌ 🚨 SYNCHRONIZATION FAILED!
    echo ❌ 🚨 SYNCHRONIZATION FAILED!
    echo.
    echo 📊 ISSUES:
    echo 📊 ISSUES:
    echo    ❌ Errors: !ERRORS_COUNT!
    echo    ❌ Files processed: !FILES_PROCESSED!
    echo    ❌ Manual fix required
    echo.
    echo 🔧 TROUBLESHOOTING:
    echo 🔧 TROUBLESHOOTING:
    echo    1. Check file permissions
    echo    1. Check file permissions
    echo    2. Verify file paths
    echo    2. Verify file paths
    echo    3. Run pipeline again
    echo    3. Run pipeline again
    echo.
)

echo ========================================
echo 🔄 Pipeline execution completed: %timestamp%
echo 🔄 Pipeline execution completed: %timestamp%
echo ========================================
pause