"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Target,
  CalendarDays,
  ListTodo,
  BarChart3,
  Users,
  Settings,
  User,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";

const navItems = [
  { href: "/", label: "儀表板", icon: LayoutDashboard },
  { href: "/vision", label: "願景", icon: Target },
  { href: "/plan", label: "計劃", icon: CalendarDays },
  { href: "/weekly", label: "週計劃", icon: ListTodo },
  { href: "/scorecard", label: "計分卡", icon: BarChart3 },
  { href: "/partners", label: "夥伴", icon: Users },
];

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function Header() {
  const pathname = usePathname();

  const { data: user, isLoading: isUserLoading } = useQuery<UserData>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await fetch("/api/v1/users/me");
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: false,
  });

  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-base">
            <span className="text-sm font-bold text-white">12</span>
          </div>
          <span className="hidden font-bold sm:inline-block">
            12 Week Year
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  isActive
                    ? "bg-primary-lightest text-primary-darker"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline-block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-muted hover:text-foreground",
              pathname === "/settings"
                ? "bg-primary-lightest text-primary-darker"
                : "text-muted-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline-block">設定</span>
          </Link>

          {isUserLoading ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted animate-pulse" />
          ) : isAuthenticated ? (
            <Link
              href="/settings"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80 overflow-hidden"
            >
              {user.avatar ? (
                <Avatar src={user.avatar} alt={user.name} size="sm" />
              ) : (
                <span className="text-sm font-medium text-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-primary-base text-white hover:bg-primary-darker"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden md:inline-block">登入</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
