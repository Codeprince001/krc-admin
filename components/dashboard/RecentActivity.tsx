"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivityLog } from "@/lib/hooks/useAdmin";
import { formatRelativeTime } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity } from "lucide-react";

export function RecentActivity() {
  const { data, isLoading } = useActivityLog(1, 10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const activities = data?.data || [];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "USER_REGISTERED":
        return "bg-blue-500";
      case "ORDER_CREATED":
        return "bg-green-500";
      case "PRAYER_REQUEST":
        return "bg-purple-500";
      case "TESTIMONY_SUBMITTED":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            activities.map((activity: any, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${getActivityColor(activity.type)}`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace(/_/g, " ")}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

