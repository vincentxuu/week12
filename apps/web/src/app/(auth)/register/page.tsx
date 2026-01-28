"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, Button, Input } from "@/components/ui";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-base">
          <span className="text-lg font-bold text-white">12</span>
        </div>
        <h1 className="mt-4 text-2xl font-bold">12 Week Year</h1>
        <p className="text-sm text-muted-foreground">
          建立你的帳戶
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="姓名"
              type="text"
              placeholder="你的姓名"
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              required
            />
            <Input
              label="密碼"
              type="password"
              placeholder="至少 8 個字元"
              required
            />
            <Input
              label="確認密碼"
              type="password"
              placeholder="再次輸入密碼"
              required
            />
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              註冊
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            已有帳號？{" "}
            <Link
              href="/login"
              className="font-medium text-primary-base hover:text-primary-darker"
            >
              立即登入
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
