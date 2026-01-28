import { http, HttpResponse, delay } from "msw";
import {
  mockUser,
  mockVisions,
  mockCycle,
  mockGoals,
  mockTactics,
  mockWeeklyTasks,
  mockWeeklyScores,
  mockPartners,
  mockMeetings,
  mockUserSettings,
} from "./data";

const API_BASE = "/api/v1";

export const handlers = [
  // ============================================
  // Auth endpoints
  // ============================================
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === "user@example.com" && body.password === "password") {
      return HttpResponse.json({
        user: mockUser,
        token: "mock-jwt-token",
      });
    }

    return HttpResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as {
      name: string;
      email: string;
      password: string;
    };

    return HttpResponse.json({
      user: { ...mockUser, name: body.name, email: body.email },
      token: "mock-jwt-token",
    });
  }),

  http.post(`${API_BASE}/auth/logout`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // User endpoints
  // ============================================
  http.get(`${API_BASE}/users/me`, async () => {
    await delay(300);
    return HttpResponse.json(mockUser);
  }),

  http.patch(`${API_BASE}/users/me`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<typeof mockUser>;
    return HttpResponse.json({ ...mockUser, ...body });
  }),

  http.get(`${API_BASE}/users/me/settings`, async () => {
    await delay(200);
    return HttpResponse.json(mockUserSettings);
  }),

  http.patch(`${API_BASE}/users/me/settings`, async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Partial<typeof mockUserSettings>;
    return HttpResponse.json({ ...mockUserSettings, ...body });
  }),

  // ============================================
  // Vision endpoints
  // ============================================
  http.get(`${API_BASE}/vision`, async () => {
    await delay(300);
    return HttpResponse.json(mockVisions);
  }),

  http.get(`${API_BASE}/vision/:id`, async ({ params }) => {
    await delay(200);
    const vision = mockVisions.find((v) => v.id === params.id);
    if (!vision) {
      return HttpResponse.json({ error: "Vision not found" }, { status: 404 });
    }
    return HttpResponse.json(vision);
  }),

  http.put(`${API_BASE}/vision/:id`, async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as { content: string };
    const vision = mockVisions.find((v) => v.id === params.id);
    if (!vision) {
      return HttpResponse.json({ error: "Vision not found" }, { status: 404 });
    }
    return HttpResponse.json({
      ...vision,
      content: body.content,
      updatedAt: new Date().toISOString(),
    });
  }),

  // ============================================
  // Cycle endpoints
  // ============================================
  http.get(`${API_BASE}/cycles/current`, async () => {
    await delay(200);
    return HttpResponse.json(mockCycle);
  }),

  http.get(`${API_BASE}/cycles/:id`, async ({ params }) => {
    await delay(200);
    if (params.id === mockCycle.id) {
      return HttpResponse.json(mockCycle);
    }
    return HttpResponse.json({ error: "Cycle not found" }, { status: 404 });
  }),

  // ============================================
  // Goals endpoints
  // ============================================
  http.get(`${API_BASE}/goals`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const cycleId = url.searchParams.get("cycleId");

    let goals = mockGoals;
    if (cycleId) {
      goals = mockGoals.filter((g) => g.cycleId === cycleId);
    }

    return HttpResponse.json(goals);
  }),

  http.get(`${API_BASE}/goals/:id`, async ({ params }) => {
    await delay(200);
    const goal = mockGoals.find((g) => g.id === params.id);
    if (!goal) {
      return HttpResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    return HttpResponse.json(goal);
  }),

  http.post(`${API_BASE}/goals`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as {
      title: string;
      description?: string;
      cycleId: string;
    };

    const newGoal = {
      id: `goal-${Date.now()}`,
      cycleId: body.cycleId,
      title: body.title,
      description: body.description,
      progress: 0,
      order: mockGoals.length + 1,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(newGoal, { status: 201 });
  }),

  http.patch(`${API_BASE}/goals/:id`, async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<(typeof mockGoals)[0]>;
    const goal = mockGoals.find((g) => g.id === params.id);
    if (!goal) {
      return HttpResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    return HttpResponse.json({ ...goal, ...body });
  }),

  http.delete(`${API_BASE}/goals/:id`, async ({ params }) => {
    await delay(200);
    const goal = mockGoals.find((g) => g.id === params.id);
    if (!goal) {
      return HttpResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // Tactics endpoints
  // ============================================
  http.get(`${API_BASE}/tactics`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const goalId = url.searchParams.get("goalId");

    let tactics = mockTactics;
    if (goalId) {
      tactics = mockTactics.filter((t) => t.goalId === goalId);
    }

    return HttpResponse.json(tactics);
  }),

  http.post(`${API_BASE}/tactics`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as {
      goalId: string;
      title: string;
      frequency: string;
      frequencyCount?: number;
    };

    const newTactic = {
      id: `tactic-${Date.now()}`,
      goalId: body.goalId,
      title: body.title,
      frequency: body.frequency,
      frequencyCount: body.frequencyCount,
      progress: 0,
      order: mockTactics.filter((t) => t.goalId === body.goalId).length + 1,
    };

    return HttpResponse.json(newTactic, { status: 201 });
  }),

  http.patch(`${API_BASE}/tactics/:id`, async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<(typeof mockTactics)[0]>;
    const tactic = mockTactics.find((t) => t.id === params.id);
    if (!tactic) {
      return HttpResponse.json({ error: "Tactic not found" }, { status: 404 });
    }
    return HttpResponse.json({ ...tactic, ...body });
  }),

  http.delete(`${API_BASE}/tactics/:id`, async ({ params }) => {
    await delay(200);
    const tactic = mockTactics.find((t) => t.id === params.id);
    if (!tactic) {
      return HttpResponse.json({ error: "Tactic not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // Weekly Tasks endpoints
  // ============================================
  http.get(`${API_BASE}/weekly/tasks`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const weekNumber = url.searchParams.get("week");

    let tasks = mockWeeklyTasks;
    if (weekNumber) {
      tasks = mockWeeklyTasks.filter(
        (t) => t.weekNumber === parseInt(weekNumber)
      );
    }

    return HttpResponse.json(tasks);
  }),

  http.post(`${API_BASE}/weekly/tasks`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as {
      tacticId: string;
      goalId: string;
      weekNumber: number;
      title: string;
      dueDate?: string;
    };

    const newTask = {
      id: `task-${Date.now()}`,
      ...body,
      completed: false,
    };

    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.patch(`${API_BASE}/weekly/tasks/:id`, async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as Partial<(typeof mockWeeklyTasks)[0]>;
    const task = mockWeeklyTasks.find((t) => t.id === params.id);
    if (!task) {
      return HttpResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = {
      ...task,
      ...body,
      completedAt: body.completed ? new Date().toISOString() : undefined,
    };

    return HttpResponse.json(updatedTask);
  }),

  http.delete(`${API_BASE}/weekly/tasks/:id`, async ({ params }) => {
    await delay(200);
    const task = mockWeeklyTasks.find((t) => t.id === params.id);
    if (!task) {
      return HttpResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // Scorecard endpoints
  // ============================================
  http.get(`${API_BASE}/scorecard`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const cycleId = url.searchParams.get("cycleId");

    let scores = mockWeeklyScores;
    if (cycleId) {
      scores = mockWeeklyScores.filter((s) => s.cycleId === cycleId);
    }

    return HttpResponse.json(scores);
  }),

  http.get(`${API_BASE}/scorecard/week/:weekNumber`, async ({ params }) => {
    await delay(200);
    const score = mockWeeklyScores.find(
      (s) => s.weekNumber === parseInt(params.weekNumber as string)
    );
    if (!score) {
      return HttpResponse.json({ error: "Score not found" }, { status: 404 });
    }
    return HttpResponse.json(score);
  }),

  // ============================================
  // Partners endpoints
  // ============================================
  http.get(`${API_BASE}/partners`, async () => {
    await delay(300);
    return HttpResponse.json(mockPartners);
  }),

  http.post(`${API_BASE}/partners/invite`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { email: string };

    const newPartner = {
      id: `partner-${Date.now()}`,
      userId: mockUser.id,
      partnerId: `user-${Date.now()}`,
      partnerName: body.email.split("@")[0],
      status: "pending" as const,
    };

    return HttpResponse.json(newPartner, { status: 201 });
  }),

  http.delete(`${API_BASE}/partners/:id`, async ({ params }) => {
    await delay(200);
    const partner = mockPartners.find((p) => p.id === params.id);
    if (!partner) {
      return HttpResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true });
  }),

  // ============================================
  // Meetings endpoints
  // ============================================
  http.get(`${API_BASE}/meetings`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const partnerId = url.searchParams.get("partnerId");

    let meetings = mockMeetings;
    if (partnerId) {
      meetings = mockMeetings.filter((m) => m.partnerId === partnerId);
    }

    return HttpResponse.json(meetings);
  }),

  http.get(`${API_BASE}/meetings/next`, async () => {
    await delay(200);
    const nextMeeting = mockMeetings.find((m) => m.status === "scheduled");
    if (!nextMeeting) {
      return HttpResponse.json(null);
    }
    return HttpResponse.json(nextMeeting);
  }),

  http.post(`${API_BASE}/meetings`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as {
      partnerId: string;
      weekNumber: number;
      scheduledAt: string;
    };

    const newMeeting = {
      id: `meeting-${Date.now()}`,
      ...body,
      status: "scheduled" as const,
    };

    return HttpResponse.json(newMeeting, { status: 201 });
  }),

  http.patch(`${API_BASE}/meetings/:id`, async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<(typeof mockMeetings)[0]>;
    const meeting = mockMeetings.find((m) => m.id === params.id);
    if (!meeting) {
      return HttpResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    return HttpResponse.json({ ...meeting, ...body });
  }),

  // ============================================
  // Dashboard summary endpoint
  // ============================================
  http.get(`${API_BASE}/dashboard/summary`, async () => {
    await delay(400);

    const currentWeekTasks = mockWeeklyTasks.filter(
      (t) => t.weekNumber === mockCycle.currentWeek
    );
    const completedTasks = currentWeekTasks.filter((t) => t.completed);
    const currentScore =
      mockWeeklyScores.find((s) => s.weekNumber === mockCycle.currentWeek)
        ?.score ?? 0;
    const previousScore =
      mockWeeklyScores.find((s) => s.weekNumber === mockCycle.currentWeek - 1)
        ?.score ?? 0;

    return HttpResponse.json({
      cycle: mockCycle,
      currentWeekScore: currentScore,
      previousWeekScore: previousScore,
      scoreTrend: currentScore - previousScore,
      tasksCompleted: completedTasks.length,
      tasksTotal: currentWeekTasks.length,
      goalsProgress: mockGoals.map((g) => ({
        id: g.id,
        title: g.title,
        progress: g.progress,
      })),
      upcomingTasks: currentWeekTasks
        .filter((t) => !t.completed)
        .slice(0, 5),
      weeklyScores: mockWeeklyScores,
    });
  }),
];
