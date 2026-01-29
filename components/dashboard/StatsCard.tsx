import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "primary" | "success" | "warning" | "info" | "purple";
}

const variantStyles = {
  default: {
    card: "hover-lift border-border/50 bg-gradient-to-br from-white to-gray-50/30",
    icon: "bg-gray-100 text-gray-600",
    value: "text-foreground",
  },
  primary: {
    card: "hover-lift border-blue-200/50 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50/30",
    icon: "gradient-primary text-white",
    value: "text-blue-900",
  },
  success: {
    card: "hover-lift border-emerald-200/50 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50/30",
    icon: "gradient-success text-white",
    value: "text-emerald-900",
  },
  warning: {
    card: "hover-lift border-amber-200/50 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50/30",
    icon: "gradient-warning text-white",
    value: "text-amber-900",
  },
  info: {
    card: "hover-lift border-cyan-200/50 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50/30",
    icon: "gradient-info text-white",
    value: "text-cyan-900",
  },
  purple: {
    card: "hover-lift border-purple-200/50 bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50/30",
    icon: "gradient-purple text-white",
    value: "text-purple-900",
  },
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = "default",
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn(
      "overflow-hidden backdrop-blur-sm shadow-lg transition-all duration-300",
      styles.card,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground tracking-wide uppercase">
          {title}
        </CardTitle>
        <div className={cn("p-2 sm:p-2.5 rounded-xl shadow-sm", styles.icon)}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl sm:text-3xl font-bold tracking-tight", styles.value)}>
          {value}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-600" />
            )}
            <p
              className={cn(
                "text-sm font-semibold",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </p>
            <span className="text-xs text-muted-foreground ml-1">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

