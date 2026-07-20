@echo off
echo ========================================
echo  IDC-System - Local Server
echo ========================================
echo.
echo Starting server at http://localhost:3000
echo.
echo Buka browser dan akses:
echo   http://localhost:3000
echo.
echo Tekan Ctrl+C untuk stop server.
echo ========================================
echo.
npx --yes serve . -p 3000
pause
