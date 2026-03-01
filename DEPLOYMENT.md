# GitHub Pages Deployment Guide

Your site is now configured to work on **both** user sites and project sites. Follow these steps to deploy:

## Deployment Steps

### 1. Create a GitHub repository

- Go to [github.com/new](https://github.com/new)
- Name your repository:
  - **For root URL** (e.g., `https://yourusername.github.io/`): Use `yourusername.github.io`
  - **For project URL** (e.g., `https://yourusername.github.io/unblockedgames.github.io/`): Use any name like `unblockedgames.github.io`

### 2. Push your code

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch **main** and folder **/ (root)**
4. Click **Save**
5. Wait a few minutes for the site to deploy

### 4. View your site

- **User/org site** (`repo` = `username.github.io`): `https://yourusername.github.io`
- **Project site**: `https://yourusername.github.io/repo-name/`

---

## What Was Fixed

- **Base URL script**: Detects project vs user site and sets the correct base path
- **Relative paths**: All `/assets/`, `/game/`, `/category/` links now use relative paths
- **Search**: Updated to work with the base URL

## Adding New HTML Files

If you add new HTML files, run `fix-github-pages.ps1` to add the base script and fix paths:

```powershell
powershell -ExecutionPolicy Bypass -File fix-github-pages.ps1
```
