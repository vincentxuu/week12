"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface WeekSelectorProps {
  currentWeek: number;
  totalWeeks?: number;
  startDate?: string;
  endDate?: string;
  score?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onChange?: (week: number) => void;
  className?: string;
}

export function WeekSelector({
  currentWeek,
  totalWeeks = 12,
  startDate,
  endDate,
  score,
  onPrevious,
  onNext,
  onChange,
  className,
}: WeekSelectorProps) {
  const formatDateRange = () => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString("zh-TW", {
      month: "numeric",
      day: "numeric",
    })} - ${end.toLocaleDateString("zh-TW", {
      month: "numeric",
      day: "numeric",
    })}`;
  };

  const canGoPrevious = currentWeek > 1;
  const canGoNext = currentWeek < totalWeeks;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          aria-label="上一週"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="text-center min-w-[160px]">
          <h2 className="font-semibold">Week {currentWeek}</h2>
          {(startDate || endDate) && (
            <p className="text-sm text-muted-foreground">{formatDateRange()}</p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="下一週"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {score !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">執行分數:</span>
          <Badge variant={score >= 85 ? "success" : "default"} size="lg">
            {score}%
          </Badge>
        </div>
      )}
    </div>
  );
}

export interface WeekTabsProps {
  currentWeek: number;
  totalWeeks?: number;
  onChange: (week: number) => void;
  className?: string;
}

export function WeekTabs({
  currentWeek,
  totalWeeks = 12,
  onChange,
  className,
}: WeekTabsProps) {
  return (
    <div className={cn("flex gap-1 overflow-x-auto pb-2", className)}>
      {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
        <button
          key={week}
          onClick={() => onChange(week)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
            week === currentWeek
              ? "bg-primary-base text-white"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {week}
        </button>
      ))}
    </div>
  );
}
