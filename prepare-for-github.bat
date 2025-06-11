@echo off
echo ========================================
echo   Demo ERP - GitHub Preparation Script
echo ========================================
echo.

echo 1. Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)
echo ✓ Git is installed

echo.
echo 2. Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo 3. Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo 4. Running linting...
call npm run lint
if %errorlevel% neq 0 (
    echo WARNING: Linting found issues, but continuing...
)

echo.
echo 5. Testing build process...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo ✓ Build successful

echo.
echo 6. Initializing Git repository...
if not exist .git (
    git init
    echo ✓ Git repository initialized
) else (
    echo ✓ Git repository already exists
)

echo.
echo 7. Adding all files to Git...
git add .
echo ✓ Files added to Git

echo.
echo 8. Creating initial commit...
git commit -m "Initial commit: Demo ERP system" >nul 2>&1
if %errorlevel% neq 0 (
    echo ✓ Files already committed or no changes to commit
) else (
    echo ✓ Initial commit created
)

echo.
echo ========================================
echo   PREPARATION COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Create a new repository on GitHub named 'demo-erp'
echo 2. Run these commands:
echo    git remote add origin https://github.com/YOUR-USERNAME/demo-erp.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Enable GitHub Pages in repository settings
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions.
echo.
pause
