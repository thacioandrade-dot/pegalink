@echo off
cd /d "%~dp0"
start "PegaLink - Servidor" cmd /k "node server.js"
start "PegaLink - Tunel Cloudflare" cmd /k ""%~dp0bin\cloudflared.exe" tunnel --url http://localhost:3000"
echo PegaLink iniciado. A URL publica aparece na janela do Tunel Cloudflare.
pause
