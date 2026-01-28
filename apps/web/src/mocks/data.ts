import type {
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
  UserSettings,
} from "@/types";

// Mock User
export const mockUser: User = {
  id: "user-001",
  name: "王小明",
  email: "user@example.com",
  avatar: "/avatars/default.png",
  timezone: "Asia/Taipei",
  createdAt: "2024-01-01T00:00:00Z",
};

// Mock Visions
export const mockVisions: Vision[] = [
  {
    id: "vision-001",
    userId: "user-001",
    type: "3-year",
    content:
      "成為一位具有影響力的產品設計師，帶領團隊打造出改變人們生活的產品。",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "vision-002",
    userId: "user-001",
    type: "10-year",
    content:
      "創立自己的設計工作室，培養下一代設計人才，並為社會創造正面價值。",
    updatedAt: "2024-01-15T10:00:00Z",
  },
];

// Mock Cycle
export const mockCycle: Cycle = {
  id: "cycle-001",
  userId: "user-001",
  name: "2024 Q1",
  startDate: "2024-01-01",
  endDate: "2024-03-24",
  status: "active",
  currentWeek: 5,
};

// Mock Goals
export const mockGoals: Goal[] = [
  {
    id: "goal-001",
    cycleId: "cycle-001",
    title: "完成產品 MVP",
    description: "開發並上線 12 Week Year App 的 MVP 版本",
    progress: 75,
    order: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "goal-002",
    cycleId: "cycle-001",
    title: "建立健康習慣",
    description: "培養規律運動和閱讀的習慣",
    progress: 60,
    order: 2,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "goal-003",
    cycleId: "cycle-001",
    title: "學習新技能",
    description: "完成 React Native 課程學習",
    progress: 90,
    order: 3,
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// Mock Tactics
export const mockTactics: Tactic[] = [
  {
    id: "tactic-001",
    goalId: "goal-001",
    title: "完成核心功能開發",
    frequency: "weekly",
    progress: 100,
    order: 1,
  },
  {
    id: "tactic-002",
    goalId: "goal-001",
    title: "撰寫技術文件",
    frequency: "weekly",
    progress: 50,
    order: 2,
  },
  {
    id: "tactic-003",
    goalId: "goal-001",
    title: "進行用戶測試",
    frequency: "specific",
    frequencyCount: 2,
    progress: 60,
    order: 3,
  },
  {
    id: "tactic-004",
    goalId: "goal-002",
    title: "每日運動 30 分鐘",
    frequency: "daily",
    progress: 80,
    order: 1,
  },
  {
    id: "tactic-005",
    goalId: "goal-002",
    title: "閱讀書籍 20 頁",
    frequency: "daily",
    progress: 40,
    order: 2,
  },
  {
    id: "tactic-006",
    goalId: "goal-003",
    title: "完成課程單元",
    frequency: "weekly",
    progress: 90,
    order: 1,
  },
  {
    id: "tactic-007",
    goalId: "goal-003",
    title: "實作練習專案",
    frequency: "weekly",
    progress: 85,
    order: 2,
  },
];

// Mock Weekly Tasks
export const mockWeeklyTasks: WeeklyTask[] = [
  {
    id: "task-001",
    tacticId: "tactic-001",
    goalId: "goal-001",
    weekNumber: 5,
    title: "完成登入功能",
    dueDate: "2024-01-29",
    completed: true,
    completedAt: "2024-01-29T15:30:00Z",
  },
  {
    id: "task-002",
    tacticId: "tactic-001",
    goalId: "goal-001",
    weekNumber: 5,
    title: "完成註冊功能",
    dueDate: "2024-01-30",
    completed: false,
  },
  {
    id: "task-003",
    tacticId: "tactic-002",
    goalId: "goal-001",
    weekNumber: 5,
    title: "撰寫 API 文件",
    dueDate: "2024-01-31",
    completed: true,
    completedAt: "2024-01-31T10:00:00Z",
  },
  {
    id: "task-004",
    tacticId: "tactic-004",
    goalId: "goal-002",
    weekNumber: 5,
    title: "運動 30 分鐘",
    completed: true,
    completedAt: "2024-01-29T08:00:00Z",
  },
  {
    id: "task-005",
    tacticId: "tactic-005",
    goalId: "goal-002",
    weekNumber: 5,
    title: "閱讀 20 頁",
    completed: false,
  },
  {
    id: "task-006",
    tacticId: "tactic-006",
    goalId: "goal-003",
    weekNumber: 5,
    title: "完成第五單元學習",
    dueDate: "2024-02-01",
    completed: true,
    completedAt: "2024-01-30T20:00:00Z",
  },
  {
    id: "task-007",
    tacticId: "tactic-007",
    goalId: "goal-003",
    weekNumber: 5,
    title: "完成 Todo App 練習",
    dueDate: "2024-02-02",
    completed: false,
  },
];

// Mock Weekly Scores
export const mockWeeklyScores: WeeklyScore[] = [
  {
    id: "score-001",
    cycleId: "cycle-001",
    weekNumber: 1,
    plannedTasks: 14,
    completedTasks: 11,
    score: 78,
    startDate: "2024-01-01",
    endDate: "2024-01-07",
  },
  {
    id: "score-002",
    cycleId: "cycle-001",
    weekNumber: 2,
    plannedTasks: 15,
    completedTasks: 12,
    score: 82,
    startDate: "2024-01-08",
    endDate: "2024-01-14",
  },
  {
    id: "score-003",
    cycleId: "cycle-001",
    weekNumber: 3,
    plannedTasks: 15,
    completedTasks: 12,
    score: 80,
    startDate: "2024-01-15",
    endDate: "2024-01-21",
  },
  {
    id: "score-004",
    cycleId: "cycle-001",
    weekNumber: 4,
    plannedTasks: 15,
    completedTasks: 12,
    score: 80,
    startDate: "2024-01-22",
    endDate: "2024-01-28",
  },
  {
    id: "score-005",
    cycleId: "cycle-001",
    weekNumber: 5,
    plannedTasks: 15,
    completedTasks: 12,
    score: 85,
    startDate: "2024-01-29",
    endDate: "2024-02-04",
  },
];

// Mock Partners
export const mockPartners: Partner[] = [
  {
    id: "partner-001",
    userId: "user-001",
    partnerId: "user-002",
    partnerName: "李小華",
    status: "active",
    weeklyScore: 88,
  },
  {
    id: "partner-002",
    userId: "user-001",
    partnerId: "user-003",
    partnerName: "張小芳",
    status: "active",
    weeklyScore: 75,
  },
];

// Mock Meetings
export const mockMeetings: Meeting[] = [
  {
    id: "meeting-001",
    partnerId: "partner-001",
    weekNumber: 5,
    scheduledAt: "2024-01-28T19:00:00Z",
    status: "scheduled",
  },
  {
    id: "meeting-002",
    partnerId: "partner-001",
    weekNumber: 4,
    scheduledAt: "2024-01-21T19:00:00Z",
    status: "completed",
    notes: "討論了本週的執行狀況，確認下週目標。",
    commitments: ["完成登入功能", "每日運動30分鐘"],
  },
  {
    id: "meeting-003",
    partnerId: "partner-001",
    weekNumber: 3,
    scheduledAt: "2024-01-14T19:00:00Z",
    status: "completed",
    notes: "回顧第三週進度，調整戰術執行方式。",
    commitments: ["完成 UI 設計稿", "閱讀書籍第三章"],
  },
];

// Mock Dashboard Summary
export const mockDashboardSummary: DashboardSummary = {
  currentWeek: 5,
  totalWeeks: 12,
  weeklyScore: 85,
  weeklyScoreChange: 5,
  goalsCompleted: 2,
  totalGoals: 3,
  tasksCompleted: 12,
  totalTasks: 15,
};

// Mock Time Blocks
export const mockTimeBlocks: TimeBlock[] = [
  {
    id: "block-001",
    type: "strategic",
    title: "核心功能開發",
    description: "專注完成登入與註冊功能",
    date: "2024-01-29",
    startTime: "09:00",
    endTime: "12:00",
  },
  {
    id: "block-002",
    type: "buffer",
    title: "郵件與行政事務",
    date: "2024-01-29",
    startTime: "14:00",
    endTime: "15:00",
  },
  {
    id: "block-003",
    type: "breakout",
    title: "學習與規劃",
    description: "React Native 課程學習",
    date: "2024-01-29",
    startTime: "16:00",
    endTime: "19:00",
  },
  {
    id: "block-004",
    type: "strategic",
    title: "技術文件撰寫",
    date: "2024-01-30",
    startTime: "09:00",
    endTime: "12:00",
  },
];

// Mock User Settings
export const mockUserSettings: UserSettings = {
  userId: "user-001",
  theme: "light",
  language: "zh-TW",
  notifications: {
    dailyReminder: true,
    dailyReminderTime: "09:00",
    weeklyReport: true,
    weeklyReportDay: "Sunday",
    wamReminder: true,
    wamReminderTime: "1hour",
    goalDeadline: true,
  },
};

// Helper functions to get related data
export function getGoalById(goalId: string): Goal | undefined {
  return mockGoals.find((goal) => goal.id === goalId);
}

export function getTacticsByGoalId(goalId: string): Tactic[] {
  return mockTactics.filter((tactic) => tactic.goalId === goalId);
}

export function getTasksByGoalId(goalId: string): WeeklyTask[] {
  return mockWeeklyTasks.filter((task) => task.goalId === goalId);
}

export function getTasksByWeekNumber(weekNumber: number): WeeklyTask[] {
  return mockWeeklyTasks.filter((task) => task.weekNumber === weekNumber);
}

export function getUpcomingTasks(): WeeklyTask[] {
  return mockWeeklyTasks.filter((task) => !task.completed).slice(0, 5);
}

export function getMeetingsByPartnerId(partnerId: string): Meeting[] {
  return mockMeetings.filter((meeting) => meeting.partnerId === partnerId);
}

export function getPartnerById(partnerId: string): Partner | undefined {
  return mockPartners.find((partner) => partner.id === partnerId);
}
