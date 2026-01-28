import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { Env } from "../types";
import { authMiddleware } from "../middleware/auth";

const partnersRoutes = new Hono<{ Bindings: Env }>();

partnersRoutes.use("*", authMiddleware);

const inviteSchema = z.object({
  email: z.string().email(),
});

const meetingSchema = z.object({
  partnerId: z.string().optional(),
  cycleId: z.string(),
  weekNumber: z.number().min(1).max(12),
  meetingDate: z.string().optional(),
  commitments: z.array(z.string()).optional(),
  reviewNotes: z.string().optional(),
});

// List partners
partnersRoutes.get("/partners", async (c) => {
  const { userId } = c.get("auth");

  const { results } = await c.env.DB.prepare(`
    SELECT p.*, u.name as partner_name, u.avatar_url as partner_avatar, u.email as partner_email
    FROM partners p
    JOIN users u ON p.partner_id = u.id
    WHERE p.user_id = ?
    UNION
    SELECT p.*, u.name as partner_name, u.avatar_url as partner_avatar, u.email as partner_email
    FROM partners p
    JOIN users u ON p.user_id = u.id
    WHERE p.partner_id = ?
  `)
    .bind(userId, userId)
    .all();

  return c.json({
    success: true,
    data: results.map((p) => ({
      id: p.id,
      partnerId: p.partner_id === userId ? p.user_id : p.partner_id,
      partnerName: p.partner_name,
      partnerAvatar: p.partner_avatar,
      partnerEmail: p.partner_email,
      status: p.status,
      createdAt: p.created_at,
    })),
  });
});

// Invite partner
partnersRoutes.post("/invite", zValidator("json", inviteSchema), async (c) => {
  const { userId } = c.get("auth");
  const { email } = c.req.valid("json");

  // Find user by email
  const targetUser = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();

  if (!targetUser) {
    return c.json({ success: false, error: { code: "USER_NOT_FOUND", message: "User not found with this email" } }, 404);
  }

  if (targetUser.id === userId) {
    return c.json({ success: false, error: { code: "SELF_INVITE", message: "Cannot invite yourself" } }, 400);
  }

  // Check existing partnership
  const existing = await c.env.DB.prepare(`
    SELECT id FROM partners
    WHERE (user_id = ? AND partner_id = ?) OR (user_id = ? AND partner_id = ?)
  `)
    .bind(userId, targetUser.id, targetUser.id, userId)
    .first();

  if (existing) {
    return c.json({ success: false, error: { code: "ALREADY_PARTNERS", message: "Partnership already exists" } }, 409);
  }

  const partnerId = nanoid();
  await c.env.DB.prepare("INSERT INTO partners (id, user_id, partner_id, status) VALUES (?, ?, ?, 'pending')")
    .bind(partnerId, userId, targetUser.id)
    .run();

  return c.json({
    success: true,
    data: { id: partnerId },
  });
});

// Accept invitation
partnersRoutes.post("/accept/:id", async (c) => {
  const { userId } = c.get("auth");
  const partnershipId = c.req.param("id");

  const partnership = await c.env.DB.prepare("SELECT * FROM partners WHERE id = ? AND partner_id = ? AND status = 'pending'")
    .bind(partnershipId, userId)
    .first();

  if (!partnership) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Invitation not found" } }, 404);
  }

  await c.env.DB.prepare("UPDATE partners SET status = 'accepted' WHERE id = ?")
    .bind(partnershipId)
    .run();

  return c.json({ success: true });
});

// Remove partner
partnersRoutes.delete("/partners/:id", async (c) => {
  const { userId } = c.get("auth");
  const partnershipId = c.req.param("id");

  await c.env.DB.prepare("DELETE FROM partners WHERE id = ? AND (user_id = ? OR partner_id = ?)")
    .bind(partnershipId, userId, userId)
    .run();

  return c.json({ success: true });
});

// List meetings
partnersRoutes.get("/meetings", async (c) => {
  const { userId } = c.get("auth");
  const cycleId = c.req.query("cycleId");

  let query = "SELECT * FROM partner_meetings WHERE user_id = ?";
  const params: string[] = [userId];

  if (cycleId) {
    query += " AND cycle_id = ?";
    params.push(cycleId);
  }

  query += " ORDER BY week_number DESC, meeting_date DESC";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json({
    success: true,
    data: results.map((m) => ({
      id: m.id,
      partnerId: m.partner_id,
      cycleId: m.cycle_id,
      weekNumber: m.week_number,
      meetingDate: m.meeting_date,
      commitments: m.commitments ? JSON.parse(m.commitments as string) : [],
      reviewNotes: m.review_notes,
      createdAt: m.created_at,
    })),
  });
});

// Create meeting record
partnersRoutes.post("/meetings", zValidator("json", meetingSchema), async (c) => {
  const { userId } = c.get("auth");
  const { partnerId, cycleId, weekNumber, meetingDate, commitments, reviewNotes } = c.req.valid("json");

  const meetingId = nanoid();
  await c.env.DB.prepare(
    "INSERT INTO partner_meetings (id, user_id, partner_id, cycle_id, week_number, meeting_date, commitments, review_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      meetingId,
      userId,
      partnerId ?? null,
      cycleId,
      weekNumber,
      meetingDate ?? null,
      commitments ? JSON.stringify(commitments) : null,
      reviewNotes ?? null
    )
    .run();

  return c.json({
    success: true,
    data: { id: meetingId },
  });
});

export { partnersRoutes };
