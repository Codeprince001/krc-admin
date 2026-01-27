"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils/format";

interface CommunityStatsProps {
  data: {
    prayerRequests: {
      total: number;
      pending: number;
    };
    testimonies: {
      total: number;
      pending: number;
    };
    groups: number;
  };
}

export function CommunityStats({ data }: CommunityStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Engagement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Prayer Requests</p>
              <p className="text-2xl font-bold">{formatNumber(data.prayerRequests.total)}</p>
            </div>
          </div>
          {data.prayerRequests.pending > 0 && (
            <Badge variant="secondary">
              {data.prayerRequests.pending} pending
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Testimonies</p>
              <p className="text-2xl font-bold">{formatNumber(data.testimonies.total)}</p>
            </div>
          </div>
          {data.testimonies.pending > 0 && (
            <Badge variant="secondary">
              {data.testimonies.pending} pending
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Groups</p>
              <p className="text-2xl font-bold">{formatNumber(data.groups)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
