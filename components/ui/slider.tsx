import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Slider = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="range"
      className={cn("h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent", className)}
      {...props}
    />
  ),
);
Slider.displayName = "Slider";
