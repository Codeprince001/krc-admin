"use client";

import Link from "next/link";
import { ShieldX, Lock, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Permission } from "@/lib/permissions";

const PERMISSION_LABELS: Record<Permission, string> = {
  dashboard: "Dashboard",
  users: "User Management",
  orders: "Orders",
  books: "Books & Store",
  sermons: "Sermons",
  devotionals: "Devotionals & Words",
  announcements: "Announcements",
  events: "Events",
  testimonies: "Testimonies",
  prayerRequests: "Prayer Requests",
  groups: "Groups",
  counseling: "Counseling",
  giving: "Giving & Offerings",
  activityLog: "Activity Log",
  reports: "Reports & Export",
  settings: "Settings",
  games: "Bible Games",
  notifications: "Notifications",
  media: "Media Library",
  advertisements: "Advertisements",
};

interface AccessDeniedProps {
  permission?: Permission;
}

/**
 * Full-page access-denied screen. Shown when the user's role lacks the
 * required permission. Does not redirect; sidebar remains visible.
 */
export function AccessDenied({ permission }: AccessDeniedProps) {
  const sectionName = permission
    ? PERMISSION_LABELS[permission]
    : "this section";

  return (
    <div className="flex min-h-[72vh] items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-8 max-w-lg w-full text-center">
        {/* Icon cluster */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-400/15 rounded-full blur-3xl scale-150" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-red-50 via-rose-100 to-pink-200 dark:from-red-950/60 dark:via-rose-900/50 dark:to-pink-900/40 shadow-2xl ring-8 ring-red-100/70 dark:ring-red-900/30">
            <ShieldX
              className="h-16 w-16 text-red-500 dark:text-red-400"
              strokeWidth={1.4}
            />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-lg ring-4 ring-white dark:ring-gray-900">
            <Lock className="h-4 w-4 text-red-500 dark:text-red-400" />
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Access Restricted
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Your current role does not grant access to{" "}
            <span className="font-semibold text-foreground">{sectionName}</span>
            . Contact your system administrator to request the necessary
            permission.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-dashed border-border/70" />

        {/* Info card */}
        <div className="w-full rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/60 dark:border-amber-700/40 dark:from-amber-950/40 dark:to-orange-950/30 p-5 text-left shadow-sm">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
            Why am I seeing this?
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
            The{" "}
            <span className="font-mono text-xs bg-amber-200/80 dark:bg-amber-800/50 px-1.5 py-0.5 rounded-md border border-amber-300/50 dark:border-amber-700/50">
              {permission ?? "required"}
            </span>{" "}
            permission is not included in your assigned role. An administrator
            can grant access under{" "}
            <span className="font-semibold">
              Settings &rsaquo; Roles &amp; Permissions
            </span>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 w-full sm:w-auto"
          >
            <Link href="/settings">
              <Mail className="h-4 w-4" />
              Contact Admin
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
