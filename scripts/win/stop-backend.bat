@echo off
REM Stop the Apixa FastAPI backend (Windows).
setlocal EnableExtensions EnableDelayedExpansion

set "ROOT=%~dp0..\.."
set "BACKEND=%ROOT%\backend"
if "%APIXA_BACKEND_PORT%"=="" set "APIXA_BACKEND_PORT=8787"
set "PID_FILE=%BACKEND%\.backend.pid"
set "STOPPED=0"

if exist "%PID_FILE%" (
  set /p PID=<"%PID_FILE%"
  if not "!PID!"=="" (
    tasklist /FI "PID eq !PID!" 2>nul | find "!PID!" >nul
    if not errorlevel 1 (
      echo Stopping backend pid !PID! ...
      taskkill /PID !PID! /T /F >nul 2>&1
      set "STOPPED=1"
    )
  )
  del /f /q "%PID_FILE%" >nul 2>&1
)

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%APIXA_BACKEND_PORT% .*LISTENING"') do (
  echo Stopping process listening on port %APIXA_BACKEND_PORT% ^(pid %%P^) ...
  taskkill /PID %%P /T /F >nul 2>&1
  set "STOPPED=1"
)

if "%STOPPED%"=="1" (
  echo Backend stopped.
) else (
  echo Backend is not running ^(nothing on port %APIXA_BACKEND_PORT%^).
)
endlocal
