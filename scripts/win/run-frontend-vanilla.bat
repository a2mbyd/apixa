@echo off
REM Start the Vanilla example (Windows).
setlocal EnableExtensions
call "%~dp0..\lib\run-frontend.bat" "@apixa/example-vanilla" "Vanilla" "http://localhost:5175" "dev"
set "EXIT_CODE=%ERRORLEVEL%"
endlocal & exit /b %EXIT_CODE%
