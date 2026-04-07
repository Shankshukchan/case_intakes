# 📋 Submission Checklist & Guide

Complete this checklist to ensure your submission meets all requirements.

## ✅ Submission Requirements

### 1. Public GitHub Repository ✓

- [ ] **Create/Verify GitHub Repository**
  - Go to https://github.com/new
  - Name: `case-intake-mini-module` (or similar)
  - Make it **Public** (important!)
  - Initialize without README (you have one already)
  - Click "Create repository"

- [ ] **Setup Git Locally (if not already done)**

  ```bash
  cd /home/shankshukchan/Downloads/Case\ Intake\ Mini\ Module
  git init
  git add .
  git commit -m "Initial commit: Case Intake Mini Module - Full Stack MERN"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/case-intake-mini-module.git
  git push -u origin main
  ```

- [ ] **Verify Repository is Public**
  - Visit your repository URL: `https://github.com/YOUR_USERNAME/case-intake-mini-module`
  - Should be accessible without login
  - Code should be visible to everyone

---

### 2. Comprehensive README ✓

Your **README.md** already includes all required sections:

- [x] **Local setup and run commands**

  ```bash
  Lines: 197-287 of README.md
  Includes both backend and frontend setup
  Covers MongoDB setup (local and Atlas)
  ```

- [x] **Tech stack summary**

  ```
  Lines: 423-447 of README.md
  Frontend: React + TypeScript + Vite
  Backend: Express + Node.js + TypeScript
  Database: MongoDB
  Styling: Tailwind CSS + shadcn/ui
  ```

- [x] **Architecture and folder structure overview**

  ```
  Lines: 82-177 of README.md
  Backend directory structure with descriptions
  Frontend service layer architecture
  Custom hooks organization
  Component hierarchy
  Pages/routes structure
  ```

- [x] **Assumptions and known limitations**

  ```
  Lines: 407-416 of README.md
  Lists 8 key assumptions and limitations:
  - Single-user session
  - No persistent JWT tokens
  - Demo data seeding is manual
  - No rate limiting
  - No audit trails
  - Simple MongoDB setup
  - No real-time updates
  ```

- [x] **Bonus features documented**

  ```
  Lines: 49-70 of README.md
  Bonus 2: Role-Based Access Control
  - Admin and Intern roles
  - Role switcher in header
  - Delete restrictions for non-admins
  - Where to test: Switch role dropdown in header

  Additional bonuses:
  - Responsive Design (mobile-first)
  - Loading States & Empty States
  - Clear Visual Hierarchy
  ```

---

### 3. Demo Video (2-5 minutes)

#### Step-by-Step Video Recording Guide

**Prerequisites:**

- OBS Studio (free, https://obsproject.com) OR
- Built-in screen recorder (Mac: Cmd+Shift+5, Windows: Win+Shift+S)

**Video Content Structure (2-5 minutes):**

1. **Introduction (10-15 seconds)**
   - Show project name in terminal
   - Brief description of what you'll demo

   ```
   "This is the Case Intake Mini Module - a full-stack MERN application
   for legal operations case management with task tracking."
   ```

2. **Setup Instructions (30-45 seconds)**
   - Show running: `npm install` in root
   - Show running: `cd backend && npm install`
   - Show running: `npm run seed`
   - Quick explanation of what's happening

3. **Backend Startup (20-30 seconds)**
   - Show: `cd backend && npm run dev`
   - Highlight: Backend running on http://localhost:5000
   - Highlight: MongoDB connected

4. **Frontend Startup (20-30 seconds)**
   - Show: `npm run dev`
   - Highlight: Frontend running on http://localhost:5173
   - Open browser to application

5. **Feature Demonstrations (3-4 minutes total)**

   **A) Dashboard Overview (20 seconds)**
   - Show metrics: total cases, upcoming hearings, pending/completed tasks
   - Explain real-time updates
   - Show empty states

   **B) Case CRUD Operations (1 minute)**
   - Click "New Case"
   - Fill in form fields (case title, client, court, etc.)
   - Show validation errors (try submitting empty form)
   - Submit successful case creation
   - Show case in table
   - Edit a case (click edit button)
   - Show updated case

   **C) Task Management (1 minute)**
   - Click on a case to view details
   - Create a new task for the case
   - Fill task form (title, due date, owner, priority)
   - Submit and show task created
   - Toggle task status (Pending → Completed)
   - Show completed task styling
   - Delete a task (show Admin-only restriction)

   **D) Search & Filter (45 seconds)**
   - Use search bar to find case by title
   - Use search to find by client name
   - Use stage filter (select "Evidence")
   - Use date range filter
   - Show combined search + filter
   - Click "Clear filters"

   **E) Role-Based Access (30 seconds)**
   - Show Admin role selected (or switch to Admin)
   - Show delete button visible
   - Switch role to "Intern"
   - Show delete button disabled/hidden
   - Attempt delete as Intern, show error toast
   - Switch back to Admin

