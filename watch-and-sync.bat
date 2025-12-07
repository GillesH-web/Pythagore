@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo ========================================
echo  👁️ FILE WATCHER + AUTO-SYNC v2.2
echo  Monitors Changes and Runs Pipeline
echo ========================================
echo.

echo 🔍 Starting file monitoring system...
echo 🔍 Starting file monitoring system...
echo.

echo 📁 Monitoring these files for changes:
echo 📁 Monitoring these files for changes:
echo    - index.html
echo    - css/styles.css
echo    - js/*.js
echo    - ../index.html (root version)
echo.

echo 🤖 Auto-pipeline will run when changes detected
echo 🤖 Auto-pipeline will run when changes detected
echo.

REM Get initial file timestamps
for %%f in (index.html css\styles.css ..\index.html) do (
    for /f "tokens=*" %%a in ('powershell -Command "(Get-Item '%%f').LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss')"') do (
        set "INITIAL_%%~nxf=%%a"
    )
)

echo ✅ Initial timestamps captured
echo ✅ Initial timestamps captured
echo.

echo 👁️ WATCHING FOR CHANGES... (Press Ctrl+C to stop)
echo 👁️ WATCHING FOR CHANGES... (Press Ctrl+C to stop)
echo.

:WATCH_LOOP
timeout /t 5 /nobreak >nul

REM Check for file changes
set "CHANGES_DETECTED=false"

for %%f in (index.html css\styles.css ..\index.html) do (
    for /f "tokens=*" %%a in ('powershell -Command "(Get-Item '%%f').LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss')"') do (
        call set "CURRENT_TIME=%%a"
        call set "INITIAL_TIME=%%INITIAL_%%~nxf%%"
        
        if not "!CURRENT_TIME!"=="!INITIAL_TIME!" (
            echo 🔄 CHANGE DETECTED: %%f
            echo 🔄 CHANGE DETECTED: %%f
            echo    Previous: !INITIAL_TIME!
            echo    Current:  !CURRENT_TIME!
            set "CHANGES_DETECTED=true"
            set "INITIAL_%%~nxf=!CURRENT_TIME!"
        )
    )
)

if "!CHANGES_DETECTED!"=="true" (
    echo.
    echo 🚀 RUNNING AUTO-SYNC-DEPLOY PIPELINE...
    echo 🚀 RUNNING AUTO-SYNC-DEPLOY PIPELINE...
    echo.
    
    call auto-sync-deploy.bat
    
    echo.
    echo ✅ Pipeline completed, resuming monitoring...
    echo ✅ Pipeline completed, resuming monitoring...
    echo.
)

goto WATCH_LOOP