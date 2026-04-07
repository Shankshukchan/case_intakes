# Case Intake + Hearing Readiness Mini Module

A full-stack legal operations management system for tracking case intake and hearing preparation tasks.

## 🎯 Assignment Overview

**Role Target:** Full Stack Development Intern (MERN + TypeScript)  
**Timebox:** 2-3 days (12-18 hours)  
**Tech Stack:** React + TypeScript + Node.js + Express + MongoDB

## 📹 Demo Screencast

**Watch the application in action:**

<video width="100%" controls>
  <source src="Screencast From 2026-04-07 12-51-19.webm" type="video/webm">
  Your browser does not support the video tag.
</video>

## ✨ Features Implemented

### ✅ Feature A: Case Intake CRUD

- Create, read, update, and delete case records
- Required fields validation (caseTitle min 3 chars, clientName, courtName, caseType, nextHearingDate, stage)
- Optional notes field with 1000 character limit
- Cascade deletion of associated tasks when deleting a case
- Full data persistence using MongoDB

### ✅ Feature B: Hearing Task Tracker

- Create, edit, and delete tasks for each case
- Toggle task status between Pending and Completed
- Task fields: title, dueDate, ownerName, priority (Low/Medium/High), status
- Each task is associated with exactly one case
- Clear visual distinction between pending and completed tasks
- Validation for all required fields

### ✅ Feature C: Dashboard Summary

- Total active cases count
- Upcoming hearings in next 7 days
- Pending tasks count
- Completed tasks count
- Real-time metric updates after CRUD operations
- Empty state handling

### ✅ Feature D: Search and Filter

- Case-insensitive search by case title or client name
- Filter by stage (Filing, Evidence, Arguments, Order Reserved)
- Filter by hearing date range (from/to)
- Combined search and filter functionality
- Clear filters button

### ✅ Feature E: Validation and Error Handling

- Frontend validation with real-time feedback
- Backend-style validation in service layer
- User-friendly error messages via toast notifications
- Proper HTTP-like error handling (400, 404 simulation)
- No crashes on failed operations

### ✅ Feature F: Code Quality and Maintainability

- Clean separation of concerns:
  - `/types` - TypeScript interfaces and types
  - `/services` - Data layer with validation
  - `/hooks` - Custom React hooks for data management
  - `/components` - Reusable UI components
  - `/pages` - Page-level components
- Meaningful TypeScript typing throughout
- Reusable components (CaseForm, TaskForm, CaseList, TaskList)
- Consistent naming conventions
- No large monolithic files

### 🎁 Bonus Features

#### Bonus 2: Role-Based Access Control

- Admin and Intern role system
- Role switcher in the header
- Delete operations restricted to Admin role
- Visual feedback for disabled actions with tooltips
- Role persistence across page refreshes

#### Responsive Design

- Mobile-first responsive layout
- Adaptive navigation for mobile/desktop
- Responsive tables and cards
- Touch-friendly UI elements

#### Loading States & Empty States

- Skeleton loading states for all data fetching
- Meaningful empty states with helpful messages
- Loading indicators during form submissions
- Graceful handling of "no data" scenarios

#### Clear Visual Hierarchy

- Consistent use of Tailwind v4 + shadcn/ui components
- Color-coded badges for stages and priorities
- Icons from lucide-react for better UX
- Card-based layout for information grouping
- Clear typography hierarchy

## � How to Review Bonus Features

### Bonus 2: Role-Based Access Control

**Location:** Header component (top-right corner)

**How to Test:**

1. Start the application: `npm run dev:all`
2. Open http://localhost:5173
3. Look at the top-right corner - you'll see a role selector (currently "Admin")
4. **Test Admin Privileges:**
   - Create a case (click "New Case")
   - Notice the "Delete" button is visible on each case
   - Click delete on any case - delete succeeds with confirmation
5. **Test Intern Restrictions:**
   - Click the role selector dropdown → select "Intern"
   - The delete buttons now appear disabled (grayed out)
   - Hover over delete button - tooltip shows why it's disabled
   - Attempt to delete - toast notification shows "Unauthorized"
6. **Test Persistence:**
   - While logged as Intern, refresh the page (F5)
   - Role stays as "Intern" (persisted in sessionStorage)
   - Switch back to Admin and refresh - stays Admin

**Code Location:**

- [src/app/hooks/useUser.ts](src/app/hooks/useUser.ts) - Role management
- [src/app/components/CaseList.tsx](src/app/components/CaseList.tsx) - Role-based delete button
- [src/app/middleware/auth.ts](src/app/middleware/auth.ts) - Backend role enforcement

