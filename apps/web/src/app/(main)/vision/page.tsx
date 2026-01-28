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
  Modal,
  Textarea,
} from "@/components/ui";
import { mockVisions, mockGoals } from "@/mocks";
import { Pencil, Target, ArrowRight } from "lucide-react";

export default function VisionPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingVision, setEditingVision] = useState<typeof mockVisions[0] | null>(null);

  const vision3Year = mockVisions.find((v) => v.type === "3-year");
  const vision10Year = mockVisions.find((v) => v.type === "10-year");

  const handleEdit = (vision: typeof mockVisions[0]) => {
    setEditingVision(vision);
    setIsEditing(true);
  };

  return (
    <Container className="py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-lg">你的願景</h1>
          <p className="body-md text-muted-foreground mt-1">
            定義你的長期願景，讓它引導你的 12 週目標
          </p>
        </div>
      </div>

      {/* Vision Cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* 10 Year Vision */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary-base" />
                  10 年願景
                </CardTitle>
                <CardDescription>你的終極目標與人生方向</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => vision10Year && handleEdit(vision10Year)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="body-md text-foreground leading-relaxed">
                {vision10Year?.content || "尚未設定 10 年願景"}
              </p>
            </div>
            {vision10Year && (
              <p className="text-xs text-muted-foreground mt-3">
                上次更新：{new Date(vision10Year.updatedAt).toLocaleDateString("zh-TW")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 3 Year Vision */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-logo-orange" />
                  3 年願景
                </CardTitle>
                <CardDescription>中期目標，連結願景與行動</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => vision3Year && handleEdit(vision3Year)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="body-md text-foreground leading-relaxed">
                {vision3Year?.content || "尚未設定 3 年願景"}
              </p>
            </div>
            {vision3Year && (
              <p className="text-xs text-muted-foreground mt-3">
                上次更新：{new Date(vision3Year.updatedAt).toLocaleDateString("zh-TW")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vision to Goals Connection */}
      <Card>
        <CardHeader>
          <CardTitle>願景與目標關聯</CardTitle>
          <CardDescription>
            你的願景如何連結到當前的 12 週目標
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 py-6 overflow-x-auto">
            {/* 10 Year Vision */}
            <div className="flex-shrink-0 w-40 text-center">
              <div className="rounded-lg bg-primary-palest p-4 mb-2">
                <p className="text-xs text-muted-foreground mb-1">10 年願景</p>
                <p className="text-sm font-medium line-clamp-2">
                  {vision10Year?.content.slice(0, 30)}...
                </p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

            {/* 3 Year Vision */}
            <div className="flex-shrink-0 w-40 text-center">
              <div className="rounded-lg bg-primary-pale p-4 mb-2">
                <p className="text-xs text-muted-foreground mb-1">3 年願景</p>
                <p className="text-sm font-medium line-clamp-2">
                  {vision3Year?.content.slice(0, 30)}...
                </p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />

            {/* 12 Week Goals */}
            <div className="flex-shrink-0 w-48 text-center">
              <div className="rounded-lg bg-primary-lightest p-4 mb-2">
                <p className="text-xs text-muted-foreground mb-1">12 週目標</p>
                <ul className="text-sm font-medium text-left space-y-1">
                  {mockGoals.slice(0, 3).map((goal) => (
                    <li key={goal.id} className="truncate">
                      • {goal.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={`編輯${editingVision?.type === "10-year" ? "10 年" : "3 年"}願景`}
        description="寫下你的願景，讓它成為引導你前進的北極星"
      >
        <div className="space-y-4">
          <Textarea
            label="願景內容"
            defaultValue={editingVision?.content}
            placeholder="描述你想要達成的願景..."
            rows={5}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              取消
            </Button>
            <Button onClick={() => setIsEditing(false)}>儲存</Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
