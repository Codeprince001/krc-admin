"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-slow"></div>
          <div className="relative rounded-full bg-gradient-to-br from-muted to-muted/50 p-6 border-2 border-border/50 shadow-lg">
            <Icon className="h-12 w-12 text-muted-foreground/70" />
          </div>
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-base text-muted-foreground max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </div>
  );
}

