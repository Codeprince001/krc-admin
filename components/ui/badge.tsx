import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-0 bg-primary text-primary-foreground",
        secondary:
          "border-0 bg-secondary text-secondary-foreground",
        destructive:
          "border-0 bg-destructive text-destructive-foreground",
        success:
          "border-0 bg-success text-success-foreground",
        warning:
          "border-0 bg-warning text-warning-foreground",
        info:
          "border-0 bg-info text-info-foreground",
        outline: "border border-input text-foreground bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

