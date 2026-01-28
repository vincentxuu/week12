// User
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  timezone: string;
  createdAt: string;
}

// Vision
export interface Vision {
  id: string;
  userId: string;
  type: "3-year" | "10-year";
  content: string;
  updatedAt: string;
}

// 12-Week Cycle
export interface Cycle {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming";
  currentWeek: number;
}

// Goal
export interface Goal {
  id: string;
  cycleId: string;
  title: string;
  description?: string;
  progress: number; // 0-100
  order: number;
  createdAt: string;
}

// Tactic
export interface Tactic {
  id: string;
  goalId: string;
  title: string;
  frequency: "daily" | "weekly" | "specific";
  frequencyCount?: number; // for "specific" frequency
  progress: number;
  order: number;
}

// Weekly Task
export interface WeeklyTask {
  id: string;
  tacticId: string;
  goalId: string;
  weekNumber: number;
  title: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
}

// Weekly Score
export interface WeeklyScore {
  id: string;
  cycleId: string;
  weekNumber: number;
  plannedTasks: number;
  completedTasks: number;
  score: number; // (completedTasks / plannedTasks) * 100
  startDate: string;
  endDate: string;
}

// Partner
export interface Partner {
  id: string;
  userId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  status: "active" | "pending" | "declined";
  weeklyScore?: number;
}

// Meeting
export interface Meeting {
  id: string;
  partnerId: string;
  weekNumber: number;
  scheduledAt: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  commitments?: string[];
}

// Dashboard Summary
export interface DashboardSummary {
  currentWeek: number;
  totalWeeks: number;
  weeklyScore: number;
  weeklyScoreChange: number;
  goalsCompleted: number;
  totalGoals: number;
  tasksCompleted: number;
  totalTasks: number;
}

// Time Block
export interface TimeBlock {
  id: string;
  type: "strategic" | "buffer" | "breakout";
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
}

// Notification Settings
export interface NotificationSettings {
  dailyReminder: boolean;
  dailyReminderTime: string;
  weeklyReport: boolean;
  weeklyReportDay: string;
  wamReminder: boolean;
  wamReminderTime: string;
  goalDeadline: boolean;
}

// User Settings
export interface UserSettings {
  userId: string;
  theme: "light" | "dark" | "system";
  language: "zh-TW" | "en";
  notifications: NotificationSettings;
}
