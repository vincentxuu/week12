"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";

export interface TrendChartData {
  week: number;
  score: number;
  label?: string;
}

export interface TrendChartProps {
  data: TrendChartData[];
  targetScore?: number;
  currentWeek?: number;
  height?: number;
  showGrid?: boolean;
  className?: string;
}

export function TrendChart({
  data,
  targetScore = 85,
  currentWeek,
  height = 200,
  showGrid = true,
  className,
}: TrendChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    name: item.label || `W${item.week}`,
  }));

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
          )}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "var(--foreground)", fontWeight: 500 }}
            formatter={(value) => [`${value}%`, "執行分數"]}
          />
          {targetScore && (
            <ReferenceLine
              y={targetScore}
              stroke="var(--success)"
              strokeDasharray="5 5"
              label={{
                value: `目標 ${targetScore}%`,
                fill: "var(--success)",
                fontSize: 11,
                position: "right",
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--primary-base)"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;
              const isCurrentWeek = currentWeek && payload.week === currentWeek;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isCurrentWeek ? 6 : 4}
                  fill={isCurrentWeek ? "var(--primary-base)" : "var(--card)"}
                  stroke="var(--primary-base)"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{
              r: 6,
              fill: "var(--primary-base)",
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface BarChartData {
  week: number;
  score: number;
  label?: string;
}

export interface WeeklyScoreBarProps {
  data: BarChartData[];
  currentWeek?: number;
  className?: string;
}

export function WeeklyScoreBar({
  data,
  currentWeek,
  className,
}: WeeklyScoreBarProps) {
  const getBarColor = (score: number) => {
    if (score >= 85) return "bg-success";
    if (score >= 70) return "bg-primary-base";
    if (score >= 50) return "bg-tips";
    return "bg-destructive";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {data.map((item) => {
        const isCurrentWeek = currentWeek === item.week;
        return (
          <div key={item.week} className="flex items-center gap-3">
            <span
              className={cn(
                "w-20 text-sm",
                isCurrentWeek ? "font-medium" : "text-muted-foreground"
              )}
            >
              Week {item.week}
              {isCurrentWeek && " (本週)"}
            </span>
            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  getBarColor(item.score)
                )}
                style={{ width: `${item.score}%` }}
              />
            </div>
            <span
              className={cn(
                "w-12 text-right text-sm",
                isCurrentWeek ? "font-medium" : "text-muted-foreground"
              )}
            >
              {item.score}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
