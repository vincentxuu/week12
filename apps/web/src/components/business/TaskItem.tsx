"use client";

import { cn } from "@/lib/utils";
import { Check, Calendar } from "lucide-react";
import type { WeeklyTask } from "@/types";

export interface TaskItemProps {
  task: WeeklyTask;
  onToggle?: (task: WeeklyTask) => void;
  onClick?: (task: WeeklyTask) => void;
  showDueDate?: boolean;
  className?: string;
}

export function TaskItem({
  task,
  onToggle,
  onClick,
  showDueDate = true,
  className,
}: TaskItemProps) {
  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border p-3 transition-colors",
        "hover:bg-muted/50",
        onClick && "cursor-pointer",
        className
      )}
      onClick={() => onClick?.(task)}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(task);
        }}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
          task.completed
            ? "border-success bg-success text-white"
            : "border-border hover:border-primary-base"
        )}
        aria-label={task.completed ? "標記為未完成" : "標記為完成"}
      >
        {task.completed && <Check className="h-3 w-3" />}
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </p>
      </div>

      {/* Due Date */}
      {showDueDate && task.dueDate && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs shrink-0",
            isOverdue ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <Calendar className="h-3 w-3" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
      )}
    </div>
  );
}

export interface TaskListProps {
  tasks: WeeklyTask[];
  title?: string;
  onToggle?: (task: WeeklyTask) => void;
  onClick?: (task: WeeklyTask) => void;
  onAdd?: () => void;
  showDueDate?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function TaskList({
  tasks,
  title,
  onToggle,
  onClick,
  onAdd,
  showDueDate = true,
  emptyMessage = "沒有任務",
  className,
}: TaskListProps) {
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className={className}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">{title}</h4>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{tasks.length}
            </span>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskItem
                task={task}
                onToggle={onToggle}
                onClick={onClick}
                showDueDate={showDueDate}
              />
            </li>
          ))}
        </ul>
      )}

      {onAdd && (
        <button
          onClick={onAdd}
          className="mt-3 w-full rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary-base hover:text-foreground transition-colors"
        >
          + 新增任務
        </button>
      )}
    </div>
  );
}
