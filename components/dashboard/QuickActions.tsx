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
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
    },
    {
      label: "Create Event",
      href: "/content/events",
      icon: Calendar,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      label: "Send Notification",
      href: "/notifications/send",
      icon: Send,
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      label: "New Devotional",
      href: "/content/devotionals",
      icon: FileText,
      gradient: "from-orange-500 to-amber-600",
      bgGradient: "from-orange-50 to-amber-50",
    },
    {
      label: "Manage Users",
      href: "/users",
      icon: Users,
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-50 to-rose-50",
    },
    {
      label: "Add Announcement",
      href: "/content/announcements",
      icon: Plus,
      gradient: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-50 to-blue-50",
    },
  ];

  return (
    <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.bgGradient} p-4 border-2 border-transparent hover:border-white transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center">
                    {action.label}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
