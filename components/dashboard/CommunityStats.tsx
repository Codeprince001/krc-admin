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
    <Card className="border-pink-200/50 bg-gradient-to-br from-white via-pink-50/30 to-rose-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
            <Heart className="h-5 w-5 text-white" />
          </div>
          Community Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl gradient-purple shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Prayer Requests</p>
              <p className="text-3xl font-bold text-purple-900">{formatNumber(data.prayerRequests.total)}</p>
            </div>
          </div>
          {data.prayerRequests.pending > 0 && (
            <Badge className="bg-purple-600 text-white font-bold px-3 py-1.5 shadow-sm">
              {data.prayerRequests.pending} pending
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl gradient-success shadow-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Testimonies</p>
              <p className="text-3xl font-bold text-emerald-900">{formatNumber(data.testimonies.total)}</p>
            </div>
          </div>
          {data.testimonies.pending > 0 && (
            <Badge className="bg-emerald-600 text-white font-bold px-3 py-1.5 shadow-sm">
              {data.testimonies.pending} pending
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 transition-all duration-300 hover:shadow-lg hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl gradient-primary shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Groups</p>
              <p className="text-3xl font-bold text-blue-900">{formatNumber(data.groups)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
