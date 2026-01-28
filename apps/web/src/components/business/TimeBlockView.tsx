"use client";

import { cn } from "@/lib/utils";

export type TimeBlockType = "strategic" | "buffer" | "breakout";

export interface TimeBlock {
  id: string;
  type: TimeBlockType;
  title?: string;
  startTime: string;
  endTime: string;
  day: number; // 0-6 (Sunday-Saturday)
}

export interface TimeBlockViewProps {
  blocks: TimeBlock[];
  startDate?: string;
  view?: "day" | "week";
  onBlockClick?: (block: TimeBlock) => void;
  className?: string;
}

const blockColors: Record<TimeBlockType, string> = {
  strategic: "bg-blue-100 border-blue-300 text-blue-800",
  buffer: "bg-yellow-100 border-yellow-300 text-yellow-800",
  breakout: "bg-green-100 border-green-300 text-green-800",
};

const blockLabels: Record<TimeBlockType, string> = {
  strategic: "Strategic Block",
  buffer: "Buffer Block",
  breakout: "Breakout Block",
};

const days = ["日", "一", "二", "三", "四", "五", "六"];

export function TimeBlockView({
  blocks,
  startDate,
  view = "week",
  onBlockClick,
  className,
}: TimeBlockViewProps) {
  const getDayLabel = (dayIndex: number) => {
    if (!startDate) return days[dayIndex];
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return `${days[dayIndex]} ${date.getDate()}`;
  };

  const getBlocksForDay = (dayIndex: number) => {
    return blocks.filter((block) => block.day === dayIndex);
  };

  if (view === "day") {
    const today = new Date().getDay();
    const todayBlocks = getBlocksForDay(today);

    return (
      <div className={cn("space-y-2", className)}>
        {todayBlocks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            今日沒有排程的時間區塊
          </p>
        ) : (
          todayBlocks.map((block) => (
            <TimeBlockCard
              key={block.id}
              block={block}
              onClick={() => onBlockClick?.(block)}
            />
          ))
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <div
              key={dayIndex}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {getDayLabel(dayIndex)}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1">
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <div
              key={dayIndex}
              className="min-h-[120px] rounded-lg border border-border bg-muted/30 p-1 space-y-1"
            >
              {getBlocksForDay(dayIndex).map((block) => (
                <button
                  key={block.id}
                  onClick={() => onBlockClick?.(block)}
                  className={cn(
                    "w-full rounded p-2 text-left text-xs border transition-opacity hover:opacity-80",
                    blockColors[block.type]
                  )}
                >
                  <p className="font-medium truncate">
                    {block.title || blockLabels[block.type]}
                  </p>
                  <p className="opacity-70">
                    {block.startTime} - {block.endTime}
                  </p>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TimeBlockCardProps {
  block: TimeBlock;
  onClick?: () => void;
}

function TimeBlockCard({ block, onClick }: TimeBlockCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg p-4 text-left border transition-opacity hover:opacity-80",
        blockColors[block.type]
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium">{block.title || blockLabels[block.type]}</p>
        <span className="text-sm opacity-70">
          {block.startTime} - {block.endTime}
        </span>
      </div>
    </button>
  );
}

export function TimeBlockLegend({ className }: { className?: string }) {
  const legendItems: { type: TimeBlockType; description: string }[] = [
    { type: "strategic", description: "專注執行重要任務 (3小時)" },
    { type: "buffer", description: "處理郵件、行政事務 (30-60分鐘)" },
    { type: "breakout", description: "學習、規劃、創意思考 (3小時)" },
  ];

  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <h4 className="font-medium mb-3">時間區塊說明</h4>
      <div className="space-y-2">
        {legendItems.map(({ type, description }) => (
          <div key={type} className="flex items-center gap-3">
            <div
              className={cn(
                "h-4 w-4 rounded border",
                blockColors[type].replace("text-", "border-").split(" ").slice(0, 2).join(" ")
              )}
              style={{
                backgroundColor:
                  type === "strategic"
                    ? "#dbeafe"
                    : type === "buffer"
                    ? "#fef9c3"
                    : "#dcfce7",
              }}
            />
            <div>
              <span className="font-medium text-sm">{blockLabels[type]}</span>
              <span className="text-sm text-muted-foreground ml-2">
                - {description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
