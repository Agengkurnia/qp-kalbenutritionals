@echo off
cd /d "%~dp0"
echo Starting Claim API on http://127.0.0.1:5055 ...
where py >nul 2>&1 && (
  py -3 server.py
) || (
  python server.py
)
pause
