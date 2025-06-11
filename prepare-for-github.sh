#!/bin/bash

echo "========================================"
echo "  Demo ERP - GitHub Preparation Script"
echo "========================================"
echo

echo "1. Checking if Git is installed..."
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed or not in PATH"
    echo "Please install Git from https://git-scm.com/"
    exit 1
fi
echo "✓ Git is installed"

echo
echo "2. Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed"

echo
echo "3. Installing dependencies..."
if ! npm install; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"

echo
echo "4. Running linting..."
if ! npm run lint; then
    echo "WARNING: Linting found issues, but continuing..."
fi

echo
echo "5. Testing build process..."
if ! npm run build; then
    echo "ERROR: Build failed"
    exit 1
fi
echo "✓ Build successful"

echo
echo "6. Initializing Git repository..."
if [ ! -d ".git" ]; then
    git init
    echo "✓ Git repository initialized"
else
    echo "✓ Git repository already exists"
fi

echo
echo "7. Adding all files to Git..."
git add .
echo "✓ Files added to Git"

echo
echo "8. Creating initial commit..."
if git commit -m "Initial commit: Demo ERP system" &> /dev/null; then
    echo "✓ Initial commit created"
else
    echo "✓ Files already committed or no changes to commit"
fi

echo
echo "========================================"
echo "  PREPARATION COMPLETE!"
echo "========================================"
echo
echo "Next steps:"
echo "1. Create a new repository on GitHub named 'demo-erp'"
echo "2. Run these commands:"
echo "   git remote add origin https://github.com/YOUR-USERNAME/demo-erp.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo
echo "3. Enable GitHub Pages in repository settings"
echo
echo "See DEPLOYMENT_GUIDE.md for detailed instructions."
echo
read -p "Press Enter to continue..."
