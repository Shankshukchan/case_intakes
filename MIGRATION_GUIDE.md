# Migration Guide: LocalStorage to MongoDB + Express Backend

## Overview of Changes

This document describes the major changes made to migrate from a local storage-based prototype to a full-stack application with a real backend.

## 🔄 What Changed

### Architecture

- **Before:** React frontend with localStorage persistence
- **After:** React frontend + Express.js backend + MongoDB database

### Data Persistence

- **Before:** Browser localStorage with simulated async delays
- **After:** MongoDB with Express REST API

### Technology Stack

- **Frontend:** React + TypeScript (unchanged)
- **Frontend Data Layer:** LocalStorage Service → ApiService (HTTP client)
- **Backend:** NEW - Express.js + Node.js + TypeScript
- **Database:** NEW - MongoDB

## 📁 Project Structure Changes

### New Folder: `/backend`

```
backend/
├── src/
│   ├── server.ts              # Entry point
│   ├── types.ts               # Shared TypeScript interfaces
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth & validation
│   ├── utils/                 # Helpers
│   └── scripts/               # Database seed script
├── package.json
├── tsconfig.json
└── .env.example
```

### Modified Frontend Services

```diff
- src/app/services/storage.service.ts     (DEPRECATED)
+ src/app/services/api.service.ts        (NEW - HTTP client)
  src/app/services/case.service.ts       (Updated - uses ApiService)
  src/app/services/task.service.ts       (Updated - uses ApiService)
  src/app/services/dashboard.service.ts  (Updated - uses ApiService)
```

## 🛠️ How Services Changed

### Old Pattern (LocalStorage)

```typescript
// storage.service.ts
export class StorageService {
  static async getCases(): Promise<Case[]> {
    await delay(); // Fake network delay
    const data = localStorage.getItem("legal_cases");
    return data ? JSON.parse(data) : [];
  }
}

// case.service.ts
export class CaseService {
  static async getAllCases() {
    const cases = await StorageService.getCases();
    // Process locally...
    return { success: true, data: cases };
  }
}
```

### New Pattern (API)

```typescript
// api.service.ts
export class ApiService {
  private static async request<T>(endpoint: string) {
    const response = await fetch(`http://localhost:5000/api${endpoint}`);
    return response.json().data;
  }

  static async getCases(): Promise<Case[]> {
    return this.request("/cases");
  }
}

// case.service.ts
export class CaseService {
  static async getAllCases() {
    const cases = await ApiService.getCases();
    return { success: true, data: cases };
  }
}
```

## 🔐 Authentication Changes

### Before

```typescript
// Single default user stored in localStorage
const defaultUser: User = {
  id: "user_1",
  name: "Admin User",
  role: "Admin",
};
localStorage.setItem("current_user", JSON.stringify(defaultUser));
```

### After

```typescript
// User stored in database, identified via header
// Backend retrieves user from DB on each request
// Frontend stores user ID in sessionStorage
sessionStorage.setItem("current_user_id", userId);

