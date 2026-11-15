@echo off
title NEXA AI - Conversational Intelligence Assistant
color 0D
echo ===================================================
echo             NEXA AI - Startup Script
echo ===================================================
echo.

set PATH=C:\Users\Lenovo\.gemini\antigravity\scratch\node\node-v20.18.0-win-x64;%PATH%

cd /d "%~dp0\server"
echo [1/2] Starting NEXA AI Express Server on port 5000...
echo [2/2] Serving React frontend on http://localhost:5000...
echo.
echo Open your browser and navigate to: http://localhost:5000
echo.
node server.js
pause
