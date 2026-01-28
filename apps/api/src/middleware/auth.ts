import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import * as jose from "jose";
import type { Env, AuthContext } from "../types";

declare module "hono" {
  interface ContextVariableMap {
    auth: AuthContext;
  }
}

export const authMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Missing or invalid authorization header" });
  }

  const token = authHeader.substring(7);

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    c.set("auth", {
      userId: payload.sub as string,
      email: payload.email as string,
    });

    await next();
  } catch {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }
});
