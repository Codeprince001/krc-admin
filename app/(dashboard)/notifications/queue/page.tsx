"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { apiClient } from "@/lib/api/client";
import { formatDistanceToNow } from "date-fns";

interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

interface QueueJob {
  id: string;
  name: string;
  data: any;
  attemptsMade: number;
  timestamp: number;
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
  state: "waiting" | "active" | "completed" | "failed" | "delayed";
}

export default function QueueMonitorPage() {
  const queryClient = useQueryClient();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedJob, setSelectedJob] = useState<QueueJob | null>(null);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [removeJobTarget, setRemoveJobTarget] = useState<string | null>(null);
  const [clearCompletedOpen, setClearCompletedOpen] = useState(false);

  // Fetch queue stats
  const { data: stats, isLoading: statsLoading } = useQuery<QueueStats>({
    queryKey: ["notification-queue-stats"],
    queryFn: async () => {
      const response = await apiClient.get<QueueStats>("/notifications/queue/stats");
      return response || { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, paused: false };
    },
    refetchInterval: autoRefresh ? 5000 : false, // Refresh every 5 seconds
  });

  // Fetch queue jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery<QueueJob[]>({
    queryKey: ["notification-queue-jobs"],
    queryFn: async () => {
      const response = await apiClient.get<QueueJob[]>("/notifications/queue/jobs");
      return response || [];
    },
    refetchInterval: autoRefresh ? 5000 : false,
  });

  // Pause queue mutation
  const pauseMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/notifications/queue/pause");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-queue-stats"] });
      toast.success("Queue paused successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to pause queue");
    },
  });

  // Resume queue mutation
  const resumeMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/notifications/queue/resume");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-queue-stats"] });
      toast.success("Queue resumed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resume queue");
    },
  });

  // Retry failed jobs mutation
  const retryMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/notifications/queue/retry-failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-queue-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notification-queue-jobs"] });
      toast.success("Failed jobs queued for retry");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to retry jobs");
    },
  });

  // Clear completed jobs mutation
  const clearMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/notifications/queue/clear-completed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-queue-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notification-queue-jobs"] });
      toast.success("Completed jobs cleared");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to clear jobs");
    },
  });

  // Remove job mutation
  const removeJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await apiClient.delete(`/notifications/queue/jobs/${jobId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-queue-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notification-queue-jobs"] });
      toast.success("Job removed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove job");
    },
  });

  const handleViewJob = (job: QueueJob) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };

  const handleRemoveJob = (jobId: string) => setRemoveJobTarget(jobId);

  const handleConfirmRemoveJob = () => {
    if (removeJobTarget) {
      removeJobMutation.mutate(removeJobTarget);
      setRemoveJobTarget(null);
    }
  };

  const handleConfirmClearCompleted = () => {
    clearMutation.mutate();
    setClearCompletedOpen(false);
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "active":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "delayed":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStateBadge = (state: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      active: "default",
      completed: "secondary",
      failed: "destructive",
      delayed: "outline",
      waiting: "outline",
    };
    return <Badge variant={variants[state] || "outline"}>{state}</Badge>;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Queue Monitor</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Monitor and manage notification processing queue
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Stop Auto-Refresh
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Auto-Refresh
              </>
            )}
          </Button>
          {stats?.paused ? (
            <Button onClick={() => resumeMutation.mutate()}>
              <Play className="mr-2 h-4 w-4" />
              Resume Queue
            </Button>
          ) : (
            <Button variant="outline" onClick={() => pauseMutation.mutate()}>
              <Pause className="mr-2 h-4 w-4" />
              Pause Queue
            </Button>
          )}
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.waiting || 0}</div>
            <p className="text-xs text-muted-foreground">Jobs in queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Loader2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active || 0}</div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.failed || 0}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.delayed || 0}</div>
            <p className="text-xs text-muted-foreground">Scheduled later</p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Status Alert */}
      {stats?.paused && (
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <div>
            <p className="font-medium text-orange-900 dark:text-orange-100">
              Queue is currently paused
            </p>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              No jobs are being processed. Click "Resume Queue" to continue processing.
            </p>
          </div>
        </div>
      )}

      {/* Queue Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Actions</CardTitle>
          <CardDescription>
            Manage the notification processing queue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => retryMutation.mutate()}
              disabled={retryMutation.isPending || (stats?.failed || 0) === 0}
            >
              {retryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Failed Jobs ({stats?.failed || 0})
            </Button>
            <Button
              variant="outline"
              onClick={() => setClearCompletedOpen(true)}
              disabled={clearMutation.isPending || (stats?.completed || 0) === 0}
            >
              {clearMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Completed ({stats?.completed || 0})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>
            Latest jobs in the notification queue
            {autoRefresh && " (auto-refreshing every 5 seconds)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : jobs && jobs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Processed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-xs">{job.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStateIcon(job.state)}
                        {getStateBadge(job.state)}
                      </div>
                    </TableCell>
                    <TableCell>{job.attemptsMade}</TableCell>
                    <TableCell className="text-sm">
                      {formatDistanceToNow(job.timestamp, { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {job.processedOn
                        ? formatDistanceToNow(job.processedOn, { addSuffix: true })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewJob(job)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(job.state === "failed" || job.state === "completed") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveJob(job.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No jobs in queue</h3>
              <p className="text-sm text-muted-foreground mt-2">
                The queue is empty. Jobs will appear here when notifications are scheduled.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Details Dialog */}
      <Dialog open={isJobDetailsOpen} onOpenChange={setIsJobDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>
              Detailed information about this queue job
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Job ID</Label>
                  <p className="font-mono text-sm">{selectedJob.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="text-sm">{selectedJob.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">State</Label>
                  <div className="mt-1">{getStateBadge(selectedJob.state)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Attempts</Label>
                  <p className="text-sm">{selectedJob.attemptsMade}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-sm">
                    {new Date(selectedJob.timestamp).toLocaleString()}
                  </p>
                </div>
                {selectedJob.processedOn && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Processed</Label>
                    <p className="text-sm">
                      {new Date(selectedJob.processedOn).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {selectedJob.failedReason && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3">
                  <Label className="text-sm font-medium text-red-900 dark:text-red-100">
                    Error Message
                  </Label>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1 font-mono">
                    {selectedJob.failedReason}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Job Data</Label>
                <pre className="mt-2 bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(selectedJob.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!removeJobTarget}
        onOpenChange={(open) => !open && setRemoveJobTarget(null)}
        title="Remove job"
        description="Are you sure you want to remove this job? This action cannot be undone."
        confirmLabel="Remove"
        onConfirm={handleConfirmRemoveJob}
        variant="destructive"
        isLoading={removeJobMutation.isPending}
      />

      <ConfirmDialog
        open={clearCompletedOpen}
        onOpenChange={setClearCompletedOpen}
        title="Clear completed jobs"
        description="Are you sure you want to clear all completed jobs? This action cannot be undone."
        confirmLabel="Clear All"
        onConfirm={handleConfirmClearCompleted}
        variant="destructive"
        isLoading={clearMutation.isPending}
      />
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
