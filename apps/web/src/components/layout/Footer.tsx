import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-base">
            <span className="text-xs font-bold text-white">12</span>
          </div>
          <span className="text-sm text-muted-foreground">
            12 Week Year App
          </span>
        </div>

        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link
            href="/about"
            className="transition-colors hover:text-foreground"
          >
            關於
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            隱私政策
          </Link>
          <Link
            href="/terms"
            className="transition-colors hover:text-foreground"
          >
            服務條款
          </Link>
        </nav>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} 12 Week Year. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
