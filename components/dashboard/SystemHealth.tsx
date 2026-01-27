"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSystemHealth } from "@/lib/hooks/useAdmin";
import { Loader2, Server, Database, Zap } from "lucide-react";
import { formatFileSize } from "@/lib/utils/format";

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

  const formatMemory = (bytes: number) => {
    return formatFileSize(bytes);
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
              <Database className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium">Database</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {data.database?.totalRecords || 0} records
            </p>
          </div>
        </div>

        {data.memory && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm font-medium">Memory Usage</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Heap Used</p>
                <p className="font-mono">{formatMemory(data.memory.heapUsed)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Heap Total</p>
                <p className="font-mono">{formatMemory(data.memory.heapTotal)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