### Responsive Design

**How to Test:**

1. Start application
2. Open DevTools (F12)
3. Click "Toggle device toolbar" (Ctrl+Shift+M on Windows/Linux)
4. Test different screen sizes:
   - Mobile: 375px width (iPhone SE)
   - Tablet: 768px width (iPad)
   - Desktop: 1920px width
5. **Verify:**
   - Navigation becomes hamburger menu on mobile
   - Cards stack vertically (not side-by-side)
   - Tables remain scrollable on mobile
   - All buttons and forms remain accessible
   - Touch targets are appropriately sized

**Code Location:** [src/app/styles/index.css](src/app/styles/index.css) - Tailwind responsive utilities

### Loading & Empty States

**How to Test:**

1. Start fresh (clear localStorage if needed)
2. **Empty State:**
   - On first load, dashboard shows "No cases yet" message
   - Cases page shows empty state with helpful prompt
3. **Loading State:**
   - Create multiple cases and tasks
   - Return to dashboard
   - Notice skeleton loaders appear briefly before data
4. **Form Submission:**
   - Create new case - loading spinner appears on submit button
   - Cannot submit twice while loading

**Code Location:**

- [src/app/components/Dashboard.tsx](src/app/components/Dashboard.tsx) - Empty states
- [src/app/hooks/useCases.ts](src/app/hooks/useCases.ts) - Loading state management

### Clear Visual Hierarchy

**How to Test:**

1. Start application
2. **Observe:**
   - Main headings are large and bold
   - Section headers are smaller (hierarchical)
   - Buttons use primary/secondary/destructive colors
   - Badges show status with distinct colors:
     - **Stages:** Blue (Filing), Green (Evidence), Orange (Arguments), Red (Order Reserved)
     - **Priorities:** Green (Low), Yellow (Medium), Red (High)
     - **Status:** Gray (Pending), Green (Completed)
   - Icons from lucide-react enhance meaning
   - Cards have proper spacing and shadows
3. **Verify Accessibility:**
   - All text has sufficient contrast
   - Color is not the only indicator of meaning (icons + text)

**Code Location:**

- [src/app/components/ui/](src/app/components/ui/) - shadcn/ui components
- [src/app/styles/tailwind.css](src/app/styles/tailwind.css) - Tailwind configuration

## �🏗️ Architecture

### Backend (Express + MongoDB)

```
/backend
├── src/
│   ├── server.ts              # Express server setup
│   ├── types.ts               # TypeScript interfaces
│   ├── models/                # Mongoose schemas
│   │   ├── Case.ts
│   │   ├── Task.ts
│   │   └── User.ts
│   ├── middleware/
│   │   └── auth.ts            # Authentication & authorization
│   ├── routes/
│   │   ├── cases.ts           # Cases CRUD endpoints
│   │   ├── tasks.ts           # Tasks CRUD endpoints
│   │   ├── dashboard.ts       # Metrics endpoints
│   │   └── users.ts           # User management
│   ├── utils/
│   │   └── validation.ts      # Request validation
│   └── scripts/
│       └── seed.ts            # Database seeding
├── package.json
├── tsconfig.json
└── .env.example
```

### Frontend Service Layer (API Clients)

```
/src/app/services
├── api.service.ts           # HTTP client for backend
├── case.service.ts          # Case CRUD wrapper
├── task.service.ts          # Task CRUD wrapper
└── dashboard.service.ts     # Dashboard metrics wrapper
```

### Custom Hooks (Data Management)

```
/hooks
├── useCases.ts             # Case CRUD operations
├── useTasks.ts             # Task CRUD operations
├── useDashboard.ts         # Dashboard metrics
└── useUser.ts              # User role management
```

### Components (UI Layer)

```
/components
├── Dashboard.tsx           # Metrics overview
├── CaseForm.tsx            # Create/Edit case form
├── CaseList.tsx            # Cases table with actions
├── CaseFilters.tsx         # Search and filter UI
├── TaskForm.tsx            # Create/Edit task form
├── TaskList.tsx            # Tasks grouped by status
└── Layout.tsx              # App layout with navigation
```

### Pages (Routes)

```
/pages
├── DashboardPage.tsx       # Dashboard view
├── CasesPage.tsx           # All cases with filters
└── CaseDetailPage.tsx      # Single case with tasks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/pnpm
- MongoDB (local or MongoDB Atlas connection string)

### Installation & Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with MongoDB connection
cp .env.example .env
# Edit .env and add your MongoDB URI:
# MONGODB_URI=mongodb://localhost:27017/case-intake

# Seed database with sample data
npm run seed

# Start backend server (runs on http://localhost:5000)
npm run dev
```

