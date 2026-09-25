# PowerShell script to execute schema.sql on Read_Acdmi database in PostgreSQL 18
param (
    [string]$Password = ""
)

if (-not $Password) {
    $Password = Read-Host -Prompt "Enter PostgreSQL 'postgres' user password" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

$env:PGPASSWORD = $Password
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

if (-not (Test-Path $psqlPath)) {
    Write-Error "psql.exe not found at $psqlPath"
    exit 1
}

Write-Host "Connecting to PostgreSQL and applying schema.sql to 'Read_Acdmi'..." -ForegroundColor Cyan
& $psqlPath -h localhost -p 5432 -U postgres -d Read_Acdmi -f "$PSScriptRoot\schema.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n Schema created successfully in Read_Acdmi!" -ForegroundColor Green
    $applySeed = Read-Host "Do you want to insert sample demo seed data? (Y/N)"
    if ($applySeed -eq "Y" -or $applySeed -eq "y") {
        & $psqlPath -h localhost -p 5432 -U postgres -d Read_Acdmi -f "$PSScriptRoot\seed.sql"
        Write-Host "Seed data inserted successfully!" -ForegroundColor Green
    }
} else {
    Write-Host "`n Failed to execute schema. Please verify your password." -ForegroundColor Red
}
