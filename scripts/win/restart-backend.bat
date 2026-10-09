@echo off
REM Restart the Apixa FastAPI backend (Windows).
setlocal EnableExtensions

set "HERE=%~dp0"
call "%HERE%stop-backend.bat"
call "%HERE%run-backend.bat"
endlocal
