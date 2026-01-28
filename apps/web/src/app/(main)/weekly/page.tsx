"use client";

import { useState } from "react";
import { Container } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Progress,
  Badge,
  Checkbox,
} from "@/components/ui";
import {
  mockCycle,
  mockGoals,
  mockWeeklyTasks,
  mockTimeBlocks,
  getTasksByGoalId,
} from "@/mocks";
import { ChevronLeft, ChevronRight, Plus, Calendar } from "lucide-react";

export default function WeeklyPage() {
  const [currentWeek, setCurrentWeek] = useState(mockCycle.currentWeek);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const weekTasks = mockWeeklyTasks.filter(
    (task) => task.weekNumber === currentWeek
  );
  const completedTasks = weekTasks.filter((task) => task.completed).length;
  const totalTasks = weekTasks.length;
  const weekScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const weekStartDate = "1/29";
  const weekEndDate = "2/4";

  const getTimeBlockColor = (type: string) => {
    switch (type) {
      case "strategic":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "buffer":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "breakout":
        return "bg-green-100 border-green-300 text-green-800";
      default:
        return "bg-muted";
    }
  };

  const getTimeBlockLabel = (type: string) => {
    switch (type) {
      case "strategic":
        return "Strategic Block";
      case "buffer":
        return "Buffer Block";
      case "breakout":
        return "Breakout Block";
      default:
        return type;
    }
  };

  return (
    <Container className="py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentWeek((w) => Math.max(1, w - 1))}
            disabled={currentWeek <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="heading-lg">Week {currentWeek}</h1>
            <p className="text-sm text-muted-foreground">
              {weekStartDate} - {weekEndDate}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentWeek((w) => Math.min(12, w + 1))}
            disabled={currentWeek >= 12}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant={weekScore >= 85 ? "success" : weekScore >= 70 ? "warning" : "default"}
            className="text-base px-3 py-1"
          >
            執行分數: {weekScore}%
          </Badge>
          <div className="flex gap-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              列表
            </Button>
            <Button
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              日曆
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Task List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>任務清單</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                新增任務
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockGoals.map((goal) => {
                  const goalTasks = weekTasks.filter(
                    (task) => task.goalId === goal.id
                  );
                  if (goalTasks.length === 0) return null;

                  return (
                    <div key={goal.id}>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                        目標 {goal.order}: {goal.title}
                      </h3>
                      <ul className="space-y-2">
                        {goalTasks.map((task) => (
                          <li
                            key={task.id}
                            className="flex items-center gap-3 rounded-lg border border-border p-3"
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              readOnly
                              className="h-4 w-4 rounded border-border"
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  task.completed
                                    ? "line-through text-muted-foreground"
                                    : ""
                                }`}
                              >
                                {task.title}
                              </p>
                            </div>
                            {task.dueDate && (
                              <Badge variant="outline" className="text-xs">
                                {task.dueDate}
                              </Badge>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Blocks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                時間區塊視圖
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTimeBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`rounded-lg border p-3 ${getTimeBlockColor(
                      block.type
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {getTimeBlockLabel(block.type)}
                      </span>
                      <span className="text-xs">
                        {block.startTime} - {block.endTime}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{block.title}</p>
                    {block.description && (
                      <p className="text-xs mt-1 opacity-80">
                        {block.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Block Legend */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">時間區塊說明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-blue-200" />
                  <span>Strategic Block - 專注執行重要任務 (3小時)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-yellow-200" />
                  <span>Buffer Block - 處理郵件、行政事務 (30-60分鐘)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-green-200" />
                  <span>Breakout Block - 學習、規劃、創意思考 (3小時)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
