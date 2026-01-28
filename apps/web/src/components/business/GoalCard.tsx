"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Pencil, MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Goal } from "@/types";

export interface GoalCardProps {
  goal: Goal;
  children?: ReactNode;
  defaultExpanded?: boolean;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
  className?: string;
}

export function GoalCard({
  goal,
  children,
  defaultExpanded = true,
  onEdit,
  onDelete,
  className,
}: GoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getProgressVariant = (progress: number) => {
    if (progress >= 80) return "success";
    if (progress >= 50) return "default";
    return "default";
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={isExpanded ? "收起" : "展開"}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">
                  目標 {goal.order}: {goal.title}
                </h3>
                <Badge variant={goal.progress >= 80 ? "success" : "default"}>
                  {goal.progress}%
                </Badge>
              </div>
              {goal.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {goal.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(goal)}
                aria-label="編輯目標"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(goal)}
                aria-label="更多選項"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <Progress
          value={goal.progress}
          variant={getProgressVariant(goal.progress)}
          className="mt-4"
        />
      </div>

      {/* Content */}
      {isExpanded && children && (
        <div className="border-t border-border px-4 py-4 sm:px-6">
          {children}
        </div>
      )}
    </div>
  );
}
