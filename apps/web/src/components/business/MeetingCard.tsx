"use client";

import { cn } from "@/lib/utils";
import { Calendar, Clock, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Meeting, Partner } from "@/types";

export interface MeetingCardProps {
  meeting: Meeting;
  partner?: Partner;
  onStart?: (meeting: Meeting) => void;
  onReschedule?: (meeting: Meeting) => void;
  onViewNotes?: (meeting: Meeting) => void;
  className?: string;
}

export function MeetingCard({
  meeting,
  partner,
  onStart,
  onReschedule,
  onViewNotes,
  className,
}: MeetingCardProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
      time: date.toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(meeting.scheduledAt);

  const statusLabels: Record<Meeting["status"], string> = {
    scheduled: "已排程",
    completed: "已完成",
    cancelled: "已取消",
  };

  const statusColors: Record<Meeting["status"], "default" | "success" | "destructive"> = {
    scheduled: "default",
    completed: "success",
    cancelled: "destructive",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-primary-base" />
            <span className="font-medium">Week {meeting.weekNumber} WAM</span>
            <Badge variant={statusColors[meeting.status]} size="sm">
              {statusLabels[meeting.status]}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
            {partner && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>夥伴:</span>
                <span className="text-foreground">{partner.partnerName}</span>
              </div>
            )}
          </div>
        </div>

        {meeting.status === "scheduled" && (
          <div className="flex flex-col gap-2">
            {onStart && (
              <Button size="sm" onClick={() => onStart(meeting)}>
                <Video className="mr-2 h-4 w-4" />
                開始會議
              </Button>
            )}
            {onReschedule && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReschedule(meeting)}
              >
                重新排程
              </Button>
            )}
          </div>
        )}

        {meeting.status === "completed" && onViewNotes && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewNotes(meeting)}
          >
            <FileText className="mr-2 h-4 w-4" />
            查看記錄
          </Button>
        )}
      </div>

      {/* Meeting Notes Preview */}
      {meeting.status === "completed" && meeting.notes && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {meeting.notes}
          </p>
        </div>
      )}

      {/* Commitments */}
      {meeting.status === "completed" && meeting.commitments && meeting.commitments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">承諾事項</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {meeting.commitments.map((commitment, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-base" />
                {commitment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export interface MeetingHistoryProps {
  meetings: Meeting[];
  getPartner?: (partnerId: string) => Partner | undefined;
  onViewNotes?: (meeting: Meeting) => void;
  className?: string;
}

export function MeetingHistory({
  meetings,
  getPartner,
  onViewNotes,
  className,
}: MeetingHistoryProps) {
  const completedMeetings = meetings.filter((m) => m.status === "completed");

  if (completedMeetings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        尚無會議記錄
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {completedMeetings.map((meeting) => {
        const partner = getPartner?.(meeting.partnerId);
        const date = new Date(meeting.scheduledAt).toLocaleDateString("zh-TW");

        return (
          <div
            key={meeting.id}
            className="flex items-center justify-between rounded-lg border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <Badge variant="outline">{date}</Badge>
              <span className="text-sm">
                Week {meeting.weekNumber} WAM
                {partner && ` - ${partner.partnerName}`}
              </span>
            </div>
            {onViewNotes && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewNotes(meeting)}
              >
                查看記錄
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MeetingAgenda({ className }: { className?: string }) {
  const agenda = [
    {
      title: "上週回顧",
      duration: "5分鐘",
      items: ["執行分數分享", "成就與挑戰"],
    },
    {
      title: "本週計劃",
      duration: "5分鐘",
      items: ["目標確認", "關鍵任務"],
    },
    {
      title: "承諾分享",
      duration: "5分鐘",
      items: ["互相承諾"],
    },
  ];

  return (
    <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
      <h3 className="font-semibold mb-4">WAM 會議議程</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Weekly Accountability Meeting
      </p>
      <div className="space-y-4">
        {agenda.map((section, index) => (
          <div key={index} className="rounded-lg bg-muted/50 p-4">
            <h4 className="font-medium mb-2">
              {index + 1}. {section.title} ({section.duration})
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
