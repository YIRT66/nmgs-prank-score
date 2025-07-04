@echo off
REM 启动Vite开发服务器并自动打开浏览器
cd /d %~dp0
call npm install
call npm run dev 