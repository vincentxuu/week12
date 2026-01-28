"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="checkbox"
            id={switchId}
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-6 w-11 rounded-full border-2 border-transparent bg-muted",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
              "peer-checked:bg-primary-base",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              "transition-colors",
              className
            )}
          />
          <div
            className={cn(
              "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm",
              "peer-checked:translate-x-5",
              "transition-transform",
              "pointer-events-none"
            )}
          />
        </div>
        {label && (
          <label
            htmlFor={switchId}
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
