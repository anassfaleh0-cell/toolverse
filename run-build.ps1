$env:NODE_OPTIONS = "--max-old-space-size=16384"
Set-Location "C:\Users\user\Desktop\GENESIS\toolverse"
npm run build 2>&1 | Out-File "C:\Users\user\Desktop\GENESIS\toolverse\build-output.txt" -Encoding UTF8
Write-Output "BUILD_COMPLETE"
