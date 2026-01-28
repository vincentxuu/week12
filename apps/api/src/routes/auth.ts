import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as jose from "jose";
import { nanoid } from "nanoid";
import type { Env } from "../types";

const authRoutes = new Hono<{ Bindings: Env }>();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

// Login
authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  // TODO: Implement actual password verification with hashing
  const user = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

  if (!user) {
    return c.json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } }, 401);
  }

  // Generate JWT
  const secret = new TextEncoder().encode(c.env.JWT_SECRET);
  const token = await new jose.SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id as string)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return c.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar_url,
      },
    },
  });
});

// Register
authRoutes.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password, name } = c.req.valid("json");

  // Check if user exists
  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();

  if (existing) {
    return c.json({ success: false, error: { code: "USER_EXISTS", message: "Email already registered" } }, 409);
  }

  // TODO: Hash password before storing
  const userId = nanoid();
  await c.env.DB.prepare(
    "INSERT INTO users (id, email, name, auth_provider, password_hash) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(userId, email, name, "email", password)
    .run();

  // Generate JWT
  const secret = new TextEncoder().encode(c.env.JWT_SECRET);
  const token = await new jose.SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return c.json({
    success: true,
    data: {
      token,
      user: {
        id: userId,
        email,
        name,
      },
    },
  });
});

// Logout (client-side token removal, but can be used for token blacklisting)
authRoutes.post("/logout", (c) => {
  return c.json({ success: true });
});

export { authRoutes };
