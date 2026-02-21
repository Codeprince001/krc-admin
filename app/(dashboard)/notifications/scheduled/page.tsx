"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Loader2, Plus, X, Clock, Calendar as CalendarIcon } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { apiClient } from "@/lib/api/client";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  scheduledFor: string;
  timezone: string;
  status: string;
  recurring: boolean;
  recurrenceRule: string | null;
  imageUrl: string | null;
  actionUrl: string | null;
  templateId: string | null;
  template?: { name: string };
  createdAt: string;
  sentAt: string | null;
}

interface Template {
  id: string;
  name: string;
  title: string;
  body: string;
}

const notificationTypes = [
  { value: "EVENT_REMINDER", label: "Event Reminder" },
  { value: "DEVOTIONAL", label: "Devotional" },
  { value: "GENERAL", label: "General" },
  { value: "LIVE_STREAM", label: "Live Stream" },
  { value: "PRAYER_MEETING", label: "Prayer Meeting" },
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  SENT: "bg-green-500",
  FAILED: "bg-red-500",
  CANCELLED: "bg-gray-500",
};

export default function ScheduledNotificationsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    type: "GENERAL",
    scheduledFor: "",
    timezone: "UTC",
    recurring: false,
    recurrenceRule: "",
    imageUrl: "",
    actionUrl: "",
    templateId: "",
  });
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  // Fetch scheduled notifications
  const { data: scheduledNotifications, isLoading } = useQuery<ScheduledNotification[]>({
    queryKey: ["scheduled-notifications"],
    queryFn: async () => {
      const response = await apiClient.get<ScheduledNotification[]>("/notifications/scheduled");
      return response || [];
    },
  });

  // Fetch templates
  const { data: templates } = useQuery<Template[]>({
    queryKey: ["notification-templates"],
    queryFn: async () => {
      const response = await apiClient.get<Template[]>("/notifications/templates");
      return response || [];
    },
  });

  // Create scheduled notification mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post<ScheduledNotification>("/notifications/scheduled", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-notifications"] });
      toast.success("Notification scheduled successfully");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to schedule notification");
    },
  });

  // Cancel scheduled notification mutation
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/notifications/scheduled/${id}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-notifications"] });
      toast.success("Notification cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel notification");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      body: "",
      type: "GENERAL",
      scheduledFor: "",
      timezone: "UTC",
      recurring: false,
      recurrenceRule: "",
      imageUrl: "",
      actionUrl: "",
      templateId: "",
    });
  };

  const handleCreate = () => {
    const payload: any = {
      ...formData,
      templateId: formData.templateId || undefined,
      imageUrl: formData.imageUrl || undefined,
      actionUrl: formData.actionUrl || undefined,
      recurrenceRule: formData.recurring ? formData.recurrenceRule : undefined,
    };
    createMutation.mutate(payload);
  };

  const handleCancel = (id: string) => setCancelTarget(id);

  const handleConfirmCancel = () => {
    if (cancelTarget) {
      cancelMutation.mutate(cancelTarget);
      setCancelTarget(null);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    if (templateId && templateId !== "none") {
      const template = templates?.find((t) => t.id === templateId);
      if (template) {
        setFormData({
          ...formData,
          templateId,
          title: template.title,
          body: template.body,
        });
      }
    } else {
      setFormData({
        ...formData,
        templateId: "",
        title: "",
        body: "",
      });
    }
  };

  const pendingNotifications = scheduledNotifications?.filter((n) => n.status === "PENDING") || [];
  const pastNotifications = scheduledNotifications?.filter((n) => n.status !== "PENDING") || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Scheduled Notifications</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Schedule notifications for future delivery with timezone support
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Notification
        </Button>
      </div>

      {/* Pending Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending ({pendingNotifications.length})
          </CardTitle>
          <CardDescription>
            Notifications scheduled for future delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pendingNotifications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Recurring</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {notification.body}
                        </div>
                        {notification.template && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Template: {notification.template.name}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {notificationTypes.find((t) => t.value === notification.type)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(notification.scheduledFor), "PPp")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{notification.timezone}</span>
                    </TableCell>
                    <TableCell>
                      {notification.recurring ? (
                        <div>
                          <Badge variant="outline">Recurring</Badge>
                          {notification.recurrenceRule && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {notification.recurrenceRule}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">One-time</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancel(notification.id)}
                        disabled={cancelMutation.isPending}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No pending notifications</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Schedule your first notification to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Notifications */}
      {pastNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>History ({pastNotifications.length})</CardTitle>
            <CardDescription>
              Previously scheduled notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <div className="font-medium">{notification.title}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(notification.scheduledFor), "PPp")}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[notification.status]}>
                        {notification.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {notification.sentAt
                        ? format(new Date(notification.sentAt), "PPp")
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Notification</DialogTitle>
            <DialogDescription>
              Set up a notification to be sent at a specific date and time
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template">Use Template (Optional)</Label>
              <Select value={formData.templateId} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None - Custom Message</SelectItem>
                  {templates?.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Notification Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Sunday Service Reminder"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message *</Label>
              <Textarea
                id="body"
                rows={4}
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Join us for worship this Sunday at 10 AM..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledFor">Schedule Date & Time *</Label>
                <Input
                  id="scheduledFor"
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.recurring}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, recurring: checked })}
              />
              <Label htmlFor="recurring" className="cursor-pointer">
                Recurring Notification
              </Label>
            </div>

            {formData.recurring && (
              <div className="space-y-2">
                <Label htmlFor="recurrenceRule">Recurrence Rule (Cron)</Label>
                <Input
                  id="recurrenceRule"
                  value={formData.recurrenceRule}
                  onChange={(e) => setFormData({ ...formData, recurrenceRule: e.target.value })}
                  placeholder="0 10 * * 0 (Every Sunday at 10 AM)"
                />
                <p className="text-xs text-muted-foreground">
                  Use cron syntax: minute hour day month weekday
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionUrl">Action URL (Optional)</Label>
              <Input
                id="actionUrl"
                value={formData.actionUrl}
                onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                placeholder="/events/sunday-service"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Cancel scheduled notification"
        description="Are you sure you want to cancel this scheduled notification?"
        confirmLabel="Cancel Notification"
        onConfirm={handleConfirmCancel}
        variant="destructive"
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}
