@echo off
REM Start the Apixa FastAPI backend for local development (Windows).
setlocal EnableExtensions

set "ROOT=%~dp0..\.."
set "BACKEND=%ROOT%\backend"
set "HERE=%~dp0"
if "%APIXA_BACKEND_HOST%"=="" set "APIXA_BACKEND_HOST=127.0.0.1"
if "%APIXA_BACKEND_PORT%"=="" set "APIXA_BACKEND_PORT=8787"
set "PID_FILE=%BACKEND%\.backend.pid"

cd /d "%BACKEND%" || (
  echo Could not enter backend directory: %BACKEND%
  exit /b 1
)

if exist "%PID_FILE%" (
  set /p OLD_PID=<"%PID_FILE%"
  tasklist /FI "PID eq %OLD_PID%" 2>nul | find "%OLD_PID%" >nul
  if not errorlevel 1 (
    echo Backend already running ^(pid %OLD_PID%^). Stop it first: scripts\win\stop-backend.bat
    exit /b 1
  )
  del /f /q "%PID_FILE%" >nul 2>&1
)

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  set "PY=py -3"
) else (
  where python >nul 2>&1
  if %ERRORLEVEL%==0 (
    set "PY=python"
  ) else (
    echo Python 3 is required but was not found.
    exit /b 1
  )
)

if not exist ".venv\Scripts\python.exe" (
  echo Creating virtualenv at backend\.venv ...
  %PY% -m venv .venv
  if errorlevel 1 exit /b 1
)

set "VENV_PY=%CD%\.venv\Scripts\python.exe"

"%VENV_PY%" -m pip install --upgrade pip >nul
"%VENV_PY%" -m pip install -r requirements.txt
if errorlevel 1 exit /b 1

echo Apixa backend -^> http://%APIXA_BACKEND_HOST%:%APIXA_BACKEND_PORT%
echo API docs      -^> http://%APIXA_BACKEND_HOST%:%APIXA_BACKEND_PORT%/docs

powershell -NoProfile -Command ^
  "$p = Start-Process -FilePath '%VENV_PY%' -ArgumentList '-m','uvicorn','app.main:app','--host','%APIXA_BACKEND_HOST%','--port','%APIXA_BACKEND_PORT%','--reload' -PassThru -NoNewWindow; Set-Content -Path '%PID_FILE%' -Value $p.Id -NoNewline; Wait-Process -Id $p.Id"

if exist "%PID_FILE%" del /f /q "%PID_FILE%" >nul 2>&1
endlocal
