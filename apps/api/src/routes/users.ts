import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const usersRoutes = new Hono<{ Bindings: Env }>();

usersRoutes.use("*", authMiddleware);

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().url().optional(),
  timezone: z.string().optional(),
});

// Get current user
usersRoutes.get("/me", async (c) => {
  const { userId } = c.get("auth");

  const user = await c.env.DB.prepare(
    "SELECT id, email, name, avatar_url, timezone, created_at FROM users WHERE id = ?"
  )
    .bind(userId)
    .first();

  if (!user) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } }, 404);
  }

  return c.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar_url,
      timezone: user.timezone,
      createdAt: user.created_at,
    },
  });
});

// Update current user
usersRoutes.patch("/me", zValidator("json", updateUserSchema), async (c) => {
  const { userId } = c.get("auth");
  const updates = c.req.valid("json");

  const setClauses: string[] = [];
  const values: (string | null)[] = [];

  if (updates.name) {
    setClauses.push("name = ?");
    values.push(updates.name);
  }
  if (updates.avatar) {
    setClauses.push("avatar_url = ?");
    values.push(updates.avatar);
  }
  if (updates.timezone) {
    setClauses.push("timezone = ?");
    values.push(updates.timezone);
  }

  if (setClauses.length === 0) {
    return c.json({ success: false, error: { code: "NO_UPDATES", message: "No fields to update" } }, 400);
  }

  setClauses.push("updated_at = CURRENT_TIMESTAMP");
  values.push(userId);

  await c.env.DB.prepare(`UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return c.json({ success: true });
});

// Delete account
usersRoutes.delete("/me", async (c) => {
  const { userId } = c.get("auth");

  await c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();

  return c.json({ success: true });
});

export { usersRoutes };
