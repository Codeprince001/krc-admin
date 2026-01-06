"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 page-enter">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-base mt-2">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}

