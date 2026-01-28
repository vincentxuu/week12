"use client";

import { cn } from "@/lib/utils";
import { Eye, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Partner } from "@/types";

export interface PartnerCardProps {
  partner: Partner;
  onView?: (partner: Partner) => void;
  onMessage?: (partner: Partner) => void;
  className?: string;
}

export function PartnerCard({
  partner,
  onView,
  onMessage,
  className,
}: PartnerCardProps) {
  const statusLabels: Record<Partner["status"], string> = {
    active: "已連結",
    pending: "等待確認",
    declined: "已拒絕",
  };

  const statusColors: Record<Partner["status"], "default" | "success" | "destructive"> = {
    active: "success",
    pending: "default",
    declined: "destructive",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm",
        className
      )}
    >
      <Avatar
        fallback={partner.partnerName}
        src={partner.partnerAvatar}
        size="lg"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{partner.partnerName}</p>
          {partner.status !== "active" && (
            <Badge variant={statusColors[partner.status]} size="sm">
              {statusLabels[partner.status]}
            </Badge>
          )}
        </div>
        {partner.status === "active" && partner.weeklyScore !== undefined && (
          <p className="text-sm text-muted-foreground">
            本週分數: {partner.weeklyScore}%
          </p>
        )}
      </div>

      {partner.status === "active" && (
        <div className="flex gap-1">
          {onView && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(partner)}
              aria-label="查看夥伴"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onMessage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMessage(partner)}
              aria-label="發送訊息"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export interface PartnerListProps {
  partners: Partner[];
  onView?: (partner: Partner) => void;
  onMessage?: (partner: Partner) => void;
  onInvite?: () => void;
  emptyMessage?: string;
  className?: string;
}

export function PartnerList({
  partners,
  onView,
  onMessage,
  onInvite,
  emptyMessage = "你還沒有夥伴",
  className,
}: PartnerListProps) {
  const activePartners = partners.filter((p) => p.status === "active");
  const pendingPartners = partners.filter((p) => p.status === "pending");

  return (
    <div className={className}>
      {partners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{emptyMessage}</p>
          {onInvite && (
            <Button variant="outline" className="mt-4" onClick={onInvite}>
              邀請夥伴
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {activePartners.length > 0 && (
            <div className="space-y-2">
              {activePartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  onView={onView}
                  onMessage={onMessage}
                />
              ))}
            </div>
          )}

          {pendingPartners.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                等待確認
              </h4>
              {pendingPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  onView={onView}
                  onMessage={onMessage}
                />
              ))}
            </div>
          )}

          {onInvite && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={onInvite}
            >
              + 邀請更多夥伴
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
