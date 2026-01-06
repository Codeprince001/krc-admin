"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivityLog } from "@/lib/hooks/useAdmin";
import { formatRelativeTime } from "@/lib/utils/format";
import { Loader2 } from "lucide-react";

export function RecentActivity() {
  const { data, isLoading } = useActivityLog(1, 10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    {activity.user
                      ? `${activity.user.firstName || ""} ${activity.user.lastName || ""}`.trim() ||
                        activity.user.email
                      : "System"}{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.resource} {activity.resourceId && `#${activity.resourceId}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

