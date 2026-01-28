import { Hono } from "hono";
import { nanoid } from "nanoid";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const scorecardRoutes = new Hono<{ Bindings: Env }>();

scorecardRoutes.use("*", authMiddleware);

// Get current week scorecard
scorecardRoutes.get("/current", async (c) => {
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
      data: null,
    });
  }

  // Calculate current week
  const startDate = new Date(cycle.start_date as string);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 12);

  const scorecard = await c.env.DB.prepare(
    "SELECT * FROM scorecards WHERE user_id = ? AND cycle_id = ? AND week_number = ?"
  )
    .bind(userId, cycle.id, currentWeek)
    .first();

  if (!scorecard) {
    // Calculate from tasks
    const taskStats = await c.env.DB.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM weekly_tasks
      WHERE user_id = ? AND cycle_id = ? AND week_number = ?
    `)
      .bind(userId, cycle.id, currentWeek)
      .first();

    const planned = (taskStats?.total as number) ?? 0;
    const completed = (taskStats?.completed as number) ?? 0;
    const score = planned > 0 ? Math.round((completed / planned) * 100) : 0;

    return c.json({
      success: true,
      data: {
        weekNumber: currentWeek,
        cycleId: cycle.id,
        plannedTasks: planned,
        completedTasks: completed,
        executionScore: score,
        reflection: null,
      },
    });
  }

  return c.json({
    success: true,
    data: {
      id: scorecard.id,
      weekNumber: scorecard.week_number,
      cycleId: scorecard.cycle_id,
      plannedTasks: scorecard.planned_tasks,
      completedTasks: scorecard.completed_tasks,
      executionScore: scorecard.execution_score,
      reflection: scorecard.reflection,
    },
  });
});

// Get scorecard history
scorecardRoutes.get("/history", async (c) => {
  const { userId } = c.get("auth");
  const cycleId = c.req.query("cycleId");

  let query = "SELECT * FROM scorecards WHERE user_id = ?";
  const params: string[] = [userId];

  if (cycleId) {
    query += " AND cycle_id = ?";
    params.push(cycleId);
  }

  query += " ORDER BY week_number";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json({
    success: true,
    data: results.map((sc) => ({
      id: sc.id,
      weekNumber: sc.week_number,
      cycleId: sc.cycle_id,
      plannedTasks: sc.planned_tasks,
      completedTasks: sc.completed_tasks,
      executionScore: sc.execution_score,
      reflection: sc.reflection,
      createdAt: sc.created_at,
    })),
  });
});

// Get trend data
scorecardRoutes.get("/trend", async (c) => {
  const { userId } = c.get("auth");
  const cycleId = c.req.query("cycleId");

  let query = "SELECT week_number, execution_score FROM scorecards WHERE user_id = ?";
  const params: string[] = [userId];

  if (cycleId) {
    query += " AND cycle_id = ?";
    params.push(cycleId);
  }

  query += " ORDER BY week_number";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  // Calculate average
  const scores = results.map((r) => r.execution_score as number);
  const average = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return c.json({
    success: true,
    data: {
      trend: results.map((r) => ({
        week: r.week_number,
        score: r.execution_score,
      })),
      average,
    },
  });
});

// Calculate and save scorecard
scorecardRoutes.post("/calculate", async (c) => {
  const { userId } = c.get("auth");

  // Get active cycle
  const cycle = await c.env.DB.prepare(
    "SELECT * FROM cycles WHERE user_id = ? AND status = 'active' LIMIT 1"
  )
    .bind(userId)
    .first();

  if (!cycle) {
    return c.json({ success: false, error: { code: "NO_CYCLE", message: "No active cycle found" } }, 400);
  }

  // Calculate current week
  const startDate = new Date(cycle.start_date as string);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeek = Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 12);

  // Get task stats
  const taskStats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM weekly_tasks
    WHERE user_id = ? AND cycle_id = ? AND week_number = ?
  `)
    .bind(userId, cycle.id, currentWeek)
    .first();

  const planned = (taskStats?.total as number) ?? 0;
  const completed = (taskStats?.completed as number) ?? 0;
  const score = planned > 0 ? Math.round((completed / planned) * 100) : 0;

  // Upsert scorecard
  const existing = await c.env.DB.prepare(
    "SELECT id FROM scorecards WHERE user_id = ? AND cycle_id = ? AND week_number = ?"
  )
    .bind(userId, cycle.id, currentWeek)
    .first();

  if (existing) {
    await c.env.DB.prepare(
      "UPDATE scorecards SET planned_tasks = ?, completed_tasks = ?, execution_score = ? WHERE id = ?"
    )
      .bind(planned, completed, score, existing.id)
      .run();
  } else {
    const scorecardId = nanoid();
    await c.env.DB.prepare(
      "INSERT INTO scorecards (id, user_id, cycle_id, week_number, planned_tasks, completed_tasks, execution_score) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(scorecardId, userId, cycle.id, currentWeek, planned, completed, score)
      .run();
  }

  return c.json({
    success: true,
    data: {
      weekNumber: currentWeek,
      plannedTasks: planned,
      completedTasks: completed,
      executionScore: score,
    },
  });
});

export { scorecardRoutes };
