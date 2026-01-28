import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const tacticsRoutes = new Hono<{ Bindings: Env }>();

tacticsRoutes.use("*", authMiddleware);

const createTacticSchema = z.object({
  goalId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "specific"]),
  frequencyCount: z.number().optional(),
});

const updateTacticSchema = createTacticSchema.partial();

// List tactics
tacticsRoutes.get("/", async (c) => {
  const { userId } = c.get("auth");
  const goalId = c.req.query("goalId");

  let query = `
    SELECT t.* FROM tactics t
    JOIN goals g ON t.goal_id = g.id
    WHERE g.user_id = ?
  `;
  const params: string[] = [userId];

  if (goalId) {
    query += " AND t.goal_id = ?";
    params.push(goalId);
  }

  query += " ORDER BY t.created_at DESC";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json({
    success: true,
    data: results.map((tactic) => ({
      id: tactic.id,
      goalId: tactic.goal_id,
      title: tactic.title,
      description: tactic.description,
      frequency: tactic.frequency,
      frequencyCount: tactic.frequency_count,
      createdAt: tactic.created_at,
    })),
  });
});

// Get single tactic
tacticsRoutes.get("/:id", async (c) => {
  const { userId } = c.get("auth");
  const tacticId = c.req.param("id");

  const tactic = await c.env.DB.prepare(`
    SELECT t.* FROM tactics t
    JOIN goals g ON t.goal_id = g.id
    WHERE t.id = ? AND g.user_id = ?
  `)
    .bind(tacticId, userId)
    .first();

  if (!tactic) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Tactic not found" } }, 404);
  }

  return c.json({
    success: true,
    data: {
      id: tactic.id,
      goalId: tactic.goal_id,
      title: tactic.title,
      description: tactic.description,
      frequency: tactic.frequency,
      frequencyCount: tactic.frequency_count,
      createdAt: tactic.created_at,
    },
  });
});

// Create tactic
tacticsRoutes.post("/", zValidator("json", createTacticSchema), async (c) => {
  const { goalId, title, description, frequency, frequencyCount } = c.req.valid("json");

  const tacticId = nanoid();
  await c.env.DB.prepare(
    "INSERT INTO tactics (id, goal_id, title, description, frequency, frequency_count) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(tacticId, goalId, title, description ?? null, frequency, frequencyCount ?? 1)
    .run();

  return c.json({
    success: true,
    data: { id: tacticId },
  });
});

// Update tactic
tacticsRoutes.put("/:id", zValidator("json", updateTacticSchema), async (c) => {
  const { userId } = c.get("auth");
  const tacticId = c.req.param("id");
  const updates = c.req.valid("json");

  const existing = await c.env.DB.prepare(`
    SELECT t.id FROM tactics t
    JOIN goals g ON t.goal_id = g.id
    WHERE t.id = ? AND g.user_id = ?
  `)
    .bind(tacticId, userId)
    .first();

  if (!existing) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Tactic not found" } }, 404);
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
  if (updates.frequency !== undefined) {
    setClauses.push("frequency = ?");
    values.push(updates.frequency);
  }
  if (updates.frequencyCount !== undefined) {
    setClauses.push("frequency_count = ?");
    values.push(updates.frequencyCount);
  }

  if (setClauses.length > 0) {
    values.push(tacticId);
    await c.env.DB.prepare(`UPDATE tactics SET ${setClauses.join(", ")} WHERE id = ?`)
      .bind(...values)
      .run();
  }

  return c.json({ success: true });
});

// Delete tactic
tacticsRoutes.delete("/:id", async (c) => {
  const { userId } = c.get("auth");
  const tacticId = c.req.param("id");

  await c.env.DB.prepare(`
    DELETE FROM tactics WHERE id = ? AND goal_id IN (
      SELECT id FROM goals WHERE user_id = ?
    )
  `)
    .bind(tacticId, userId)
    .run();

  return c.json({ success: true });
});

export { tacticsRoutes };
