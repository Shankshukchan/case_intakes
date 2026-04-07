# 🚀 GitHub Setup Quick Guide

Complete these steps to push your project to a public GitHub repository.

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in details:
   - **Repository name:** `case-intake-mini-module`
   - **Description:** "Full-stack case intake and hearing task tracker (MERN + TypeScript)"
   - **Visibility:** Select **PUBLIC** ⭐ (Important!)
   - **Initialize with:** Leave unchecked (you have a README already)
3. Click **"Create repository"**
4. Copy the HTTPS URL from the page (it will look like: `https://github.com/YOUR_USERNAME/case-intake-mini-module.git`)

---

## Step 2: Initialize Git Locally

Open terminal and navigate to your project:

```bash
cd /home/shankshukchan/Downloads/Case\ Intake\ Mini\ Module
```

Initialize git:

```bash
# Initialize git repo
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Case Intake Mini Module - Full Stack MERN with TypeScript"

# Rename branch to main (GitHub default)
git branch -M main
```

---

## Step 3: Connect to GitHub

Link your local repo to GitHub (replace URL with your repo URL):

```bash
git remote add origin https://github.com/YOUR_USERNAME/case-intake-mini-module.git
```

Verify connection:

```bash
git remote -v
```

You should see:

```
origin  https://github.com/YOUR_USERNAME/case-intake-mini-module.git (fetch)
origin  https://github.com/YOUR_USERNAME/case-intake-mini-module.git (push)
```

---

## Step 4: Push to GitHub

```bash
git push -u origin main
```

You may be prompted for credentials:

- **Username:** Your GitHub username
- **Password:** Your GitHub personal access token or password

(If you need a personal access token, see: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## Step 5: Verify

1. Open your repository on GitHub: `https://github.com/YOUR_USERNAME/case-intake-mini-module`
2. Verify:
   - [ ] Repository is marked as PUBLIC
   - [ ] All files are visible (README.md, package.json, src/, backend/, etc.)
   - [ ] README displays properly
   - [ ] You can see git commit history

---

## 🔄 Making Updates After Initial Push

After the initial push, if you make changes locally:

```bash
# See what changed
git status

# Add changes
git add .

# Commit with meaningful message
git commit -m "Update: Fixed bug in case validation"

# Push to GitHub
git push origin main
```

---

## 📋 Complete Workflow Commands

**One-time setup:**

```bash
cd /home/shankshukchan/Downloads/Case\ Intake\ Mini\ Module
git init
git add .
git commit -m "Initial commit: Case Intake Mini Module"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/case-intake-mini-module.git
git push -u origin main
```

**Future pushes:**

```bash
cd /home/shankshukchan/Downloads/Case\ Intake\ Mini\ Module
git add .
git commit -m "Your commit message"
git push origin main
```

---

## ✅ Before Pushing - Final Checks

Make sure your .gitignore is working:

```bash
# Check what will be pushed (should NOT include node_modules, .env, dist)
git status
```

**Files and directories that SHOULD BE in .gitignore** (and NOT pushed):

- ❌ `node_modules/`
- ❌ `backend/node_modules/`
- ❌ `dist/`
- ❌ `.env`
- ❌ `.env.local`
- ❌ `backend/.env`

**Files that SHOULD be pushed:**

- ✅ `src/` (with all components, hooks, services, pages)
- ✅ `backend/src/` (with all routes, models, middleware)
- ✅ `package.json` and `backend/package.json`
- ✅ `README.md` and other documentation
- ✅ `.gitignore`
- ✅ `vite.config.ts`, `tsconfig.json`, etc.

Your .gitignore is already configured, so just verify nothing was missed:

```bash
# Verify .gitignore
cat .gitignore
```

---

## 🎯 Your GitHub Repository URL

After completing these steps, your repository will be at:

```
https://github.com/YOUR_USERNAME/case-intake-mini-module
```

This is the link you'll provide in your submission! 🎉

---

## 🆘 Troubleshooting

### "fatal: not a git repository"

**Solution:** Make sure you're in the correct directory:

```bash
cd /home/shankshukchan/Downloads/Case\ Intake\ Mini\ Module
pwd  # Verify you're in the right place
```

### "error: pathspec 'main' did not match any files"

**Solution:** Git needs at least one commit before renaming branch:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
```

### "Everything up-to-date" when pushing

**Solution:** You may have already pushed. Check GitHub to verify.

```bash
git log --oneline  # See your commit history
```

### "Permission denied" or "Authentication failed"

**Solution:** Create a personal access token:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select scopes: repo (all)
4. Copy token
5. Use token as password when git prompts

### Want to verify files before pushing?

```bash
# See all files that will be tracked
git ls-files

# See files that would be ignored
git ls-files --others --ignored --exclude-standard
```

---

## 📞 Help & Resources

- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub Quick Start](https://docs.github.com/en/get-started/quickstart)
- [About .gitignore](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files)

---

**Ready? You're all set! 🚀**

After following these steps, you'll have:

- ✅ Public GitHub repository
- ✅ All code pushed and visible
- ✅ Repository URL ready for submission

Next step: Record your demo video!
