# Case Intake Backend API

Express.js and MongoDB backend for the Case Intake + Hearing Readiness Mini Module.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or cloud instance)

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/case-intake
# PORT=5000
# NODE_ENV=development

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main Express app setup
│   ├── types.ts               # TypeScript interfaces
│   ├── models/                # Mongoose schemas
│   │   ├── Case.ts           # Case document schema
│   │   ├── Task.ts           # Task document schema
│   │   └── User.ts           # User document schema
│   ├── middleware/
│   │   └── auth.ts           # Auth & authorization middleware
│   ├── routes/
│   │   ├── cases.ts          # Cases CRUD endpoints
│   │   ├── tasks.ts          # Tasks CRUD endpoints
│   │   ├── dashboard.ts      # Dashboard metrics
│   │   └── users.ts          # User management
│   ├── utils/
│   │   └── validation.ts     # Request schema validation
│   └── scripts/
│       └── seed.ts           # Database seeding script
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔑 Environment Variables

```env
# Server configuration
PORT=5000
NODE_ENV=development

# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/case-intake
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Response Format

All responses return JSON in the following format:

**Success (200, 201):**

```json
{
  "success": true,
  "data": {
    /* response data */
  }
}
```

**Error (400, 404, 500):**

```json
{
  "success": false,
  "error": "Error message",
  "validationErrors": [{ "field": "fieldName", "message": "Error description" }]
}
```

### Authentication

Currently uses X-User-Id header for user identification. In production, should use JWT tokens.

```bash
curl -H "X-User-Id: user_id" http://localhost:5000/api/cases
```

### Authorization

- **Admin users**: Full access (create, read, update, delete)
- **Intern users**: Limited access (no delete operations)
- Delete endpoints return 403 Forbidden for non-admin users

---

## 📋 API Endpoints

### Cases

#### GET /cases

List all cases with optional filtering

**Query Parameters:**

- `searchQuery` (optional): Search by case title or client name
- `stage` (optional): Filter by stage (Filing, Evidence, Arguments, Order Reserved)
- `dateFrom` (optional): Filter cases with hearing date >= this date (ISO format)
- `dateTo` (optional): Filter cases with hearing date <= this date (ISO format)

**Example:**

```bash
GET /api/cases?searchQuery=Johnson&stage=Evidence&dateFrom=2024-01-01&dateTo=2024-12-31
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "caseTitle": "Smith vs. Johnson Corp",
      "clientName": "John Smith",
      "courtName": "District Court of New York",
      "caseType": "Commercial Dispute",
      "nextHearingDate": "2024-04-15",
      "stage": "Arguments",
      "notes": "Complex commercial dispute",
      "createdAt": "2024-04-06T10:00:00Z",
      "updatedAt": "2024-04-06T10:00:00Z"
    }
  ]
}
```

---

#### GET /cases/:id

Retrieve a specific case by ID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "caseTitle": "Smith vs. Johnson Corp",
    "clientName": "John Smith",
    "courtName": "District Court of New York",
    "caseType": "Commercial Dispute",
    "nextHearingDate": "2024-04-15",
    "stage": "Arguments",
    "notes": "Complex commercial dispute",
    "createdAt": "2024-04-06T10:00:00Z",
    "updatedAt": "2024-04-06T10:00:00Z"
  }
}
```

---

#### POST /cases

Create a new case

**Request Body:**

```json
{
  "caseTitle": "Smith vs. Johnson Corp",
  "clientName": "John Smith",
  "courtName": "District Court of New York",
  "caseType": "Commercial Dispute",
  "nextHearingDate": "2024-04-15",
  "stage": "Evidence",
  "notes": "Complex commercial dispute"
}
```

**Validation:**

- `caseTitle`: Required, min 3 characters
- `clientName`: Required
- `courtName`: Required
- `caseType`: Required
- `nextHearingDate`: Required, ISO date format
- `stage`: Required, one of: Filing, Evidence, Arguments, Order Reserved
- `notes`: Optional, max 1000 characters

**Response:** (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "caseTitle": "Smith vs. Johnson Corp",
    "clientName": "John Smith",
    "courtName": "District Court of New York",
    "caseType": "Commercial Dispute",
    "nextHearingDate": "2024-04-15",
    "stage": "Evidence",
    "notes": "Complex commercial dispute",
    "createdAt": "2024-04-06T10:00:00Z",
    "updatedAt": "2024-04-06T10:00:00Z"
  }
}
```

---

#### PUT /cases/:id

Update an existing case

**Request Body:** (Same as POST, all fields can be updated)

**Response:**

```json
{
  "success": true,
  "data": {
    /* updated case */
  }
}
```

---

#### DELETE /cases/:id

Delete a case (Admin only)

Deletes the case and all associated tasks (cascade delete)

**Authorization:** Admin role required

**Response:**

```json
{
  "success": true,
  "data": { "message": "Case and associated tasks deleted successfully" }
}
```

---

### Tasks

#### GET /tasks?caseId=:caseId

List all tasks, optionally filtered by case

**Query Parameters:**

- `caseId` (optional): Filter tasks by case ID

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "caseId": "507f1f77bcf86cd799439011",
      "title": "Prepare witness statements",
      "dueDate": "2024-04-10",
      "ownerName": "Sarah Mitchell",
      "priority": "High",
      "status": "Pending",
      "createdAt": "2024-04-06T10:00:00Z",
      "updatedAt": "2024-04-06T10:00:00Z"
    }
  ]
}
```

---

#### GET /tasks/case/:caseId

List all tasks for a specific case