6. **Closing (10-15 seconds)**
   - Summary of features demonstrated
   - Mention tech stack
   - Thank you / questions

**Video Recording Tips:**

- Set resolution to 1920x1080 or 1280x720
- Use 30fps (or higher) frame rate
- Keep audio clear:
  - Use mic if narrating
  - Ensure no loud background noise
  - Speak clearly and not too fast
- Use zoom/magnification if terminal text is small
- Include pauses between actions for clarity

**Video Format & Upload:**

- Format: MP4 (H.264 codec)
- Duration: 2-5 minutes (aim for 3-4)
- File size: 50-200MB (depending on resolution/quality)

**Upload Options:**

1. **YouTube** (recommended)
   - Create unlisted or private video
   - Copy link from URL bar
   - Include in submission

2. **Loom** (https://www.loom.com)
   - Free account includes unlimited recordings
   - Auto-generates shareable link
   - Easy to share and embed

3. **Google Drive**
   - Upload video file
   - Make publicly accessible (or set sharing)
   - Copy sharing link

---

## 📝 Submission Package Checklist

Before submitting, verify you have:

- [ ] **GitHub Repository**
  - [ ] Created and set to Public
  - [ ] All code pushed to main branch
  - [ ] .gitignore properly excluding node_modules
  - [ ] Repository URL ready to submit

- [ ] **README Complete**
  - [ ] ✅ Local setup & run commands present
  - [ ] ✅ Tech stack summarized
  - [ ] ✅ Architecture & folder structure documented
  - [ ] ✅ Assumptions & limitations listed
  - [ ] ✅ Bonus features clearly marked and documented
  - [ ] At end of README, bonus section reads instructions for testing

- [ ] **Demo Video**
  - [ ] Recorded (2-5 minutes)
  - [ ] Shows all major features
  - [ ] Audio is clear (if narrated)
  - [ ] Video is accessible (shareable link)
  - [ ] Uploaded to accessible platform

- [ ] **Application Runs Successfully**
  - [ ] Tested locally with fresh clone: `git clone <url>`
  - [ ] `npm install` succeeds
  - [ ] `cd backend && npm install` succeeds
  - [ ] Backend starts: `npm run dev` in backend folder
  - [ ] Frontend starts: `npm run dev` in root
  - [ ] Can create cases and tasks
  - [ ] Dashboard shows correct metrics

- [ ] **Code Quality**
  - [ ] No console errors or warnings
  - [ ] No linting errors (if linter used)
  - [ ] TypeScript compiles (no type errors)
  - [ ] All features work as described
  - [ ] Error handling works properly

---

## 🎯 What to Submit

Provide the following in your submission:

### For Evaluator:

```
1. GitHub Repository Link:
   https://github.com/YOUR_USERNAME/case-intake-mini-module

2. Quick Start Command:
   git clone https://github.com/YOUR_USERNAME/case-intake-mini-module
   cd case-intake-mini-module
   npm install && cd backend && npm install && cd ..
   npm run seed
   npm run dev:all
   # Navigate to http://localhost:5173

3. Demo Video Link:
   https://youtu.be/... OR https://www.loom.com/share/... OR https://drive.google.com/...

4. Key Features Demonstrating Requirements:
   ✅ Case CRUD: Create, edit, delete cases with validation
   ✅ Task Tracker: Tasks linked to cases with status toggle
   ✅ Dashboard: Metrics for active cases, upcoming hearings, task counts
   ✅ Search & Filter: By title, client name, stage, date range
   ✅ Validation: Required fields, error messages, backend validation
   ✅ Code Quality: Clean architecture, TypeScript, modular components
   ✅ Bonus 2: Role-based access (Admin/Intern) with delete restrictions
   ✅ Additional: Responsive design, loading states, visual hierarchy

5. Tech Stack:
   - Frontend: React 18 + TypeScript + Vite
   - Backend: Express.js + TypeScript + Node.js
   - Database: MongoDB (local or Atlas)
   - Styling: Tailwind CSS + shadcn/ui
   - Deployment Ready: Yes
```

---

## 🔍 Pre-Submission Quality Check

Run this checklist before final submission:

### Code Quality

- [ ] No `console.log()` debuggers left in code
- [ ] No commented-out code blocks
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (if configured)
- [ ] All imports are used

### Functionality

- [ ] Can create a case from scratch
- [ ] Can add a task to a case
- [ ] Can search and filter at the same time
- [ ] Dashboard metrics are accurate
- [ ] Role-based restrictions work
- [ ] Delete confirmation dialog shows
- [ ] Errors display as toasts

### Documentation

- [ ] README has all sections
- [ ] Setup guide is accurate
- [ ] Technical documentation is present
- [ ] Assumptions are clearly stated
- [ ] Bonus features are documented

### Git/GitHub

- [ ] Repository is public
- [ ] All code committed and pushed
- [ ] No large files in .gitignore
- [ ] Git history looks clean
- [ ] README displays properly on GitHub

### Demo Video

- [ ] Duration: 2-5 minutes (preferably 3-4)
- [ ] All features shown
- [ ] Audio is clear (if narrated)
- [ ] Link is shareable
- [ ] Video quality is acceptable

---

## 🚀 Quick Commands Reference

**Setup:**

```bash
# Navigate to project
cd /home/shankshukchan/Downloads/Case\ Intake\ Mini\ Module

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/case-intake-mini-module.git
git branch -M main
git push -u origin main
```

**Local Testing:**

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Seed database
cd backend && npm run seed && cd ..

# Start both servers
npm run dev:all

# Or in separate terminals:
# Terminal 1: cd backend && npm run dev
# Terminal 2: npm run dev
```

**Access Application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## ✨ README Bonus Features Section

Your README already has this at lines 53-70, but here's a reminder of how reviewers will check:

**For Bonus 2: Role-Based Access Control**

```markdown
To test role-based access:

1. Open application (http://localhost:5173)
2. Look at header - role selector visible
3. Currently logged as "Admin"
4. Try to delete a case - succeeds
5. Click role selector → switch to "Intern"
6. Try to delete a case - button disabled/toast error
7. Role persists on page reload (via sessionStorage)
```

**For Other Bonuses**

```markdown
Responsive Design:

- Resize browser to mobile width (<768px)
- Navigation becomes hamburger menu
- Cards stack vertically
- All functionality maintained

Loading & Empty States:

- First load shows skeleton placeholders
- Empty state shown when no cases exist
- Meaningful messages guide user

Visual Hierarchy:

- Use `shadcn/ui` components (cards, badges, buttons)
- Color-coded: stages (blue, green, orange, red)
- Icons from lucide-react for clarity
```

---

## 📧 Final Checklist Before Submit

```markdown
READY TO SUBMIT? Check all boxes:

☐ GitHub repository created and public
☐ All code pushed to GitHub main branch
☐ README.md has all required sections
☐ Setup instructions tested and work
☐ Demo video recorded (2-5 minutes)
☐ Demo video uploaded with shareable link
☐ Application runs: npm install → npm run dev:all
☐ All features demonstrated in video
☐ No console errors or warnings
☐ TypeScript compiles cleanly
☐ Role-based access control works
☐ Bonus features documented and testable

Ready to submit! 🎉
```

---

## 🔗 Resources

- [GitHub Quick Start](https://docs.github.com/en/get-started/quickstart)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [OBS Studio](https://obsproject.com/)
- [Loom Recording](https://www.loom.com/)
- [YouTube Unlisted Videos](https://support.google.com/youtube/answer/157177)

---

**Last Updated:** April 7, 2026  
**Status:** Ready for Submission ✅
