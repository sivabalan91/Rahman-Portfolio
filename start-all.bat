@echo off
title Rahman Portfolio - Full Stack Launcher
echo ============================================
echo  Abdul Rahman Portfolio - Dev Launcher
echo ============================================
echo.

echo [1/2] Starting BACKEND (http://localhost:5000)...
echo       (stores submissions + sends email notifications)
start "Rahman Backend" cmd /k "cd /d ""%~dp0server"" & npm install & npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting REACT FRONTEND (http://localhost:5173)...
echo.
cd /d "%~dp0react-app"
npm run dev

pause