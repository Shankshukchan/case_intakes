# Technical Documentation

## Project Structure

```
src/app/
├── App.tsx                      # Main app entry point
├── routes.tsx                   # React Router configuration
├── types/
│   └── index.ts                 # TypeScript type definitions
├── services/                    # Data layer (simulates backend)
│   ├── storage.service.ts       # LocalStorage persistence
│   ├── validation.service.ts    # Backend-style validation
│   ├── case.service.ts          # Case CRUD operations
│   ├── task.service.ts          # Task CRUD operations
│   ├── dashboard.service.ts     # Metrics calculation
│   └── uuid.ts                  # UUID generator
├── hooks/                       # Custom React hooks
│   ├── useCases.ts              # Case management hook
│   ├── useTasks.ts              # Task management hook
│   ├── useDashboard.ts          # Dashboard metrics hook
│   └── useUser.ts               # User role management hook
├── components/                  # React components
│   ├── Dashboard.tsx            # Dashboard metrics display
│   ├── CaseForm.tsx             # Case create/edit form
│   ├── CaseList.tsx             # Cases table
│   ├── CaseFilters.tsx          # Search and filter UI
│   ├── TaskForm.tsx             # Task create/edit form
│   ├── TaskList.tsx             # Tasks grouped by status
│   ├── Layout.tsx               # App layout with navigation
│   ├── DataControls.tsx         # Demo data reset button
│   └── ui/                      # shadcn/ui components
├── pages/                       # Page components
│   ├── DashboardPage.tsx        # Dashboard route
│   ├── CasesPage.tsx            # Cases list route
│   ├── CaseDetailPage.tsx       # Case detail route
│   └── NotFoundPage.tsx         # 404 route
└── utils/
    └── seedData.ts              # Demo data initialization
```

## Data Flow Architecture

### 1. Service Layer (Backend Simulation)

The service layer simulates a REST API with async operations:

```typescript
// Example: Case Service
CaseService.createCase(data)
  → ValidationService.validateCase(data)
  → StorageService.saveCases([...cases, newCase])
  → Returns ApiResponse<Case>
```

All service methods return `ApiResponse<T>` format:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: ValidationError[];
}
```

### 2. Custom Hooks (State Management)

Hooks provide a clean API for components to interact with services:

```typescript
// Example: useCases hook
const { cases, loading, error, createCase, updateCase, deleteCase } = useCases(filters);

// Internally handles:
// - API calls to services
// - Loading states
// - Error handling
// - Toast notifications
// - Data refreshing
```

### 3. Components (UI Layer)

Components are purely presentational and receive data via hooks:

```typescript
function CasesPage() {
  const { cases, createCase } = useCases();
  // Component only handles UI logic and user interactions
}
```

## Key Design Patterns

### 1. Service Layer Pattern
Separates business logic and data access from UI components.

**Benefits:**
- Easy to replace LocalStorage with real API
- Consistent error handling
- Testable business logic

### 2. Custom Hooks Pattern
Encapsulates data fetching and state management.

**Benefits:**
- Reusable across components
- Clean component code
- Easy to add caching/optimistic updates

### 3. Optimistic UI Updates
Some operations (like task toggle) could use optimistic updates for better UX.

### 4. Error Boundaries
Could be added for production to catch React errors gracefully.

## State Management Strategy

**No external state management library** (Redux, Zustand, etc.) is used because:
1. App is relatively simple
2. Most state is server-synced (cases, tasks)
3. Custom hooks provide sufficient abstraction
4. React's built-in useState/useEffect are adequate

**When to add state management:**
- Real-time collaboration features
- Complex client-side data transformations
- Offline-first requirements
- Large amount of global state

## Performance Considerations

### Current Implementation
- ✅ Lazy loading with React.lazy could be added for routes
- ✅ Memoization with useMemo/useCallback where beneficial
- ✅ Loading skeletons prevent layout shift
- ✅ Debouncing could be added to search input

### Future Optimizations
- **Virtual scrolling** for large case lists (react-window)
- **Query caching** if switching to real API (React Query/SWR)
- **Pagination** for cases and tasks
- **Incremental loading** for dashboard metrics

## Data Validation Strategy

### Frontend Validation
- Real-time validation in forms
- Required field checks
- Type validation (dates, numbers)
- Character limits
- User-friendly error messages

### Backend Validation (Service Layer)
- Same validation rules in ValidationService
- Prevents invalid data from being stored
- Returns structured error responses
- Simulates 400 Bad Request behavior

**Why both?**
- Frontend: Better UX with immediate feedback
- Backend: Security and data integrity
- Consistency between layers

## API Response Simulation

Services simulate HTTP status codes:

```typescript
// 200 OK - Success
{ success: true, data: {...} }

// 400 Bad Request - Validation Error
{ 
  success: false, 
  error: "Validation failed",
  validationErrors: [{ field: "title", message: "..." }]
}

// 404 Not Found - Resource Not Found
{ success: false, error: "Case not found" }

