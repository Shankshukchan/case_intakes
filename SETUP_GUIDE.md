# Setup Guide - Case Intake Mini Module

Quick setup instructions to get the full-stack application running locally.

## Prerequisites

- **Node.js**: 16+ (check with `node --version`)
- **npm**: 7+ (comes with Node.js)
- **MongoDB**: Running locally OR a MongoDB Atlas connection string

## Option 1: Quick Setup (Recommended)

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**

```bash
# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongodb

# On Windows
net start MongoDB
```

Verify MongoDB is running:

```bash
mongosh mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Copy it to backend/.env (see Step 3)

### Step 3: Configure Environment

**Backend (.env)**

```bash
cd backend
cp .env.example .env
# Edit .env and add your MongoDB URI
nano .env
# Should look like:
# MONGODB_URI=mongodb://localhost:27017/case-intake
# PORT=5000
# NODE_ENV=development
cd ..
```

**Frontend (.env.local)**

```bash
cp .env.example .env.local
# Should contain:
# VITE_API_URL=http://localhost:5000/api
```

### Step 4: Seed Database

```bash
cd backend
npm run seed
cd ..
```

You should see output like:

```
Connected to MongoDB
Cleared existing data
Created users
Created 3 sample cases
Created 5 sample tasks
✓ Database seeded successfully!
```

### Step 5: Start Development Servers

**Option A: In separate terminals (easier to debug)**

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Expected output:

```
╭─────────────────────────────────────────────╮
│  Case Intake Backend Server                 │
│  Running on http://localhost:5000           │
│  MongoDB: mongodb://localhost:27017/...     │
╰─────────────────────────────────────────────╯
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

Expected output:

```
VITE v5.0.0 running at:
  ➜  Local:   http://localhost:5173/
```

**Option B: Both in one terminal (requires concurrently)**

```bash
npm install -g concurrently
npm run dev:all
```

### Step 6: Open Application

Navigate to http://localhost:5173 in your browser.

You should see:

- Dashboard with empty metrics
- Cases list (initially empty after seeding)
- Navigation menu with Admin role selected

## 🧪 Testing the Setup

### Test Data is Available

The seed script creates:

- 3 sample cases (Smith vs. Johnson, Green vs. State Board, Brown Family Trust)
- 5 sample tasks across those cases
- 2 users (Admin and Intern)

### Test API Directly

```bash
# Get all cases
curl http://localhost:5000/api/cases \
  -H "X-User-Id: user_1"

# Get dashboard metrics
curl http://localhost:5000/api/dashboard/summary \
  -H "X-User-Id: user_1"

# Create a case
curl -X POST http://localhost:5000/api/cases \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user_1" \
  -d '{
    "caseTitle": "Test Case",
    "clientName": "Test Client",
    "courtName": "Test Court",
    "caseType": "Test",
    "nextHearingDate": "2024-12-31",
    "stage": "Evidence",
    "notes": "Test notes"
  }'
```

## 🆘 Troubleshooting

### Port Already in Use

**Port 5000 (Backend):**

```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

**Port 5173 (Frontend):**

```bash
# Vite will automatically use next available port
```

### MongoDB Connection Error

**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**

1. **Start MongoDB:**

   ```bash
   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongodb
   ```

2. **Use MongoDB Atlas:**
   ```bash
   # Get connection string from Atlas
   # Example: mongodb+srv://username:password@cluster.mongodb.net/case-intake
   # Add to backend/.env
   MONGODB_URI=mongodb+srv://...
   ```

### API Not Responding (Frontend)

**Error:** Requests to `http://localhost:5000/api/...` fail

**Solutions:**

1. Ensure backend is running: `npm run dev` in backend folder
2. Check .env.local: should have `VITE_API_URL=http://localhost:5000/api`
3. Check browser console for CORS errors
4. Try accessing http://localhost:5000/api/health to verify backend

### npm: command not found

**Solution:** Install Node.js from https://nodejs.org

## 📁 Project Structure

```
Case Intake Mini Module/
├── backend/                   # Express API server
│   ├── src/
│   │   ├── server.ts
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth middleware
│   │   ├── utils/            # Helpers
│   │   └── scripts/          # seed.ts
│   ├── package.json
│   └── .env.example
├── src/                       # React frontend
│   ├── app/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Page routes
│   │   ├── hooks/            # React hooks
│   │   ├── services/         # API clients
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utilities
│   ├── main.tsx
│   └── styles/
├── package.json
├── vite.config.ts
├── .env.local
├── README.md                  # Main documentation
├── SETUP_GUIDE.md            # This file
└── TECHNICAL.md              # Architecture details
```

## 🚀 Next Steps

1. Open http://localhost:5173
2. Click "New Case" to create a case
3. Add tasks to the case
4. View dashboard metrics
5. Test search and filters
6. Switch to "Intern" role to test permissions
7. Try deleting (should fail as Intern)

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] MongoDB connected (check backend logs)
- [ ] Can see sample data in dashboard
- [ ] Can create a new case
- [ ] Can create a task for a case
- [ ] Can toggle task status
- [ ] Can edit case details
- [ ] Delete button shows only when logged in as Admin
- [ ] Switch to Intern role - delete button disabled

## 📞 Need Help?

1. Check error messages in browser console (F12)
2. Check backend logs in terminal
3. Verify MongoDB is running: `mongosh`
4. Review README.md and backend/README.md
5. Check TECHNICAL.md for architecture overview

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)

---

**Last Updated:** April 6, 2026  
**Version:** 2.0 (With Backend)
