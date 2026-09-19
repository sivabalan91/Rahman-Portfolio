@echo off
title Rahman Portfolio - Backend (http://localhost:5000)
echo ============================================
echo  Starting BACKEND - http://localhost:5000
echo  (stores submissions + sends email)
echo  Press Ctrl+C to stop.
echo ============================================
echo.
cd /d "%~dp0"
npm run dev
pause