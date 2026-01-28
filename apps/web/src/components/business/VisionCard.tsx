"use client";

import { cn } from "@/lib/utils";
import { Pencil, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Vision } from "@/types";

export interface VisionCardProps {
  vision: Vision;
  onEdit?: (vision: Vision) => void;
  className?: string;
}

export function VisionCard({ vision, onEdit, className }: VisionCardProps) {
  const typeLabels: Record<Vision["type"], string> = {
    "3-year": "3 年願景",
    "10-year": "10 年願景",
  };

  const typeColors: Record<Vision["type"], string> = {
    "3-year": "bg-primary-lightest border-primary-lighter",
    "10-year": "bg-logo-yellow/20 border-logo-yellow/40",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-6 transition-shadow hover:shadow-md",
        typeColors[vision.type],
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="heading-sm">{typeLabels[vision.type]}</h3>
          <p className="mt-3 body-md text-foreground/90 whitespace-pre-wrap">
            {vision.content}
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>更新於 {formatDate(vision.updatedAt)}</span>
          </div>
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(vision)}
            aria-label="編輯願景"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export interface VisionEmptyCardProps {
  type: Vision["type"];
  onAdd?: () => void;
  className?: string;
}

export function VisionEmptyCard({
  type,
  onAdd,
  className,
}: VisionEmptyCardProps) {
  const typeLabels: Record<Vision["type"], string> = {
    "3-year": "3 年願景",
    "10-year": "10 年願景",
  };

  const prompts: Record<Vision["type"], string> = {
    "3-year": "三年後，你希望自己成為什麼樣的人？達成什麼目標？",
    "10-year": "十年後，你的理想生活是什麼樣子？你想對世界產生什麼影響？",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border p-8 text-center",
        className
      )}
    >
      <h3 className="heading-sm text-muted-foreground">
        {typeLabels[type]}
      </h3>
      <p className="mt-2 body-sm text-muted-foreground">{prompts[type]}</p>
      {onAdd && (
        <Button variant="outline" className="mt-4" onClick={onAdd}>
          開始撰寫
        </Button>
      )}
    </div>
  );
}
