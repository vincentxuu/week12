-- Users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    auth_provider TEXT NOT NULL DEFAULT 'email',
    password_hash TEXT,
    timezone TEXT DEFAULT 'Asia/Taipei',
    notification_enabled INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Visions
CREATE TABLE IF NOT EXISTS visions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    long_term_vision TEXT,
    mid_term_vision TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 12-Week Cycles
CREATE TABLE IF NOT EXISTS cycles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    final_score REAL,
    review_notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cycle_id TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_metric TEXT,
    target_value REAL,
    current_value REAL DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Tactics
CREATE TABLE IF NOT EXISTS tactics (
    id TEXT PRIMARY KEY,
    goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'specific')),
    frequency_count INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Weekly Tasks
CREATE TABLE IF NOT EXISTS weekly_tasks (
    id TEXT PRIMARY KEY,
    tactic_id TEXT NOT NULL REFERENCES tactics(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 12),
    cycle_id TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
    completed_at TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Scorecards
CREATE TABLE IF NOT EXISTS scorecards (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cycle_id TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 12),
    planned_tasks INTEGER NOT NULL,
    completed_tasks INTEGER NOT NULL,
    execution_score REAL NOT NULL,
    reflection TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, cycle_id, week_number)
);

-- Partners
CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, partner_id)
);

-- Partner Meetings
CREATE TABLE IF NOT EXISTS partner_meetings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    cycle_id TEXT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    meeting_date TEXT,
    commitments TEXT,
    review_notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Device Tokens (for push notifications)
CREATE TABLE IF NOT EXISTS device_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- Notification Settings
CREATE TABLE IF NOT EXISTS notification_settings (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    daily_reminder INTEGER DEFAULT 1,
    daily_reminder_time TEXT DEFAULT '09:00',
    weekly_review INTEGER DEFAULT 1,
    weekly_review_day INTEGER DEFAULT 0,
    partner_activity INTEGER DEFAULT 1
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_visions_user ON visions(user_id);
CREATE INDEX IF NOT EXISTS idx_cycles_user ON cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_cycle ON goals(user_id, cycle_id);
CREATE INDEX IF NOT EXISTS idx_tactics_goal ON tactics(goal_id);
CREATE INDEX IF NOT EXISTS idx_weekly_tasks_user_week ON weekly_tasks(user_id, cycle_id, week_number);
CREATE INDEX IF NOT EXISTS idx_scorecards_user_cycle ON scorecards(user_id, cycle_id);
CREATE INDEX IF NOT EXISTS idx_partners_user ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_partner ON partners(partner_id);
CREATE INDEX IF NOT EXISTS idx_meetings_user ON partner_meetings(user_id);
