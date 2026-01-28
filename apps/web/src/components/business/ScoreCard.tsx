"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface ScoreCardProps {
  title: string;
  score: number;
  previousScore?: number;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  showTrend?: boolean;
  className?: string;
}

export function ScoreCard({
  title,
  score,
  previousScore,
  subtitle,
  size = "md",
  showTrend = true,
  className,
}: ScoreCardProps) {
  const trend = previousScore !== undefined ? score - previousScore : 0;
  const trendDirection = trend > 0 ? "up" : trend < 0 ? "down" : "neutral";

  const sizeClasses = {
    sm: {
      container: "p-4",
      title: "text-sm",
      score: "text-2xl",
      trend: "text-xs",
    },
    md: {
      container: "p-6",
      title: "text-sm",
      score: "text-4xl",
      trend: "text-sm",
    },
    lg: {
      container: "p-8",
      title: "text-base",
      score: "text-5xl",
      trend: "text-base",
    },
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
      ? TrendingDown
      : Minus;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card",
        sizeClasses[size].container,
        className
      )}
    >
      <p className={cn("font-medium text-muted-foreground", sizeClasses[size].title)}>
        {title}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={cn("font-bold", sizeClasses[size].score)}>{score}%</span>
        {showTrend && previousScore !== undefined && (
          <span
            className={cn(
              "flex items-center gap-1",
              sizeClasses[size].trend,
              trendColors[trendDirection]
            )}
          >
            <TrendIcon className="h-4 w-4" />
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

export interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function CircularScore({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  className,
}: CircularScoreProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (value: number) => {
    if (value >= 85) return "stroke-success";
    if (value >= 70) return "stroke-primary-base";
    if (value >= 50) return "stroke-tips";
    return "stroke-destructive";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-500", getScoreColor(score))}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{score}%</span>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
