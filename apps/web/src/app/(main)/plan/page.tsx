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
  Modal,
  Input,
  Textarea,
} from "@/components/ui";
import { mockCycle, mockGoals, getTacticsByGoalId } from "@/mocks";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Settings,
  Check,
} from "lucide-react";

export default function PlanPage() {
  const [expandedGoals, setExpandedGoals] = useState<string[]>(
    mockGoals.map((g) => g.id)
  );
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isAddingTactic, setIsAddingTactic] = useState<string | null>(null);

  const toggleGoal = (goalId: string) => {
    setExpandedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const getFrequencyLabel = (frequency: string, count?: number) => {
    switch (frequency) {
      case "daily":
        return "每日";
      case "weekly":
        return "每週";
      case "specific":
        return `每週${count}次`;
      default:
        return frequency;
    }
  };

  return (
    <Container className="py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-lg">12 週計劃</h1>
          <p className="body-md text-muted-foreground mt-1">
            {mockCycle.name} - 第 {mockCycle.currentWeek}/12 週
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            週期設定
          </Button>
          <Button size="sm" onClick={() => setIsAddingGoal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新增目標
          </Button>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {mockGoals.map((goal) => {
          const tactics = getTacticsByGoalId(goal.id);
          const isExpanded = expandedGoals.includes(goal.id);

          return (
            <Card key={goal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleGoal(goal.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                      <div>
                        <CardTitle className="text-lg">
                          目標 {goal.order}: {goal.title}
                        </CardTitle>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={goal.progress >= 80 ? "success" : "default"}>
                      {goal.progress}%
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={goal.progress} className="mt-3" />
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        戰術列表
                      </h4>
                    </div>

                    <ul className="space-y-2">
                      {tactics.map((tactic) => (
                        <li
                          key={tactic.id}
                          className="flex items-center gap-3 rounded-lg border border-border p-3"
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded border ${
                              tactic.progress === 100
                                ? "border-success bg-success text-white"
                                : "border-border"
                            }`}
                          >
                            {tactic.progress === 100 && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                tactic.progress === 100
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {tactic.title}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {getFrequencyLabel(
                              tactic.frequency,
                              tactic.frequencyCount
                            )}
                          </Badge>
                          <div className="flex items-center gap-2 w-24">
                            <Progress
                              value={tactic.progress}
                              size="sm"
                              variant={
                                tactic.progress >= 80 ? "success" : "default"
                              }
                            />
                            <span className="text-xs text-muted-foreground w-8">
                              {tactic.progress}%
                            </span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => setIsAddingTactic(goal.id)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      新增戰術
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {/* Add Goal Button */}
        {mockGoals.length < 3 && (
          <Card className="border-dashed">
            <CardContent className="py-8">
              <Button
                variant="ghost"
                className="w-full h-auto py-4"
                onClick={() => setIsAddingGoal(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                新增目標（最多 3 個目標）
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddingGoal}
        onClose={() => setIsAddingGoal(false)}
        title="新增目標"
        description="設定你的 12 週目標"
      >
        <div className="space-y-4">
          <Input label="目標名稱" placeholder="例如：完成產品 MVP" />
          <Textarea
            label="目標描述（選填）"
            placeholder="描述這個目標的具體內容..."
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
              取消
            </Button>
            <Button onClick={() => setIsAddingGoal(false)}>新增</Button>
          </div>
        </div>
      </Modal>

      {/* Add Tactic Modal */}
      <Modal
        isOpen={!!isAddingTactic}
        onClose={() => setIsAddingTactic(null)}
        title="新增戰術"
        description="設定達成目標的具體行動"
      >
        <div className="space-y-4">
          <Input label="戰術名稱" placeholder="例如：每日運動 30 分鐘" />
          <div>
            <label className="text-sm font-medium">執行頻率</label>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm">
                每日
              </Button>
              <Button variant="outline" size="sm">
                每週
              </Button>
              <Button variant="outline" size="sm">
                自訂
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddingTactic(null)}>
              取消
            </Button>
            <Button onClick={() => setIsAddingTactic(null)}>新增</Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
