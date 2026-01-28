import { Container } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Badge,
} from "@/components/ui";
import { mockCycle, mockWeeklyScores, mockGoals } from "@/mocks";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";

export default function ScorecardPage() {
  const currentWeekScore = mockWeeklyScores[mockWeeklyScores.length - 1];
  const previousWeekScore = mockWeeklyScores[mockWeeklyScores.length - 2];
  const scoreChange = currentWeekScore
    ? currentWeekScore.score - (previousWeekScore?.score || 0)
    : 0;

  const averageScore =
    mockWeeklyScores.reduce((sum, s) => sum + s.score, 0) /
    mockWeeklyScores.length;

  const goalsCompleted = mockGoals.filter((g) => g.progress >= 100).length;

  const getScoreVariant = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "destructive";
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Container className="py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-lg">執行計分卡</h1>
          <p className="body-md text-muted-foreground mt-1">
            週期: {mockCycle.name} ({mockCycle.startDate} - {mockCycle.endDate})
          </p>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {/* Overall Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              總體執行分數
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{Math.round(averageScore)}%</div>
              <div className="flex-1">
                <Progress
                  value={averageScore}
                  variant={getScoreVariant(averageScore)}
                  size="lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Week Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              本週分數
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">
                {currentWeekScore?.score || 0}%
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(scoreChange)}
                <span
                  className={`text-sm font-medium ${
                    scoreChange > 0
                      ? "text-success"
                      : scoreChange < 0
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {scoreChange > 0 ? "+" : ""}
                  {scoreChange}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Achievement */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              目標達成率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">
                {Math.round((goalsCompleted / mockGoals.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {goalsCompleted}/{mockGoals.length} 完成
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 12 Week Trend Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>12 週趨勢圖</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-64">
            {/* Goal Line */}
            <div
              className="absolute w-full border-t-2 border-dashed border-primary-base"
              style={{ top: "15%" }}
            >
              <span className="absolute right-0 -top-6 text-xs text-primary-base">
                目標線 (85%)
              </span>
            </div>

            {/* Bars */}
            <div className="flex items-end justify-between h-full gap-2 pt-8">
              {mockWeeklyScores.map((score, index) => (
                <div
                  key={score.id}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="relative w-full flex flex-col items-center">
                    <span className="text-xs font-medium mb-1">
                      {score.score}%
                    </span>
                    <div
                      className={`w-full rounded-t transition-all ${
                        score.weekNumber === mockCycle.currentWeek
                          ? "bg-primary-base"
                          : "bg-primary-lighter"
                      }`}
                      style={{ height: `${score.score * 1.8}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    W{score.weekNumber}
                  </span>
                </div>
              ))}
              {/* Empty weeks */}
              {Array.from({ length: 12 - mockWeeklyScores.length }).map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="relative w-full flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">-</span>
                      <div className="w-full bg-muted h-8 rounded-t" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      W{mockWeeklyScores.length + i + 1}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Detail & Goal Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Detail Scores */}
        <Card>
          <CardHeader>
            <CardTitle>週別詳細分數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...mockWeeklyScores].reverse().map((score) => {
                const prevScore = mockWeeklyScores.find(
                  (s) => s.weekNumber === score.weekNumber - 1
                );
                const change = prevScore ? score.score - prevScore.score : 0;

                return (
                  <div
                    key={score.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-3"
                  >
                    <div className="flex-shrink-0">
                      <Badge
                        variant={
                          score.weekNumber === mockCycle.currentWeek
                            ? "default"
                            : "outline"
                        }
                      >
                        Week {score.weekNumber}
                        {score.weekNumber === mockCycle.currentWeek && " (本週)"}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={score.score}
                        variant={getScoreVariant(score.score)}
                      />
                    </div>
                    <div className="flex items-center gap-2 w-20 justify-end">
                      <span className="font-medium">{score.score}%</span>
                      {change !== 0 && (
                        <span
                          className={`text-xs ${
                            change > 0 ? "text-success" : "text-destructive"
                          }`}
                        >
                          {change > 0 ? "↑" : "↓"}
                          {Math.abs(change)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Goal Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              目標別分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      目標 {goal.order}: {goal.title}
                    </span>
                    <span className="text-sm font-medium">{goal.progress}%</span>
                  </div>
                  <Progress
                    value={goal.progress}
                    variant={getScoreVariant(goal.progress)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
