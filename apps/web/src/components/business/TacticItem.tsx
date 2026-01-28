"use client";

import { cn } from "@/lib/utils";
import { Check, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Tactic } from "@/types";

export interface TacticItemProps {
  tactic: Tactic;
  onEdit?: (tactic: Tactic) => void;
  onToggle?: (tactic: Tactic) => void;
  className?: string;
}

export function TacticItem({
  tactic,
  onEdit,
  onToggle,
  className,
}: TacticItemProps) {
  const isCompleted = tactic.progress === 100;

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
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border p-3 transition-colors",
        "hover:bg-muted/50",
        className
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle?.(tactic)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
          isCompleted
            ? "border-success bg-success text-white"
            : "border-border hover:border-primary-base"
        )}
        aria-label={isCompleted ? "標記為未完成" : "標記為完成"}
      >
        {isCompleted && <Check className="h-3 w-3" />}
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {tactic.title}
        </p>
      </div>

      {/* Frequency Badge */}
      <Badge variant="outline" className="shrink-0">
        {getFrequencyLabel(tactic.frequency, tactic.frequencyCount)}
      </Badge>

      {/* Progress */}
      <div className="flex items-center gap-2 w-24 shrink-0">
        <Progress
          value={tactic.progress}
          size="sm"
          variant={tactic.progress >= 80 ? "success" : "default"}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {tactic.progress}%
        </span>
      </div>

      {/* Edit Button */}
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => onEdit(tactic)}
          aria-label="編輯戰術"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

export interface TacticListProps {
  tactics: Tactic[];
  onEdit?: (tactic: Tactic) => void;
  onToggle?: (tactic: Tactic) => void;
  onAdd?: () => void;
  className?: string;
}

export function TacticList({
  tactics,
  onEdit,
  onToggle,
  onAdd,
  className,
}: TacticListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-muted-foreground">戰術列表</h4>
        {onAdd && (
          <Button variant="ghost" size="sm" onClick={onAdd}>
            + 新增戰術
          </Button>
        )}
      </div>
      {tactics.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          尚未設定戰術
        </p>
      ) : (
        <ul className="space-y-2">
          {tactics.map((tactic) => (
            <li key={tactic.id}>
              <TacticItem
                tactic={tactic}
                onEdit={onEdit}
                onToggle={onToggle}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
