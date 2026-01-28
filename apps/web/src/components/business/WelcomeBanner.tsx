"use client";

import { cn } from "@/lib/utils";

export interface WelcomeBannerProps {
  currentWeek: number;
  totalWeeks?: number;
  message?: string;
  className?: string;
}

export function WelcomeBanner({
  currentWeek,
  totalWeeks = 12,
  message,
  className,
}: WelcomeBannerProps) {
  const defaultMessage = getDefaultMessage(currentWeek, totalWeeks);

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-r from-primary-lightest to-primary-pale p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="heading-md text-primary-darker">
            Week {currentWeek} of {totalWeeks}
          </h2>
          <p className="body-md text-primary-darker/80 mt-1">
            {message || defaultMessage}
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-base text-white">
            <span className="text-2xl font-bold">{currentWeek}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultMessage(currentWeek: number, totalWeeks: number): string {
  const progress = currentWeek / totalWeeks;

  if (progress <= 0.25) {
    return "你正在建立新的執行習慣，保持專注！";
  } else if (progress <= 0.5) {
    return "你正在往目標前進，繼續保持！";
  } else if (progress <= 0.75) {
    return "已經過了一半，衝刺到終點吧！";
  } else if (progress < 1) {
    return "最後衝刺！勝利就在眼前！";
  } else {
    return "恭喜完成 12 週！準備好迎接新的週期了嗎？";
  }
}