// 500 Internal Server Error - Generic Error
{ success: false, error: "Failed to create case" }
```

## LocalStorage Schema

### Keys
- `legal_cases` - Array of Case objects
- `hearing_tasks` - Array of HearingTask objects
- `current_user` - User object with role

### Data Format
```typescript
// legal_cases
[
  {
    id: "uuid",
    caseTitle: "string",
    clientName: "string",
    courtName: "string",
    caseType: "string",
    nextHearingDate: "ISO 8601 date string",
    stage: "Filing" | "Evidence" | "Arguments" | "Order Reserved",
    notes: "string?",
    createdAt: "ISO 8601 date string",
    updatedAt: "ISO 8601 date string"
  }
]

// hearing_tasks
[
  {
    id: "uuid",
    caseId: "uuid (foreign key)",
    title: "string",
    dueDate: "ISO 8601 date string",
    ownerName: "string",
    priority: "Low" | "Medium" | "High",
    status: "Pending" | "Completed",
    createdAt: "ISO 8601 date string",
    updatedAt: "ISO 8601 date string"
  }
]
```

## Migration Path to Real Backend

To convert this to a real MERN stack:

### 1. Replace Service Layer
```typescript
// Before (LocalStorage)
const cases = await StorageService.getCases();

// After (Real API)
const response = await fetch('/api/cases');
const cases = await response.json();
```

### 2. Add API Routes (Express)
```typescript
// server/routes/cases.js
router.get('/api/cases', casesController.getAll);
router.post('/api/cases', casesController.create);
router.put('/api/cases/:id', casesController.update);
router.delete('/api/cases/:id', casesController.delete);
```

### 3. Add MongoDB Models
```typescript
// server/models/Case.js
const CaseSchema = new mongoose.Schema({
  caseTitle: { type: String, required: true, minlength: 3 },
  clientName: { type: String, required: true },
  // ... other fields
}, { timestamps: true });
```

### 4. No Changes Needed To:
- React components
- Custom hooks (maybe update error handling)
- TypeScript types
- UI/UX

## Testing Strategy

### Unit Tests
```typescript
// Service layer tests
describe('CaseService', () => {
  it('should create case with valid data', async () => {
    const result = await CaseService.createCase(validCase);
    expect(result.success).toBe(true);
  });
  
  it('should reject case with invalid data', async () => {
    const result = await CaseService.createCase(invalidCase);
    expect(result.success).toBe(false);
    expect(result.validationErrors).toBeDefined();
  });
});

// Validation tests
describe('ValidationService', () => {
  it('should validate required fields', () => {
    const errors = ValidationService.validateCase({});
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

### Component Tests
```typescript
// Component tests with React Testing Library
describe('CaseForm', () => {
  it('should show validation errors', async () => {
    render(<CaseForm onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByText('Create Case'));
    
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
// Full workflow tests
describe('Case Management Workflow', () => {
  it('should create, edit, and delete case', async () => {
    // Create
    const created = await CaseService.createCase(testCase);
    expect(created.success).toBe(true);
    
    // Edit
    const updated = await CaseService.updateCase(created.data.id, { stage: 'Evidence' });
    expect(updated.data.stage).toBe('Evidence');
    
    // Delete
    const deleted = await CaseService.deleteCase(created.data.id);
    expect(deleted.success).toBe(true);
  });
});
```

## Security Considerations

### Current Implementation (Demo)
⚠️ **Not suitable for production:**
- No authentication
- No authorization beyond role UI
- Data stored in browser (can be manipulated)
- No input sanitization
- No rate limiting

### Production Requirements
✅ **Must add:**
- JWT-based authentication
- Role-based authorization (middleware)
- Input sanitization (DOMPurify for notes)
- HTTPS only
- CORS configuration
- Rate limiting (express-rate-limit)
- SQL injection prevention (Mongoose handles this)
- XSS prevention
- CSRF tokens for mutations
- Audit logging

## Environment Configuration

### Development
```typescript
// .env.development
VITE_API_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

### Production
```typescript
// .env.production
VITE_API_URL=https://api.legalops.com/api
VITE_ENVIRONMENT=production
```

## Build and Deployment

### Build for Production
```bash
npm run build
# Generates /dist folder with optimized assets
```

### Deployment Options
- **Vercel/Netlify**: Frontend static hosting
- **Railway/Render**: Full-stack with backend
- **AWS S3 + CloudFront**: Frontend CDN
- **Docker**: Containerized deployment

## Monitoring and Observability

For production, add:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: Usage analytics
- **Datadog/New Relic**: Performance monitoring

## Browser Support

Targets modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Uses:
- ES6+ features
- CSS Grid/Flexbox
- LocalStorage API
- Fetch API
- Date API

## Accessibility

Current implementation:
✅ Semantic HTML
✅ Keyboard navigation
✅ Focus indicators
✅ ARIA labels on icons
✅ Form labels
✅ Screen reader text

Could improve:
- Skip to content link
- Focus trap in modals
- Announcement regions for dynamic content
- Color contrast checks
- Reduced motion support

## Contributing

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Keep components under 300 lines
- Extract reusable logic to hooks

### Git Workflow
```bash
# Feature development
git checkout -b feature/task-priorities
git commit -m "feat: add task priority sorting"

# Bug fixes
git checkout -b fix/date-validation
git commit -m "fix: handle invalid date formats"
```

### Commit Message Format
```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance
```

## License

This is an assignment project for demonstration purposes.
