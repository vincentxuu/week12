import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const goalsRoutes = new Hono<{ Bindings: Env }>();

goalsRoutes.use("*", authMiddleware);

const createGoalSchema = z.object({
  cycleId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  targetMetric: z.string().optional(),
  targetValue: z.number().optional(),
});

const updateGoalSchema = createGoalSchema.partial();

// List goals
goalsRoutes.get("/", async (c) => {
  const { userId } = c.get("auth");
  const cycleId = c.req.query("cycleId");

  let query = "SELECT * FROM goals WHERE user_id = ?";
  const params: string[] = [userId];

  if (cycleId) {
    query += " AND cycle_id = ?";
    params.push(cycleId);
  }

  query += " ORDER BY created_at DESC";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json({
    success: true,
    data: results.map((goal) => ({
      id: goal.id,
      cycleId: goal.cycle_id,
      title: goal.title,
      description: goal.description,
      targetMetric: goal.target_metric,
      targetValue: goal.target_value,
      currentValue: goal.current_value,
      status: goal.status,
      createdAt: goal.created_at,
    })),
  });
});

// Get single goal
goalsRoutes.get("/:id", async (c) => {
  const { userId } = c.get("auth");
  const goalId = c.req.param("id");

  const goal = await c.env.DB.prepare("SELECT * FROM goals WHERE id = ? AND user_id = ?")
    .bind(goalId, userId)
    .first();

  if (!goal) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Goal not found" } }, 404);
  }

  return c.json({
    success: true,
    data: {
      id: goal.id,
      cycleId: goal.cycle_id,
      title: goal.title,
      description: goal.description,
      targetMetric: goal.target_metric,
      targetValue: goal.target_value,
      currentValue: goal.current_value,
      status: goal.status,
      createdAt: goal.created_at,
    },
  });
});

// Create goal
goalsRoutes.post("/", zValidator("json", createGoalSchema), async (c) => {
  const { userId } = c.get("auth");
  const { cycleId, title, description, targetMetric, targetValue } = c.req.valid("json");

  const goalId = nanoid();
  await c.env.DB.prepare(
    "INSERT INTO goals (id, user_id, cycle_id, title, description, target_metric, target_value) VALUES (?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(goalId, userId, cycleId, title, description ?? null, targetMetric ?? null, targetValue ?? null)
    .run();

  return c.json({
    success: true,
    data: { id: goalId },
  });
});

// Update goal
goalsRoutes.put("/:id", zValidator("json", updateGoalSchema), async (c) => {
  const { userId } = c.get("auth");
  const goalId = c.req.param("id");
  const updates = c.req.valid("json");

  const existing = await c.env.DB.prepare("SELECT id FROM goals WHERE id = ? AND user_id = ?")
    .bind(goalId, userId)
    .first();

  if (!existing) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Goal not found" } }, 404);
  }

  const setClauses: string[] = [];
  const values: (string | number | null)[] = [];

  if (updates.title !== undefined) {
    setClauses.push("title = ?");
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    setClauses.push("description = ?");
    values.push(updates.description);
  }
  if (updates.targetMetric !== undefined) {
    setClauses.push("target_metric = ?");
    values.push(updates.targetMetric);
  }
  if (updates.targetValue !== undefined) {
    setClauses.push("target_value = ?");
    values.push(updates.targetValue);
  }

  if (setClauses.length > 0) {
    setClauses.push("updated_at = CURRENT_TIMESTAMP");
    values.push(goalId);

    await c.env.DB.prepare(`UPDATE goals SET ${setClauses.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
  }

  return c.json({ success: true });
});

// Delete goal
goalsRoutes.delete("/:id", async (c) => {
  const { userId } = c.get("auth");
  const goalId = c.req.param("id");

  await c.env.DB.prepare("DELETE FROM goals WHERE id = ? AND user_id = ?").bind(goalId, userId).run();

  return c.json({ success: true });
});

export { goalsRoutes };
