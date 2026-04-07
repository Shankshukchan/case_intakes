import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import casesRouter from "./routes/cases.js";
import tasksRouter from "./routes/tasks.js";
import dashboardRouter from "./routes/dashboard.js";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/case-intake";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✓ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("✗ MongoDB connection error:", error.message);
    process.exit(1);
  });

// Routes
app.use("/api/cases", casesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/users", usersRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  },
);

// Start server
app.listen(PORT, () => {
  console.log(`
╭─────────────────────────────────────────────╮
│  Case Intake Backend Server                 │
│  Running on http://localhost:${PORT}        │
│  MongoDB: ${MONGODB_URI}  │
╰─────────────────────────────────────────────╯
  `);
});

export default app;
