# 🚀 GitHub Deployment Guide

This guide will help you upload your Demo ERP project to GitHub and deploy it to GitHub Pages.

## 📋 Prerequisites

Before starting, make sure you have:
- A GitHub account
- Git installed on your computer
- Your project files ready (this folder)

## 🎯 Step-by-Step Instructions

### Step 1: Create a New GitHub Repository

1. **Go to GitHub** and sign in to your account
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Fill in the repository details**:
   - Repository name: `demo-erp`
   - Description: `A comprehensive Enterprise Resource Planning (ERP) system demo built with Next.js, TypeScript, and Tailwind CSS`
   - Make it **Public** (so GitHub Pages works for free)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. **Click "Create repository"**

### Step 2: Prepare Your Local Project

1. **Open Command Prompt/Terminal** in your `frontend-demo` folder
2. **Initialize Git** (if not already done):
   ```bash
   git init
   ```
3. **Add all files**:
   ```bash
   git add .
   ```
4. **Make your first commit**:
   ```bash
   git commit -m "Initial commit: Demo ERP system"
   ```

### Step 3: Connect to GitHub

1. **Add your GitHub repository as remote**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/demo-erp.git
   ```
   Replace `YOUR-USERNAME` with your actual GitHub username

2. **Push your code to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Step 4: Enable GitHub Pages

1. **Go to your repository** on GitHub
2. **Click on "Settings"** tab
3. **Scroll down to "Pages"** in the left sidebar
4. **Under "Source"**, select "GitHub Actions"
5. **The deployment will start automatically** when you push code

### Step 5: Update Repository Information

1. **Edit the following files** to replace placeholder information:

   **In `package.json`**:
   ```json
   "homepage": "https://YOUR-USERNAME.github.io/demo-erp",
   "repository": {
     "type": "git",
     "url": "https://github.com/YOUR-USERNAME/demo-erp.git"
   },
   "bugs": {
     "url": "https://github.com/YOUR-USERNAME/demo-erp/issues"
   },
   "author": "Your Name <your.email@example.com>",
   ```

   **In `README.md`**:
   - Update the live demo link
   - Replace `your-username` with your GitHub username
   - Update author information

2. **Commit and push the changes**:
   ```bash
   git add .
   git commit -m "Update repository information"
   git push
   ```

## 🌐 Accessing Your Deployed Site

After deployment (usually takes 2-5 minutes):
- Your site will be available at: `https://YOUR-USERNAME.github.io/demo-erp`
- Check the "Actions" tab to see deployment progress
- Any future pushes to the `main` branch will automatically redeploy

## 🔧 Troubleshooting

### Common Issues:

1. **404 Error on GitHub Pages**:
   - Make sure GitHub Pages is enabled
   - Check that the deployment action completed successfully
   - Verify the repository name matches the configuration

2. **Build Fails**:
   - Check the "Actions" tab for error details
   - Ensure all dependencies are properly listed in package.json
   - Make sure there are no TypeScript errors

3. **Assets Not Loading**:
   - Verify the `basePath` in `next.config.js` matches your repository name
   - Check that `assetPrefix` is correctly configured

### Getting Help:
- Check the GitHub Actions logs for detailed error messages
- Review the Next.js documentation for static exports
- Open an issue in your repository if you need help

## 🎉 Success!

Once deployed, you'll have:
- ✅ A professional GitHub repository
- ✅ Automatic deployments on every push
- ✅ A live demo accessible to anyone
- ✅ Professional documentation and setup

Your Demo ERP system is now live and ready to showcase! 🚀
