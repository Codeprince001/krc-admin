"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import { useActivityLog } from "@/lib/hooks/useAdmin";
import { formatDate } from "@/lib/utils/format";
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import {
  Activity,
  Search,
  User,
  FileText,
  Shield,
  RefreshCw,
} from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-green-100 text-green-800 border-green-200",
  UPDATE: "bg-blue-100 text-blue-800 border-blue-200",
  DELETE: "bg-red-100 text-red-800 border-red-200",
  APPROVE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECT: "bg-orange-100 text-orange-800 border-orange-200",
  LOGIN: "bg-purple-100 text-purple-800 border-purple-200",
  LOGOUT: "bg-gray-100 text-gray-800 border-gray-200",
  EXPORT: "bg-cyan-100 text-cyan-800 border-cyan-200",
  BULK: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

function getActionColor(action: string): string {
  if (!action) return "bg-gray-100 text-gray-800 border-gray-200";
  const key = Object.keys(ACTION_COLORS).find((k) =>
    action.toUpperCase().includes(k)
  );
  return key ? ACTION_COLORS[key] : "bg-gray-100 text-gray-800 border-gray-200";
}

const PAGE_SIZE = 20;

function ActivityLogPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState("all");

  const { data, isLoading, refetch, isFetching } = useActivityLog(page, PAGE_SIZE);

  const logs = data?.data ?? [];
  const meta = data?.meta;

  // Client-side filter by search / resource
  const filtered = logs.filter((log) => {
    const action = log.action ?? "";
    const resource = log.resource ?? "";
    const matchesSearch =
      !search ||
      action.toLowerCase().includes(search.toLowerCase()) ||
      resource.toLowerCase().includes(search.toLowerCase()) ||
      (log.user?.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      `${log.user?.firstName ?? ""} ${log.user?.lastName ?? ""}`.toLowerCase().includes(search.toLowerCase());

    const matchesResource =
      resourceFilter === "all" || resource.toLowerCase() === resourceFilter.toLowerCase();

    return matchesSearch && matchesResource;
  });

  // Get unique resources for the filter dropdown
  const resources = Array.from(new Set(logs.map((l) => l.resource).filter(Boolean))).sort() as string[];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Activity Log"
          description="Track admin actions for accountability and troubleshooting"
        />
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-full sm:w-auto gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Recent Admin Actions
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search actions, users…"
                  className="pl-9 w-full sm:w-64"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Select
                value={resourceFilter}
                onValueChange={(v) => {
                  setResourceFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="All Resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  {resources.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <LoadingState message="Loading activity log…" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No activity found"
              description="Admin actions will appear here as they happen."
            />
          ) : (
            <ResponsiveTableWrapper>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40">Admin</TableHead>
                    <TableHead className="min-w-30">Action</TableHead>
                    <TableHead className="min-w-30">Resource</TableHead>
                    <TableHead className="min-w-35">Resource ID</TableHead>
                    <TableHead className="min-w-45">Details</TableHead>
                    <TableHead className="min-w-40">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((log, i) => (
                    <TableRow key={log.id ?? `log-${i}`} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm shrink-0">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">
                              {log.user
                                ? `${log.user.firstName ?? ""} ${log.user.lastName ?? ""}`.trim() ||
                                  log.user.email
                                : <span className="text-muted-foreground italic">System</span>}
                            </div>
                            {log.user?.email && (
                              <div className="text-xs text-muted-foreground">
                                {log.user.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold border ${getActionColor(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {log.resource}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground max-w-35 truncate">
                        {log.resourceId ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-50">
                        {log.metadata ? (
                          <details className="text-xs text-muted-foreground cursor-pointer">
                            <summary className="hover:text-foreground transition-colors">
                              View details
                            </summary>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32 whitespace-pre-wrap break-all">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(log.createdAt, "MMM d, yyyy HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTableWrapper>
          )}

          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
              pageSize={PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">Action Legend</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ACTION_COLORS).map(([action, color]) => (
              <span
                key={action}
                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold border ${color}`}
              >
                {action}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ActivityLogPage() {
  return (
    <PermissionGuard permission="activityLog">
      <ActivityLogPageContent />
    </PermissionGuard>
  );
}
