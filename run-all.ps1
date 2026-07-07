# Script chay ca Frontend va Backend cung luc

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Khoi dong ung dung Quan Ly Thiet Bi" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Buoc 1: Khoi dong Backend
Write-Host "1. Khoi dong Backend (Python Flask)..." -ForegroundColor Yellow
$backendPath = "d:\ThucTap\du_an_truong\backend"
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; .\venv\Scripts\Activate.ps1; python app.py" -PassThru
Write-Host "   Backend dang chay tai http://localhost:5000" -ForegroundColor Green
Start-Sleep -Seconds 2

# Buoc 2: Khoi dong Frontend
Write-Host ""
Write-Host "2. Khoi dong Frontend (React)..." -ForegroundColor Yellow
$frontendPath = "d:\ThucTap\du_an_truong\frontend"
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start" -PassThru
Write-Host "   Frontend dang chay tai http://localhost:3000" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ca hai ung dung da khoi dong!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dang nhap voi:" -ForegroundColor Yellow
Write-Host "   Username: admin" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Nhan Ctrl+C de dung ung dung" -ForegroundColor Red
