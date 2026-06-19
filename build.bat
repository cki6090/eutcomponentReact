@echo off
cd /d %~dp0
if not exist node_modules (
  call npm.cmd install
)
node node_modules\next\dist\bin\next build
