"use client";

import { useState } from "react";
import { Container } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Avatar,
  Modal,
  Input,
} from "@/components/ui";
import {
  mockPartners,
  mockMeetings,
  getMeetingsByPartnerId,
  getPartnerById,
} from "@/mocks";
import { UserPlus, Calendar, MessageSquare, Eye, Clock } from "lucide-react";

export default function PartnersPage() {
  const [isInviting, setIsInviting] = useState(false);

  const nextMeeting = mockMeetings.find((m) => m.status === "scheduled");
  const nextMeetingPartner = nextMeeting
    ? getPartnerById(nextMeeting.partnerId)
    : null;

  const completedMeetings = mockMeetings.filter(
    (m) => m.status === "completed"
  );

  return (
    <Container className="py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-lg">我的夥伴</h1>
          <p className="body-md text-muted-foreground mt-1">
            與夥伴互相支持，一起達成目標
          </p>
        </div>
        <Button onClick={() => setIsInviting(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          邀請夥伴
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Partners List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>我的夥伴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-4"
                  >
                    <Avatar fallback={partner.partnerName} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{partner.partnerName}</p>
                      <p className="text-sm text-muted-foreground">
                        本週分數: {partner.weeklyScore}%
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  className="w-full mt-3"
                  onClick={() => setIsInviting(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  邀請更多夥伴
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meeting Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Next Meeting */}
          {nextMeeting && nextMeetingPartner && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-base" />
                  下次 WAM 會議
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(nextMeeting.scheduledAt).toLocaleDateString(
                          "zh-TW",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">時間:</span>
                      <span>
                        {new Date(nextMeeting.scheduledAt).toLocaleTimeString(
                          "zh-TW",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">夥伴:</span>
                      <span>{nextMeetingPartner.partnerName}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button>開始會議</Button>
                    <Button variant="outline">重新排程</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* WAM Agenda */}
          <Card>
            <CardHeader>
              <CardTitle>WAM 會議議程</CardTitle>
              <CardDescription>Weekly Accountability Meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium mb-2">1. 上週回顧 (5分鐘)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• 執行分數分享</li>
                    <li>• 成就與挑戰</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium mb-2">2. 本週計劃 (5分鐘)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• 目標確認</li>
                    <li>• 關鍵任務</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium mb-2">3. 承諾分享 (5分鐘)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• 互相承諾</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meeting History */}
          <Card>
            <CardHeader>
              <CardTitle>會議記錄</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedMeetings.map((meeting) => {
                  const partner = getPartnerById(meeting.partnerId);
                  return (
                    <div
                      key={meeting.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {new Date(meeting.scheduledAt).toLocaleDateString(
                            "zh-TW"
                          )}
                        </Badge>
                        <span className="text-sm">
                          Week {meeting.weekNumber} WAM - {partner?.partnerName}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        查看記錄
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviting}
        onClose={() => setIsInviting(false)}
        title="邀請夥伴"
        description="輸入夥伴的 Email 來發送邀請"
      >
        <div className="space-y-4">
          <Input
            label="夥伴 Email"
            type="email"
            placeholder="partner@example.com"
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsInviting(false)}>
              取消
            </Button>
            <Button onClick={() => setIsInviting(false)}>發送邀請</Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
