import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const visionRoutes = new Hono<{ Bindings: Env }>();

visionRoutes.use("*", authMiddleware);

const updateVisionSchema = z.object({
  longTermVision: z.string().optional(),
  midTermVision: z.string().optional(),
});

// Get vision
visionRoutes.get("/", async (c) => {
  const { userId } = c.get("auth");

  const vision = await c.env.DB.prepare(
    "SELECT id, long_term_vision, mid_term_vision, updated_at FROM visions WHERE user_id = ?"
  )
    .bind(userId)
    .first();

  if (!vision) {
    return c.json({
      success: true,
      data: null,
    });
  }

  return c.json({
    success: true,
    data: {
      id: vision.id,
      longTermVision: vision.long_term_vision,
      midTermVision: vision.mid_term_vision,
      updatedAt: vision.updated_at,
    },
  });
});

// Update or create vision
visionRoutes.put("/", zValidator("json", updateVisionSchema), async (c) => {
  const { userId } = c.get("auth");
  const { longTermVision, midTermVision } = c.req.valid("json");

  const existing = await c.env.DB.prepare("SELECT id FROM visions WHERE user_id = ?").bind(userId).first();

  if (existing) {
    await c.env.DB.prepare(
      "UPDATE visions SET long_term_vision = ?, mid_term_vision = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
    )
      .bind(longTermVision ?? null, midTermVision ?? null, userId)
      .run();
  } else {
    const visionId = nanoid();
    await c.env.DB.prepare(
      "INSERT INTO visions (id, user_id, long_term_vision, mid_term_vision) VALUES (?, ?, ?, ?)"
    )
      .bind(visionId, userId, longTermVision ?? null, midTermVision ?? null)
      .run();
  }

  return c.json({ success: true });
});

export { visionRoutes };
