"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Button, ButtonProps } from "@/components/ui/button";
import { useIsMobileOrTablet } from "@/lib/hooks/useMediaQuery";

/**
 * Mobile-optimized button with larger touch targets and improved feedback
 */
export const MobileOptimizedButton = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, size, children, ...props }, ref) => {
  const isMobileOrTablet = useIsMobileOrTablet();

  // On mobile/tablet, ensure minimum touch target size
  const mobileSize = isMobileOrTablet && !size ? "default" : size;

  return (
    <Button
      ref={ref}
      size={mobileSize}
      className={cn(
        "touch-target active:scale-98 transition-transform",
        isMobileOrTablet && "min-h-[44px]", // iOS recommendation for touch targets
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

MobileOptimizedButton.displayName = "MobileOptimizedButton";