// API calls include user ID in header
fetch(url, {
  headers: { "X-User-Id": userId },
});
```

## 🗄️ Database Schema

### Case Document

```javascript
{
  _id: ObjectId,              // MongoDB ObjectId
  caseTitle: String,
  clientName: String,
  courtName: String,
  caseType: String,
  nextHearingDate: String,    // ISO date
  stage: String,              // Filing | Evidence | Arguments | Order Reserved
  notes: String,              // Optional
  createdAt: Date,            // Auto-managed
  updatedAt: Date             // Auto-managed
}
```

### Task Document

```javascript
{
  _id: ObjectId,
  caseId: String,             // Reference to Case._id
  title: String,
  dueDate: String,            // ISO date
  ownerName: String,
  priority: String,          // Low | Medium | High
  status: String,            // Pending | Completed
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

The new backend exposes REST endpoints:

```
POST   /api/cases              Create case
GET    /api/cases              List cases (with filters)
GET    /api/cases/:id          Get single case
PUT    /api/cases/:id          Update case
DELETE /api/cases/:id          Delete case (admin only)

POST   /api/tasks              Create task
GET    /api/tasks              List tasks
PATCH  /api/tasks/:id/status   Update task status
PUT    /api/tasks/:id          Update task
DELETE /api/tasks/:id          Delete task (admin only)

GET    /api/dashboard/summary  Get metrics
GET    /api/users/current      Get current user
POST   /api/users/switch-role  Switch user role
```

## 🗑️ Deprecated Components

### Completely Removed

- `storage.service.ts` - Replaced by `api.service.ts`
- Frontend-based validation in `validation.service.ts` - Validation now on backend

### Updated (Still Used)

- `case.service.ts` - Now wraps ApiService instead of StorageService
- `task.service.ts` - Now wraps ApiService instead of StorageService
- `dashboard.service.ts` - Now calls API instead of calculating locally
- `seedData.ts` - Deprecated, backend handles seeding

## 📊 Performance Implications

### Network Requests

- **Before:** All operations instant (memory)
- **After:** Network latency added (~50-200ms typical)
- **Trade-off:** Real data persistence vs instant feedback

### Validation

- **Before:** Frontend validation only
- **After:** Frontend (UX) + Backend (data integrity)
- **Benefit:** Protection against malicious requests

### Search/Filter

- **Before:** JavaScript filter on client
- **After:** Database queries on server
- **Benefit:** Scales better with large datasets

## 🔄 Migration Steps (Not Needed - Already Done)

If you were migrating this yourself, here's what was done:

1. ✅ Created Express backend project structure
2. ✅ Defined Mongoose schemas for Case, Task, User
3. ✅ Implemented REST API endpoints with validation
4. ✅ Added authentication middleware
5. ✅ Created API service client (ApiService)
6. ✅ Updated service layer to use ApiService
7. ✅ Updated hooks to handle API responses
8. ✅ Created database seed script
9. ✅ Updated frontend environment configuration
10. ✅ Removed localStorage dependencies

## ⚠️ Breaking Changes

### ID Format

- **Before:** UUID strings (e.g., "case_001")
- **After:** MongoDB ObjectIds (e.g., "507f1f77bcf86cd799439011")
- **Impact:** Frontend handles both transparently

### Response Format

- **Before:** Local validation with simulated async
- **After:** Server validation with real HTTP responses
- **Impact:** Error handling works the same (service layer abstracts differences)

### Data Loss

- **Before:** LocalStorage data persists
- **After:** Data in database (no automatic migration)
- **Impact:** Previous demo data is lost (new seed script provided)

## 🚀 Running the New Version

The setup is now more complex but more realistic:

```bash
# Backend setup
cd backend
npm install
npm run seed
npm run dev

# Frontend setup (another terminal)
npm install
npm run dev
```

Previously, it was just:

```bash
npm install
npm run dev
```

## 📈 Benefits of the New Architecture

1. **Real Database**: Data persists reliably
2. **Server-Side Validation**: Stronger data integrity
3. **Scalability**: API can be distributed
4. **Security**: Authentication on server
5. **Multi-User Ready**: Foundation for user sessions
6. **Deployable**: Standard full-stack architecture
7. **Maintainability**: Clear separation of concerns
8. **Production-Ready**: Closer to real legal tech systems

## 🔒 Security Improvements

- Admin/Intern role enforcement on server
- Delete operations blocked for non-admins (403 Forbidden)
- Validation on both client and server
- Foundation for JWT authentication (needed for production)

## 📝 Documentation Updates

### New Files

- `backend/README.md` - Bachelor API documentation
- `SETUP_GUIDE.md` - Step-by-step setup instructions
- This migration guide

### Updated Files

- Root `README.md` - Architecture, setup, and endpoints
- `TECHNICAL.md` - Should remain mostly relevant

## 🧪 Testing the Migration

### Verify Backend

```bash
curl http://localhost:5000/api/cases \
  -H "X-User-Id: user_1"

# Should return empty array if database is empty
# Or sample data if seed script was run
```

### Verify Frontend

1. Open http://localhost:5173
2. Should see dashboard
3. Create a case - should succeed
4. Check MongoDB to confirm data was saved

## 🎯 Summary

| Aspect       | Before               | After              |
| ------------ | -------------------- | ------------------ |
| Data Storage | Browser LocalStorage | MongoDB            |
| Backend      | None (simulated)     | Express.js         |
| API          | None                 | REST API           |
| ID Format    | UUID v4              | MongoDB ObjectId   |
| Validation   | Frontend             | Frontend + Backend |
| Auth         | LocalStorage user    | DB user + header   |
| Deployment   | Just frontend        | Frontend + Backend |

The application now follows a real MERN stack pattern ready for production-like usage.

---

**Migration Completed:** April 6, 2026  
**Status:** ✅ Full-Stack Functional