**Response:** (Same as above, filtered by caseId)

---

#### POST /tasks

Create a new task

**Request Body:**

```json
{
  "caseId": "507f1f77bcf86cd799439011",
  "title": "Prepare witness statements",
  "dueDate": "2024-04-10",
  "ownerName": "Sarah Mitchell",
  "priority": "High",
  "status": "Pending"
}
```

**Validation:**

- `caseId`: Required, must reference existing case
- `title`: Required
- `dueDate`: Required, ISO date format
- `ownerName`: Required
- `priority`: Required, one of: Low, Medium, High
- `status`: Required, one of: Pending, Completed

**Response:** (201 Created)

```json
{
  "success": true,
  "data": {
    /* created task */
  }
}
```

---

#### PUT /tasks/:id

Update an existing task

**Request Body:** (Same as POST)

**Response:**

```json
{
  "success": true,
  "data": {
    /* updated task */
  }
}
```

---

#### PATCH /tasks/:id/status

Update only the status of a task

**Request Body:**

```json
{
  "status": "Completed"
}
```

**Valid statuses:** "Pending", "Completed"

**Response:**

```json
{
  "success": true,
  "data": {
    /* task with updated status */
  }
}
```

---

#### DELETE /tasks/:id

Delete a task (Admin only)

**Authorization:** Admin role required

**Response:**

```json
{
  "success": true,
  "data": { "message": "Task deleted successfully" }
}
```

---

### Dashboard

#### GET /dashboard/summary

Get dashboard metrics

**Response:**

```json
{
  "success": true,
  "data": {
    "totalActiveCases": 12,
    "upcomingHearings": 4,
    "pendingTasks": 23,
    "completedTasks": 15
  }
}
```

**Metrics:**

- `totalActiveCases`: Total number of cases in database
- `upcomingHearings`: Number of cases with hearing in next 7 days
- `pendingTasks`: Total tasks with status "Pending"
- `completedTasks`: Total tasks with status "Completed"

---

### Users

#### GET /users/current

Get information about the current authenticated user

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Admin User",
    "email": "admin@legalops.com",
    "role": "Admin"
  }
}
```

---

#### POST /users/switch-role

Switch the current user's role (for testing)

**Request Body:**

```json
{
  "role": "Intern"
}
```

**Valid roles:** "Admin", "Intern"

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Admin User",
    "email": "admin@legalops.com",
    "role": "Intern"
  }
}
```

---

## 🗄️ Database Schema

### Case Collection

```javascript
{
  _id: ObjectId,
  caseTitle: String,           // Required, index for search
  clientName: String,          // Required, index for search
  courtName: String,           // Required
  caseType: String,            // Required
  nextHearingDate: String,     // ISO date, index for range queries
  stage: String,               // One of: Filing, Evidence, Arguments, Order Reserved
  notes: String,               // Optional, max 1000 chars
  createdAt: Date,             // Auto-managed by Mongoose
  updatedAt: Date              // Auto-managed by Mongoose
}
```

### Task Collection

```javascript
{
  _id: ObjectId,
  caseId: String,              // Required, references Case._id
  title: String,               // Required
  dueDate: String,             // ISO date
  ownerName: String,           // Required
  priority: String,            // One of: Low, Medium, High
  status: String,              // One of: Pending, Completed
  createdAt: Date,             // Auto-managed by Mongoose
  updatedAt: Date              // Auto-managed by Mongoose
}
```

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,                // Required
  email: String,               // Required, unique
  role: String,                // One of: Admin, Intern (default: Intern)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Considerations

### Current Implementation

- Query validation on all endpoints
- TypeScript for type safety
- Cascade delete protection (removes dependent tasks)
- Authorization checks on delete operations

### Production Improvements Needed

- JWT token-based authentication
- HTTPS only
- CORS origin whitelisting
- Rate limiting
- Input sanitization (prevent NoSQL injection)
- HTTPS headers (helmet)
- Database user authentication
- Encrypted connections to MongoDB

---

## 🧪 Testing

### Manual Testing with curl

**Create a case:**

```bash
curl -X POST http://localhost:5000/api/cases \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user_1" \
  -d '{
    "caseTitle": "Test Case",
    "clientName": "Test Client",
    "courtName": "Test Court",
    "caseType": "Test",
    "nextHearingDate": "2024-12-31",
    "stage": "Evidence"
  }'
```

**Get all cases:**

```bash
curl http://localhost:5000/api/cases \
  -H "X-User-Id: user_1"
```

**Delete a case (requires X-User-Id of admin):**

```bash
curl -X DELETE http://localhost:5000/api/cases/507f1f77bcf86cd799439011 \
  -H "X-User-Id: admin_user_id"
```

---

## 💡 Development Tips

### Debugging

- Check MongoDB connection: `mongo mongodb://localhost:27017/case-intake`
- Check server logs for errors in console
- Use MongoDB Compass for visual database exploration
- Use Postman/Thunder Client for API testing

### Common Issues

**MongoDB Connection Error:**

- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify connection string syntax

**Port Already in Use:**

- Change PORT in .env
- Kill existing process: `lsof -ti:5000 | xargs kill -9`

**TypeScript Compilation Errors:**

- Clear dist folder: `rm -rf dist`
- Reinstall: `npm install`

---

## 🚀 Deployment

For production deployment:

1. Set NODE_ENV=production
2. Use production MongoDB instance
3. Set up proper authentication (JWT)
4. Configure CORS properly
5. Use HTTPS
6. Set up database backups
7. Enable logging and monitoring
8. Use environment variables for secrets
