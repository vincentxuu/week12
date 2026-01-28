// Re-export shared types
export type {
  User,
  Vision,
  Cycle,
  Goal,
  Tactic,
  WeeklyTask,
  WeeklyScore,
  Partner,
  Meeting,
  DashboardSummary,
  TimeBlock,
  NotificationSettings,
  UserSettings,
  ApiResponse,
  PaginatedResponse,
} from "@week12/shared";

// Cloudflare Workers Environment Bindings
export interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
  CACHE: KVNamespace;
  ENVIRONMENT: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

// JWT Payload
export interface JWTPayload {
  sub: string; // user id
  email: string;
  iat: number;
  exp: number;
}

// Auth Context
export interface AuthContext {
  userId: string;
  email: string;
}
