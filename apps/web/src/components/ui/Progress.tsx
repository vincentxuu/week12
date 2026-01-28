import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "destructive";
}

export function Progress({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  variant = "default",
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const variantStyles = {
    default: "bg-primary-base",
    success: "bg-success",
    warning: "bg-tips",
    destructive: "bg-destructive",
  };

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground min-w-[3ch]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
