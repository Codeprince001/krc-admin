"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Send,
  FileText,
  Users,
  BookOpen,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      label: "New Sermon",
      href: "/content/sermons",
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    },
    {
      label: "Create Event",
      href: "/content/events",
      icon: Calendar,
      color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    },
    {
      label: "Send Notification",
      href: "/notifications/send",
      icon: Send,
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
    },
    {
      label: "New Devotional",
      href: "/content/devotionals",
      icon: FileText,
      color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
    },
    {
      label: "Manage Users",
      href: "/users",
      icon: Users,
      color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20",
    },
    {
      label: "Add Announcement",
      href: "/content/announcements",
      icon: Plus,
      color: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className={`w-full h-auto flex-col gap-2 p-4 ${action.color} border-0`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
