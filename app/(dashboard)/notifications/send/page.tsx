"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Send, Users, UserCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api/client";

const notificationTypes = [
  { value: "EVENT_REMINDER", label: "Event Reminder" },
  { value: "NEW_BOOK", label: "New Book" },
  { value: "LIVE_STREAM", label: "Live Stream / Sermon" },
  { value: "DEVOTIONAL", label: "Devotional" },
  { value: "ORDER_UPDATE", label: "Order Update" },
  { value: "COUNSELING_REMINDER", label: "Counseling Reminder" },
  { value: "PRAYER_MEETING", label: "Prayer Meeting" },
  { value: "TESTIMONY_APPROVED", label: "Testimony Approved" },
  { value: "PRAYER_ANSWERED", label: "Prayer Answered" },
  { value: "WORDS_OF_WISDOM", label: "Words of Wisdom" },
  { value: "GENERAL", label: "General Announcement" },
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  body: z.string().min(1, "Message is required").max(1000),
  type: z.string().min(1, "Notification type is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  actionUrl: z.string().optional(),
  targetType: z.enum(["all", "specific"]),
  userIds: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SendNotificationPage() {
  const [isSending, setIsSending] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      type: "GENERAL",
      imageUrl: "",
      actionUrl: "",
      targetType: "all",
      userIds: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSending(true);
    try {
      const payload: any = {
        title: data.title,
        body: data.body,
        type: data.type,
        imageUrl: data.imageUrl || undefined,
        actionUrl: data.actionUrl || undefined,
      };

      if (data.targetType === "all") {
        // Send to all users
        await apiClient.post("/notifications/bulk", payload);
        toast.success("Notification Sent!", {
          description: "Your notification has been queued and will be sent to all users.",
        });
      } else {
        // Send to specific users
        const userIdArray = data.userIds
          ?.split(",")
          .map((id) => id.trim())
          .filter(Boolean);

        if (!userIdArray || userIdArray.length === 0) {
          throw new Error("Please provide at least one user ID");
        }

        await apiClient.post("/notifications/bulk", {
          ...payload,
          userIds: userIdArray,
        });

        toast.success("Notification Sent!", {
          description: `Notification queued for ${userIdArray.length} user(s).`,
        });
      }

      form.reset();
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to send notification",
      });
    } finally {
      setIsSending(false);
    }
  };

  const targetType = form.watch("targetType");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Send Notification</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Compose and send push notifications to users
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Compose Notification</CardTitle>
            <CardDescription>
              Fill in the details below to send a notification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="New Event Available!" {...field} />
                      </FormControl>
                      <FormDescription>
                        The notification title (max 200 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Join us for our upcoming Sunday service..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The notification message (max 1000 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select notification type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {notificationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Users can control which types they receive
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional image to display in the notification
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="actionUrl"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Action URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/events/sunday-service"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Where to navigate when user taps the notification
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetType"
                  render={({ field }: any) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Target Audience *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all" className="font-normal cursor-pointer flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              All Active Users
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="specific" id="specific" />
                            <Label htmlFor="specific" className="font-normal cursor-pointer flex items-center gap-2">
                              <UserCheck className="h-4 w-4" />
                              Specific Users
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {targetType === "specific" && (
                  <FormField
                    control={form.control}
                    name="userIds"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>User IDs</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="user-id-1, user-id-2, user-id-3"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated list of user IDs
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Notification
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              How your notification will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mobile Notification Preview */}
              <div className="border rounded-lg p-4 bg-background shadow-sm">
                <div className="flex gap-3">
                  {form.watch("imageUrl") ? (
                    <img
                      src={form.watch("imageUrl")}
                      alt="Preview"
                      className="w-12 h-12 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                      <Send className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {form.watch("title") || "Notification Title"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {form.watch("body") || "Your notification message will appear here..."}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Just now
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">
                    {notificationTypes.find((t) => t.value === form.watch("type"))?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-medium capitalize">{form.watch("targetType")}</span>
                </div>
                {form.watch("actionUrl") && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action:</span>
                    <span className="font-medium text-xs truncate max-w-50">
                      {form.watch("actionUrl")}
                    </span>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">
                  Important Notes
                </h4>
                <ul className="text-xs space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• Notifications are queued and processed asynchronously</li>
                  <li>• Users can control which notification types they receive</li>
                  <li>• Quiet hours and rate limits are automatically respected</li>
                  <li>• Analytics are tracked automatically (sent, delivered, opened, clicked)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
