import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const weeklyRoutes = new Hono<{ Bindings: Env }>();

weeklyRoutes.use("*", authMiddleware);

const createTaskSchema = z.object({
  tacticId: z.string(),
  cycleId: z.string(),
  weekNumber: z.number().min(1).max(12),
  notes: z.string().optional(),
});

const updateTaskSchema = z.object({
  status: z.enum(["pending", "completed", "skipped"]).optional(),
  notes: z.string().optional(),
});

// Get current week tasks
weeklyRoutes.get("/current", async (c) => {
  const { userId } = c.get("auth");

  // Get active cycle
  const cycle = await c.env.DB.prepare(
    "SELECT * FROM cycles WHERE user_id = ? AND status = 'active' LIMIT 1"
  )
    .bind(userId)
    .first();

  if (!cycle) {
    return c.json({
      success: true,
      data: { weekNumber: 1, tasks: [] },
    });
  }

  // Calculate current week based on start date
  const startDate = new Date(cycle.start_date as string);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 12);

  const { results } = await c.env.DB.prepare(`
    SELECT wt.*, t.title as tactic_title, g.title as goal_title
    FROM weekly_tasks wt
    JOIN tactics t ON wt.tactic_id = t.id
    JOIN goals g ON t.goal_id = g.id
    WHERE wt.user_id = ? AND wt.cycle_id = ? AND wt.week_number = ?
    ORDER BY wt.created_at
  `)
    .bind(userId, cycle.id, currentWeek)
    .all();

  return c.json({
    success: true,
    data: {
      weekNumber: currentWeek,
      cycleId: cycle.id,
      tasks: results.map((task) => ({
        id: task.id,
        tacticId: task.tactic_id,
        tacticTitle: task.tactic_title,
        goalTitle: task.goal_title,
        weekNumber: task.week_number,
        status: task.status,
        completedAt: task.completed_at,
        notes: task.notes,
      })),
    },
  });
});

// Get specific week tasks
weeklyRoutes.get("/:weekNumber", async (c) => {
  const { userId } = c.get("auth");
  const weekNumber = parseInt(c.req.param("weekNumber"));
  const cycleId = c.req.query("cycleId");

  if (weekNumber < 1 || weekNumber > 12) {
    return c.json({ success: false, error: { code: "INVALID_WEEK", message: "Week number must be between 1 and 12" } }, 400);
  }

  let query = `
    SELECT wt.*, t.title as tactic_title, g.title as goal_title
    FROM weekly_tasks wt
    JOIN tactics t ON wt.tactic_id = t.id
    JOIN goals g ON t.goal_id = g.id
    WHERE wt.user_id = ? AND wt.week_number = ?
  `;
  const params: (string | number)[] = [userId, weekNumber];

  if (cycleId) {
    query += " AND wt.cycle_id = ?";
    params.push(cycleId);
  }

  query += " ORDER BY wt.created_at";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json({
    success: true,
    data: {
      weekNumber,
      tasks: results.map((task) => ({
        id: task.id,
        tacticId: task.tactic_id,
        tacticTitle: task.tactic_title,
        goalTitle: task.goal_title,
        cycleId: task.cycle_id,
        status: task.status,
        completedAt: task.completed_at,
        notes: task.notes,
      })),
    },
  });
});

// Create weekly task
weeklyRoutes.post("/tasks", zValidator("json", createTaskSchema), async (c) => {
  const { userId } = c.get("auth");
  const { tacticId, cycleId, weekNumber, notes } = c.req.valid("json");

  const taskId = nanoid();
  await c.env.DB.prepare(
    "INSERT INTO weekly_tasks (id, tactic_id, user_id, cycle_id, week_number, notes) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(taskId, tacticId, userId, cycleId, weekNumber, notes ?? null)
    .run();

  return c.json({
    success: true,
    data: { id: taskId },
  });
});

// Update task status
weeklyRoutes.patch("/tasks/:id", zValidator("json", updateTaskSchema), async (c) => {
  const { userId } = c.get("auth");
  const taskId = c.req.param("id");
  const { status, notes } = c.req.valid("json");

  const existing = await c.env.DB.prepare("SELECT id FROM weekly_tasks WHERE id = ? AND user_id = ?")
    .bind(taskId, userId)
    .first();

  if (!existing) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Task not found" } }, 404);
  }

  const setClauses: string[] = [];
  const values: (string | null)[] = [];

  if (status !== undefined) {
    setClauses.push("status = ?");
    values.push(status);

    if (status === "completed") {
      setClauses.push("completed_at = CURRENT_TIMESTAMP");
    } else {
      setClauses.push("completed_at = NULL");
    }
  }

  if (notes !== undefined) {
    setClauses.push("notes = ?");
    values.push(notes);
  }

  if (setClauses.length > 0) {
    values.push(taskId);
    await c.env.DB.prepare(`UPDATE weekly_tasks SET ${setClauses.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
  }

  return c.json({ success: true });
});

// List all tasks
weeklyRoutes.get("/tasks", async (c) => {
  const { userId } = c.get("auth");
  const cycleId = c.req.query("cycleId");

  let query = `
    SELECT wt.*, t.title as tactic_title, g.title as goal_title
    FROM weekly_tasks wt
    JOIN tactics t ON wt.tactic_id = t.id
    JOIN goals g ON t.goal_id = g.id
    WHERE wt.user_id = ?
  `;
  const params: string[] = [userId];

  if (cycleId) {
    query += " AND wt.cycle_id = ?";
    params.push(cycleId);
  }

  query += " ORDER BY wt.week_number, wt.created_at";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json({
    success: true,
    data: results.map((task) => ({
      id: task.id,
      tacticId: task.tactic_id,
      tacticTitle: task.tactic_title,
      goalTitle: task.goal_title,
      cycleId: task.cycle_id,
      weekNumber: task.week_number,
      status: task.status,
      completedAt: task.completed_at,
      notes: task.notes,
    })),
  });
});

export { weeklyRoutes };
