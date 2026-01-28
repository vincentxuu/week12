import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { Env } from "./types";

// Routes
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";
import { visionRoutes } from "./routes/vision";
import { goalsRoutes } from "./routes/goals";
import { tacticsRoutes } from "./routes/tactics";
import { weeklyRoutes } from "./routes/weekly";
import { scorecardRoutes } from "./routes/scorecard";
import { partnersRoutes } from "./routes/partners";

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://week12.app"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
const api = app.basePath("/api/v1");

api.route("/auth", authRoutes);
api.route("/users", usersRoutes);
api.route("/vision", visionRoutes);
api.route("/goals", goalsRoutes);
api.route("/tactics", tacticsRoutes);
api.route("/weekly", weeklyRoutes);
api.route("/scorecard", scorecardRoutes);
api.route("/partners", partnersRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: { code: "NOT_FOUND", message: "Route not found" } }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json(
    { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
    500
  );
});

export default app;
