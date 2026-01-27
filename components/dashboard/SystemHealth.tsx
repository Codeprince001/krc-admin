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
    <Card className="border-cyan-200/50 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
            <Server className="h-5 w-5 text-white" />
          </div>
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200/50">
          <Badge 
            className={`font-bold px-3 py-1.5 shadow-sm ${
              data.status === "healthy" 
                ? "bg-emerald-600 text-white" 
                : data.status === "degraded" 
                ? "bg-amber-600 text-white" 
                : "bg-red-600 text-white"
            }`}
          >
            {data.status.toUpperCase()}
          </Badge>
          <span className="text-sm font-semibold text-muted-foreground">Version {data.version}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg gradient-success shadow-sm">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Uptime</p>
            </div>
            <p className="text-2xl font-bold text-emerald-900">{formatUptime(data.uptime)}</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/50 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg shadow-sm ${data.database ? "gradient-success" : "bg-red-500"}`}>
                <Database className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Database</p>
            </div>
            <Badge className={`font-bold px-3 py-1.5 shadow-sm ${data.database ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
              {data.database ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg shadow-sm ${data.api ? "gradient-purple" : "bg-red-500"}`}>
              <Server className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">API</p>
          </div>
          <Badge className={`font-bold px-3 py-1.5 shadow-sm ${data.api ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
            {data.api ? "Operational" : "Down"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
