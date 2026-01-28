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
  Input,
  Switch,
  Avatar,
} from "@/components/ui";
import { mockUser, mockUserSettings } from "@/mocks";
import {
  User,
  Bell,
  Palette,
  Calendar,
  Download,
  Settings,
  LogOut,
  Trash2,
} from "lucide-react";

type SettingsTab =
  | "profile"
  | "notifications"
  | "display"
  | "calendar"
  | "export"
  | "account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = [
    { id: "profile" as const, label: "個人資料", icon: User },
    { id: "notifications" as const, label: "通知設定", icon: Bell },
    { id: "display" as const, label: "顯示設定", icon: Palette },
    { id: "calendar" as const, label: "行事曆整合", icon: Calendar },
    { id: "export" as const, label: "資料匯出", icon: Download },
    { id: "account" as const, label: "帳戶管理", icon: Settings },
  ];

  return (
    <Container className="py-8">
      <h1 className="heading-lg mb-8">設定</h1>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-lightest text-primary-darker"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>個人資料</CardTitle>
                <CardDescription>管理你的帳戶資料</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar fallback={mockUser.name} size="xl" />
                  <div>
                    <Button variant="outline" size="sm">
                      上傳圖片
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, GIF 最大 2MB
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="姓名" defaultValue={mockUser.name} />
                  <Input
                    label="Email"
                    type="email"
                    defaultValue={mockUser.email}
                    disabled
                    helperText="Email 無法變更"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">時區</label>
                  <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option value="Asia/Taipei">UTC+8 台北</option>
                    <option value="Asia/Tokyo">UTC+9 東京</option>
                    <option value="America/New_York">UTC-5 紐約</option>
                  </select>
                </div>
                <Button>儲存變更</Button>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>管理你的通知偏好</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">每日提醒</p>
                    <p className="text-sm text-muted-foreground">
                      每日早上收到任務提醒
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      defaultChecked={
                        mockUserSettings.notifications.dailyReminder
                      }
                    />
                    <Input
                      type="time"
                      defaultValue={
                        mockUserSettings.notifications.dailyReminderTime
                      }
                      className="w-24"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">每週報告</p>
                    <p className="text-sm text-muted-foreground">
                      每週收到執行分數報告
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      defaultChecked={
                        mockUserSettings.notifications.weeklyReport
                      }
                    />
                    <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option value="Sunday">週日</option>
                      <option value="Monday">週一</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">WAM 會議提醒</p>
                    <p className="text-sm text-muted-foreground">
                      會議前收到提醒通知
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      defaultChecked={mockUserSettings.notifications.wamReminder}
                    />
                    <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option value="1hour">前 1 小時</option>
                      <option value="30min">前 30 分鐘</option>
                      <option value="15min">前 15 分鐘</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">目標到期提醒</p>
                    <p className="text-sm text-muted-foreground">
                      任務即將到期時收到通知
                    </p>
                  </div>
                  <Switch
                    defaultChecked={
                      mockUserSettings.notifications.goalDeadline
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Display Settings */}
          {activeTab === "display" && (
            <Card>
              <CardHeader>
                <CardTitle>顯示設定</CardTitle>
                <CardDescription>自訂介面外觀</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">深色模式</p>
                    <p className="text-sm text-muted-foreground">
                      切換深色/淺色主題
                    </p>
                  </div>
                  <Switch defaultChecked={mockUserSettings.theme === "dark"} />
                </div>
                <div>
                  <label className="text-sm font-medium">語言</label>
                  <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option value="zh-TW">繁體中文</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Calendar Integration */}
          {activeTab === "calendar" && (
            <Card>
              <CardHeader>
                <CardTitle>行事曆整合</CardTitle>
                <CardDescription>連結你的行事曆服務</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        同步任務到 Google 行事曆
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">連結</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Apple Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        同步任務到 Apple 行事曆
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">連結</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Export */}
          {activeTab === "export" && (
            <Card>
              <CardHeader>
                <CardTitle>資料匯出</CardTitle>
                <CardDescription>匯出你的資料</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">匯出為 PDF</p>
                    <p className="text-sm text-muted-foreground">
                      將你的 12 週計劃匯出為 PDF 報告
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    匯出 PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">匯出為 CSV</p>
                    <p className="text-sm text-muted-foreground">
                      將任務資料匯出為 CSV 檔案
                    </p>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    匯出 CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Management */}
          {activeTab === "account" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>帳戶管理</CardTitle>
                  <CardDescription>管理你的帳戶</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    登出
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">危險區域</CardTitle>
                  <CardDescription>
                    以下操作不可逆，請謹慎操作
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" className="w-full justify-start">
                    <Trash2 className="mr-2 h-4 w-4" />
                    刪除帳戶
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
