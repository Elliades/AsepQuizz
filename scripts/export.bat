@echo off
setlocal

:: Zip name
set ZIP_NAME=deploy_package.zip

:: Delete old zip if it exists
if exist %ZIP_NAME% del %ZIP_NAME%

echo Creating deployment package...

:: Create a temporary directory
set TEMP_DIR=%TEMP%\asep_quiz_export
if exist %TEMP_DIR% rmdir /s /q %TEMP_DIR%
mkdir %TEMP_DIR%

:: Copy files to temp directory, excluding unwanted ones
echo Copying files...
xcopy /E /I /Y /EXCLUDE:scripts\exclude.txt . %TEMP_DIR%

:: Create the exclude.txt file if it doesn't exist
if not exist scripts\exclude.txt (
    echo node_modules > scripts\exclude.txt
    echo .git >> scripts\exclude.txt
    echo backups >> scripts\exclude.txt
    echo .idea >> scripts\exclude.txt
    echo test-reports >> scripts\exclude.txt
    echo test-results.txt >> scripts\exclude.txt
    echo *.log >> scripts\exclude.txt
    echo *.zip >> scripts\exclude.txt
    echo .env >> scripts\exclude.txt
)

:: Create the ZIP file using PowerShell
echo Creating ZIP archive...
powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('%TEMP_DIR%', '%CD%\%ZIP_NAME%')"

:: Clean up
rmdir /s /q %TEMP_DIR%

if exist %ZIP_NAME% (
    echo ✅ Archive created successfully: %ZIP_NAME%
) else (
    echo ❌ Error creating archive
    exit /b 1
)

echo.
echo Deployment package is ready for transfer to the server.
echo Use SCP or similar to transfer the package:
echo scp %ZIP_NAME% user@your-server:/path/to/destination/
echo.
pause