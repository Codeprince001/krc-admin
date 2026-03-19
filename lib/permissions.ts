/**
 * Shared permission system for the admin application.
 *
 * Permissions are enforced client-side (UI) from the user's profile.permissions
 * (returned by the auth profile API). The backend enforces permissions per-endpoint
 * server-side. getPermissionsForRole provides fallback lookup for system roles.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type Permission =
  | "dashboard"
  | "users"
  | "orders"
  | "books"
  | "sermons"
  | "devotionals"
  | "announcements"
  | "events"
  | "testimonies"
  | "prayerRequests"
  | "groups"
  | "counseling"
  | "giving"
  | "activityLog"
  | "reports"
  | "settings"
  | "games"
  | "notifications"
  | "media"
  | "advertisements"
  | "inAppPopups";

export type SystemRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "PASTOR"
  | "WORKER"
  | "MEMBER"
  | "USER";

export interface RoleDefinition {
  id: string;
  name: string;
  label: string;
  description: string;
  /** Built-in system roles cannot be deleted. */
  system: boolean;
  permissions: Permission[];
  color: string;
}

// ─── Permission groups (drives the Roles page UI grid) ───────────────────────

export const PERMISSION_GROUPS: {
  label: string;
  permissions: { key: Permission; label: string }[];
}[] = [
  {
    label: "Core",
    permissions: [
      { key: "dashboard", label: "Dashboard" },
      { key: "activityLog", label: "Activity Log" },
      { key: "reports", label: "Reports & Export" },
      { key: "settings", label: "Settings" },
    ],
  },
  {
    label: "Financial",
    permissions: [
      { key: "orders", label: "Orders" },
      { key: "giving", label: "Giving / Offerings" },
    ],
  },
  {
    label: "Content",
    permissions: [
      { key: "sermons", label: "Sermons" },
      { key: "devotionals", label: "Devotionals & Words" },
      { key: "announcements", label: "Announcements" },
      { key: "events", label: "Events" },
      { key: "books", label: "Books / Store" },
      { key: "media", label: "Media Library" },
      { key: "advertisements", label: "Advertisements" },
      { key: "inAppPopups", label: "In-App Popups" },
    ],
  },
  {
    label: "Community",
    permissions: [
      { key: "testimonies", label: "Testimonies" },
      { key: "prayerRequests", label: "Prayer Requests" },
      { key: "groups", label: "Groups" },
      { key: "counseling", label: "Counseling" },
    ],
  },
  {
    label: "Engagement",
    permissions: [
      { key: "games", label: "Bible Games" },
      { key: "notifications", label: "Notifications" },
    ],
  },
  {
    label: "Administration",
    permissions: [{ key: "users", label: "User Management" }],
  },
];

export const ALL_PERMISSIONS: Permission[] = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.key)
);

// ─── System role definitions ──────────────────────────────────────────────────

export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: "super_admin",
    name: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full access to all features and settings.",
    system: true,
    color: "bg-red-100 text-red-800 border-red-200",
    permissions: ALL_PERMISSIONS,
  },
  {
    id: "admin",
    name: "ADMIN",
    label: "Admin",
    description: "Administrative access excluding system settings.",
    system: true,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    permissions: ALL_PERMISSIONS.filter((p) => p !== "settings"),
  },
  {
    id: "pastor",
    name: "PASTOR",
    label: "Pastor",
    description: "Access to content, community, counseling, and notifications.",
    system: true,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    permissions: [
      "dashboard",
      "sermons",
      "devotionals",
      "announcements",
      "events",
      "testimonies",
      "prayerRequests",
      "groups",
      "counseling",
      "giving",
      "reports",
      "notifications",
      "media",
    ],
  },
  {
    id: "worker",
    name: "WORKER",
    label: "Worker",
    description: "Limited access to content and community moderation.",
    system: true,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    permissions: [
      "dashboard",
      "announcements",
      "events",
      "testimonies",
      "prayerRequests",
      "groups",
      "media",
    ],
  },
  {
    id: "member",
    name: "MEMBER",
    label: "Member",
    description: "Read-only access to dashboard.",
    system: true,
    color: "bg-gray-100 text-gray-700 border-gray-200",
    permissions: ["dashboard"],
  },
];

// ─── Permission lookup ────────────────────────────────────────────────────────

/**
 * Returns the set of permissions granted to a given system role name.
 * Accepts any casing of the role string.
 * Falls back to `["dashboard"]` for unrecognised roles.
 */
export function getPermissionsForRole(role: string): Permission[] {
  const normalised = role.toUpperCase();
  const found = DEFAULT_ROLES.find((r) => r.name === normalised);
  return found ? found.permissions : ["dashboard"];
}
