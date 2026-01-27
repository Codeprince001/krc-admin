"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSystemHealth } from "@/lib/hooks/useAdmin";
import { Loader2, Server, Database, Zap } from "lucide-react";

export function SystemHealth() {
  const { data, isLoading } = useSystemHealth();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
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

  if (!data) {
    return null;
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={data.status === "healthy" ? "default" : data.status === "degraded" ? "warning" : "destructive"}>
            {data.status.toUpperCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">v{data.version}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium">Uptime</p>
            </div>
            <p className="text-2xl font-bold">{formatUptime(data.uptime)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className={`h-4 w-4 ${data.database ? "text-green-600" : "text-red-600"}`} />
              <p className="text-sm font-medium">Database</p>
            </div>
            <Badge variant={data.database ? "default" : "destructive"}>
              {data.database ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>

        <div className="space-y-1 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Server className={`h-4 w-4 ${data.api ? "text-green-600" : "text-red-600"}`} />
            <p className="text-sm font-medium">API</p>
          </div>
          <Badge variant={data.api ? "default" : "destructive"}>
            {data.api ? "Operational" : "Down"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
