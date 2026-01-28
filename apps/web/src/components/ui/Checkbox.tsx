"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded border border-input bg-background",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
              "peer-checked:border-primary-base peer-checked:bg-primary-base",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              "transition-colors",
              className
            )}
          >
            <Check className="h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
