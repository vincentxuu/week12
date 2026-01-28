import { Container } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Badge,
  Button,
} from "@/components/ui";
import {
  mockDashboardSummary,
  mockGoals,
  mockWeeklyScores,
  getUpcomingTasks,
} from "@/mocks";
import {
  TrendingUp,
  Target,
  CheckSquare,
  Plus,
  Calendar,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const summary = mockDashboardSummary;
  const upcomingTasks = getUpcomingTasks();
  const weeklyScores = mockWeeklyScores;

  return (
    <Container className="py-8">
      {/* Welcome Banner */}
      <Card className="mb-8 bg-gradient-primary-palest border-none">
        <CardContent className="py-6">
          <h1 className="heading-lg text-foreground">
            Week {summary.currentWeek} of {summary.totalWeeks}
          </h1>
          <p className="body-md text-muted-foreground mt-1">
            你正在往目標前進！繼續保持這個動力。
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {/* Execution Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              執行分數
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.weeklyScore}%</div>
            <div className="flex items-center gap-1 text-sm text-success mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {summary.weeklyScoreChange}%</span>
            </div>
            <Progress
              value={summary.weeklyScore}
              className="mt-3"
              variant="success"
            />
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              目標進度
            </CardTitle>
            <Target className="h-4 w-4 text-primary-base" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {summary.goalsCompleted}/{summary.totalGoals}
            </div>
            <p className="text-sm text-muted-foreground mt-1">目標完成</p>
            <div className="flex gap-1 mt-3">
              {mockGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex-1 h-2 rounded-full bg-muted overflow-hidden"
                >
                  <div
                    className="h-full bg-primary-base"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              本週任務
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-primary-base" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {summary.tasksCompleted}/{summary.totalTasks}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              待完成: {summary.totalTasks - summary.tasksCompleted}
            </p>
            <Progress
              value={(summary.tasksCompleted / summary.totalTasks) * 100}
              className="mt-3"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Trend Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>12 週趨勢圖</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-40 gap-2">
              {weeklyScores.map((score) => (
                <div key={score.id} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full">
                    <div
                      className="w-full bg-primary-lighter rounded-t transition-all hover:bg-primary-base"
                      style={{ height: `${score.score * 1.2}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    W{score.weekNumber}
                  </span>
                  <span className="text-xs font-medium">{score.score}%</span>
                </div>
              ))}
              {/* Placeholder for remaining weeks */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={`empty-${i}`} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full">
                    <div className="w-full bg-muted h-4 rounded-t" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    W{weeklyScores.length + i + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">-</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary-lighter" />
                <span>已完成週次</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-muted" />
                <span>未來週次</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>即將到期任務</CardTitle>
            <Link href="/weekly">
              <Button variant="ghost" size="sm">
                查看全部
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    className="h-4 w-4 rounded border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-muted-foreground">
                        {task.dueDate}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/weekly">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新增任務
              </Button>
            </Link>
            <Link href="/weekly">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                查看週計劃
              </Button>
            </Link>
            <Link href="/partners">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                夥伴週會
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
