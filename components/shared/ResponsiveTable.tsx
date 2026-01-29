"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { Card } from "@/components/ui/card";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  mobileLabel?: string; // Custom label for mobile view
  hiddenOnMobile?: boolean; // Hide this column on mobile
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  mobileCardView?: boolean; // Use card view on mobile (default: true)
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  className,
  emptyMessage = "No data available",
  loading = false,
  mobileCardView = true,
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  const getCellValue = (item: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }
    return item[column.accessor];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  // Mobile Card View
  if (isMobile && mobileCardView) {
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <Card
            key={index}
            className={cn(
              "p-4 space-y-3 transition-all duration-200",
              onRowClick && "cursor-pointer hover:shadow-lg active:scale-98",
              className
            )}
            onClick={() => onRowClick?.(item)}
          >
            {columns
              .filter((col) => !col.hiddenOnMobile)
              .map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between items-start gap-3">
                  <span className="text-sm font-semibold text-muted-foreground min-w-[100px]">
                    {column.mobileLabel || column.header}:
                  </span>
                  <span className="text-sm text-right flex-1">
                    {getCellValue(item, column)}
                  </span>
                </div>
              ))}
          </Card>
        ))}
      </div>
    );
  }

  // Desktop/Tablet Table View
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className={cn("min-w-full divide-y divide-border", className)}>
          <thead className="bg-muted/50">
            <tr>
              {columns
                .filter((col) => !(isMobile && col.hiddenOnMobile))
                .map((column, index) => (
                  <th
                    key={index}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                      column.className
                    )}
                  >
                    {column.header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {data.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  "transition-colors hover:bg-muted/30",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns
                  .filter((col) => !(isMobile && col.hiddenOnMobile))
                  .map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        "px-4 py-3 text-sm whitespace-nowrap",
                        column.className
                      )}
                    >
                      {getCellValue(item, column)}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Utility component for responsive data lists (simpler than full table)
interface DataListProps {
  items: { label: string; value: ReactNode }[];
  className?: string;
}

export function ResponsiveDataList({ items, className }: DataListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
        >
          <span className="text-sm font-semibold text-muted-foreground">
            {item.label}
          </span>
          <span className="text-sm sm:text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
