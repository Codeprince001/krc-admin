"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface ResponsiveTableWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper component that provides horizontal scroll for tables on mobile
 * while keeping them full-width on desktop
 * 
 * Usage:
 * <ResponsiveTableWrapper>
 *   <table>...</table>
 * </ResponsiveTableWrapper>
 */
export function ResponsiveTableWrapper({ 
  children, 
  className 
}: ResponsiveTableWrapperProps) {
  return (
    <div className={cn(
      "w-full max-w-full overflow-x-auto rounded-lg border border-border bg-white",
      "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
      className
    )}>
      <div className="min-w-max sm:min-w-full align-middle">
        <div className="overflow-hidden rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper for table with shadow indicators when scrollable
 */
export function ScrollableTableWrapper({ 
  children, 
  className 
}: ResponsiveTableWrapperProps) {
  return (
    <div className={cn(
      "relative w-full",
      className
    )}>
      {/* Scroll shadow indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 lg:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 lg:hidden" />
      
      <div className={cn(
        "w-full max-w-full overflow-x-auto",
        "smooth-scroll",
        "rounded-lg border border-border bg-white"
      )}>
        <div className="min-w-max sm:min-w-full align-middle">
          {children}
        </div>
      </div>
    </div>
  );
}