#### 2. Frontend Setup

```bash
# From root directory (or in another terminal)
npm install

# Create .env.local file with API URL
cp .env.example .env.local
# Use default: VITE_API_URL=http://localhost:5000/api

# Start frontend development server (runs on http://localhost:5173)
npm run dev
```

### Running Both Services

**Option 1: In separate terminals**

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev
```

**Option 2: Using npm concurrently (if installed)**

```bash
npm run dev
```

### Demo Data

The database is automatically seeded with sample data when you run `npm run seed`:

- 3 sample cases with different stages and types
- 5 sample tasks across cases with various priorities and statuses
- 2 demo users: Admin and Intern

### User Roles

Authentication is handled via sessionStorage with a default Admin user:

- **Admin**: Full access including delete operations
- **Intern**: Read, create, and edit access (no delete operations)

Switch roles using the dropdown in the header for testing.

## 🧪 Testing the Application

### Manual Testing Checklist

**Case CRUD:**

- [x] Create a new case with all required fields
- [x] Validation errors appear for missing/invalid fields
- [x] Edit existing case details
- [x] Delete case (Admin only) with confirmation
- [x] Cascade deletion removes associated tasks

**Task Management:**

- [x] Create tasks for a case
- [x] Edit task details
- [x] Toggle task completion status
- [x] Delete tasks (Admin only)
- [x] Tasks are case-specific

**Search & Filter:**

- [x] Search by case title
- [x] Search by client name
- [x] Filter by stage
- [x] Filter by date range
- [x] Combined search + filters
- [x] Clear all filters

**Dashboard:**

- [x] Metrics reflect current data
- [x] Upcoming hearings (7 days) count is accurate
- [x] Task counts update after changes
- [x] Empty state shown when no data

**Role-Based Access:**

- [x] Switch between Admin and Intern
- [x] Intern cannot delete cases/tasks
- [x] Visual feedback for disabled actions

## 📋 Data Model

### Case

```typescript
{
  id: string;
  caseTitle: string;           // Required, min 3 chars
  clientName: string;          // Required
  courtName: string;           // Required
  caseType: string;            // Required
  nextHearingDate: string;     // Required, ISO date
  stage: CaseStage;            // Required: Filing | Evidence | Arguments | Order Reserved
  notes?: string;              // Optional, max 1000 chars
  createdAt: string;
  updatedAt: string;
}
```

### HearingTask

```typescript
{
  id: string;
  caseId: string; // Required, foreign key to Case
  title: string; // Required
  dueDate: string; // Required, ISO date
  ownerName: string; // Required
  priority: TaskPriority; // Required: Low | Medium | High
  status: TaskStatus; // Pending | Completed
  createdAt: string;
  updatedAt: string;
}
```

## 🔒 Error Handling

The application implements comprehensive error handling:

- **400 (Bad Request)**: Validation errors with specific field messages
- **404 (Not Found)**: Case/task not found errors
- **500 (Server Error)**: Generic failure messages
- All errors display as toast notifications
- No application crashes on failed operations

## 🎨 UI/UX Features

- **Toast Notifications**: Real-time feedback for all operations
- **Loading Skeletons**: Visual feedback during data fetching
- **Confirmation Dialogs**: Prevent accidental deletions
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Keyboard Support**: Form submission with Enter key
- **Empty States**: Helpful messages when no data exists
- **Visual Badges**: Color-coded stages and priorities
- **Hover States**: Interactive feedback on all clickable elements

## 🔧 Technical Decisions

### Database (MongoDB)

- Non-relational database suitable for CRUD operations
- Flexible schema for case and task documents
- Simpler than SQL for prototyping
- Integration via Mongoose for schema validation

### Backend (Express + Node.js)

- Lightweight and easy to set up
- TypeScript for type safety
- Middleware-based architecture for auth and validation
- RESTful API design following standard conventions

### Frontend Service Layer

- `ApiService`: Centralized HTTP client for all backend communication
- Error handling with meaningful messages
- Session-based user identification (sessionStorage)
- Fetch API for HTTP requests (can be swapped to axios)

### Role-Based Access Control

**Backend Enforcement** (Primary)

- `adminOnly` middleware protects delete endpoints
- Returns 403 Forbidden for non-admin users
- Cascade deletion handled securely on backend

**Frontend Enforcement** (UX)

- Delete buttons disabled for non-admin users
- Role displayed in UI for user awareness
- Toast notifications on authorization errors

### Why Move Away from LocalStorage?

- **Scalability**: Database persists data reliably
- **Multi-user**: Different users can have different data
- **Security**: Authentication logic on server
- **Real-world**: Matches actual legal tech workflows
- **Validation**: Backend validates all operations
- **Auditability**: Server logs all operations

## 📦 Dependencies

### Backend

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **cors**: Enable cross-origin requests
- **typescript**: Type safety

### Frontend

- **react**: UI framework
- **react-router**: Navigation and routing
- **date-fns**: Date formatting and manipulation
- **lucide-react**: Icon library
- **sonner**: Toast notifications
- **shadcn/ui**: Component library (Radix UI + Tailwind)
- **tailwindcss**: Utility-first CSS

## 🚀 Production Considerations

For a production deployment, the following would be added:

- Authentication with JWT tokens (Replace sessionStorage)
- HTTPS/SSL encryption
- API rate limiting and DDoS protection
- Environment-based configuration (separate dev/staging/prod)
- Database user authentication
- Comprehensive error logs (Sentry)
- Database backups and disaster recovery
- Unit tests (Jest + React Testing Library)
- E2E tests (Playwright/Cypress)
- API documentation (Swagger/OpenAPI)
- CI/CD pipeline (GitHub Actions/GitLab CI)
- Database migrations and versioning
- Input sanitization (prevent SQL injection, XSS)
- CORS configuration (whitelist domains)
- API monitoring and performance tracking
- Accessibility (WCAG compliance)

## 📝 Implementation Notes

### API Contract

All endpoints return JSON with the following structure:

```json
{
  "success": true,
  "data": {
    /* response data */
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "validationErrors": [{ "field": "fieldName", "message": "Error detail" }]
}
```

### Database Schema

- Cases and Tasks use ObjectId as primary keys (MongoDB)
- Timestamps (createdAt, updatedAt) automatically managed by Mongoose
- Cascade deletion: Deleting a case removes all associated tasks

### Environment Variables

**Backend (.env)**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/case-intake
NODE_ENV=development
```

**Frontend (.env.local)**

```
VITE_API_URL=http://localhost:5000/api
```

### Data Validation

- Client-side validation for UX feedback
- Server-side validation for data integrity
- All required fields enforced on backend
- Field length limits (notes ≤ 1000 chars)
- Date format validation (ISO 8601)

### Assumptions & Limitations

- Single-user session (no concurrent logins)
- No persistent JWT tokens (reloads reset authentication)
- Demo data seeding is manual (not automatic)
- No rate limiting on API endpoints
- No audit trails for actions
- Simple MongoDB (no replica sets or sharding)
- No real-time updates (polling would be needed for multi-user)

## 📝 Notes

- This is a **full-stack prototype** demonstrating MERN fundamentals with TypeScript
- Built for learning and assignment demonstration purposes
- Seed data is non-sensitive and for demonstration only
- Authentication is simplified (sessionStorage instead of JWT)
- All timestamps are in ISO 8601 format
- MongoDB connection required for operation

## 🙏 Assignment Requirements Met

### Core Features

✅ Case Intake CRUD (Create, Read, Update, Delete)  
✅ Hearing Task Tracker (CRUD + status toggle)  
✅ Dashboard Summary (Metrics & analytics)  
✅ Search and Filter (Fuzzy search + multiple filters)  
✅ Validation and Error Handling (Frontend + Backend)  
✅ Code Quality and Maintainability (Clean architecture)

### Bonus Features

✅ **Bonus 2: Role-Based Access Control** (Admin/Intern with restrictions)  
✅ Responsive UI (Mobile, tablet, desktop)  
✅ Loading and Empty States (Skeletons, meaningful messages)  
✅ Clear Visual Hierarchy (Badges, colors, icons)

### Tech Stack

✅ Frontend: React + TypeScript  
✅ Backend: Node.js + Express + TypeScript  
✅ Database: MongoDB  
✅ API: REST

## 🔗 API Endpoints

### Cases

- `GET /api/cases` - List all cases (with filters)
- `GET /api/cases/:id` - Get single case
- `POST /api/cases` - Create case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case (admin only)

### Tasks

- `GET /api/tasks?caseId=:caseId` - List tasks for a case
- `GET /api/tasks/case/:caseId` - List tasks for a case
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task (admin only)

### Dashboard

- `GET /api/dashboard/summary` - Get dashboard metrics

### Users

- `GET /api/users/current` - Get current user
- `POST /api/users/switch-role` - Switch user role

## 📞 Support

For questions about the implementation:

1. Check the inline code comments
2. Review TECHNICAL.md for architecture details
3. Examine backend folder for server-side logic
4. Check git history for development progression
