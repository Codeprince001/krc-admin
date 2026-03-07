"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type Permission =
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
  | "settings";

interface RoleDefinition {
  id: string;
  name: string;
  label: string;
  description: string;
  system: boolean; // built-in roles can't be deleted
  permissions: Permission[];
  color: string;
}

// ─── Permission metadata ──────────────────────────────────────────────────────

const PERMISSION_GROUPS: { label: string; permissions: { key: Permission; label: string }[] }[] = [
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
      { key: "devotionals", label: "Devotionals" },
      { key: "announcements", label: "Announcements" },
      { key: "events", label: "Events" },
      { key: "books", label: "Books / Store" },
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
    label: "Administration",
    permissions: [{ key: "users", label: "User Management" }],
  },
];

const ALL_PERMISSIONS: Permission[] = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.key)
);

// ─── Default system roles ─────────────────────────────────────────────────────

const DEFAULT_ROLES: RoleDefinition[] = [
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
    description: "Access to content, community, and counseling.",
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

function loadCustomRoles(): RoleDefinition[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("churchapp_custom_roles");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCustomRoles(roles: RoleDefinition[]) {
  localStorage.setItem("churchapp_custom_roles", JSON.stringify(roles));
}

// ─── Permission checkbox grid ─────────────────────────────────────────────────

function PermissionGrid({
  selected,
  onChange,
  disabled,
}: {
  selected: Permission[];
  onChange?: (perms: Permission[]) => void;
  disabled?: boolean;
}) {
  const toggle = (key: Permission) => {
    if (disabled || !onChange) return;
    onChange(
      selected.includes(key) ? selected.filter((p) => p !== key) : [...selected, key]
    );
  };

  return (
    <div className="space-y-4">
      {PERMISSION_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {group.label}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {group.permissions.map(({ key, label }) => {
              const checked = selected.includes(key);
              return (
                <label
                  key={key}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                    disabled
                      ? "cursor-default opacity-80"
                      : "cursor-pointer hover:bg-accent"
                  } ${checked ? "border-primary bg-primary/5" : "border-input"}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(key)}
                    disabled={disabled}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Role card ────────────────────────────────────────────────────────────────

function RoleCard({
  role,
  onEdit,
  onDelete,
}: {
  role: RoleDefinition;
  onEdit: (role: RoleDefinition) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${role.color}`}>
              {role.name}
            </span>
            <CardTitle className="text-base">{role.label}</CardTitle>
            {role.system && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                System
              </Badge>
            )}
          </div>
          {!role.system && (
            <div className="flex gap-1 shrink-0">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(role)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDelete(role.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="text-xs">{role.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">
            {role.permissions.length} / {ALL_PERMISSIONS.length} permissions
          </p>
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide" : "View"} permissions
          </button>
        </div>
        {expanded && (
          <PermissionGrid selected={role.permissions} disabled />
        )}
      </CardContent>
    </Card>
  );
}

// ─── Create/Edit dialog ───────────────────────────────────────────────────────

function RoleFormDialog({
  open,
  onOpenChange,
  existing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existing?: RoleDefinition | null;
  onSave: (role: Omit<RoleDefinition, "id" | "system" | "color">) => void;
}) {
  const isEditing = !!existing;
  const [name, setName] = useState(existing?.label ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [permissions, setPermissions] = useState<Permission[]>(
    existing?.permissions ?? ["dashboard"]
  );

  const handleOpen = (v: boolean) => {
    if (v && !existing) {
      setName("");
      setDescription("");
      setPermissions(["dashboard"]);
    }
    onOpenChange(v);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      label: name.trim(),
      name: name.trim().toUpperCase().replace(/\s+/g, "_"),
      description: description.trim(),
      permissions,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Create Custom Role"}</DialogTitle>
          <DialogDescription>
            Define a custom role and the sections it can access.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name *</Label>
              <Input
                id="role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Content Manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-desc">Description</Label>
              <Input
                id="role-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of this role"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Permissions</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPermissions(ALL_PERMISSIONS)}
                >
                  Select all
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPermissions(["dashboard"])}
                >
                  Clear
                </Button>
              </div>
            </div>
            <PermissionGrid selected={permissions} onChange={setPermissions} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isEditing ? "Save Changes" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RolesPage() {
  const [customRoles, setCustomRoles] = useState<RoleDefinition[]>(loadCustomRoles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);

  const allRoles = [...DEFAULT_ROLES, ...customRoles];

  const handleSave = (data: Omit<RoleDefinition, "id" | "system" | "color">) => {
    if (editingRole) {
      const updated = customRoles.map((r) =>
        r.id === editingRole.id ? { ...r, ...data } : r
      );
      setCustomRoles(updated);
      saveCustomRoles(updated);
    } else {
      const newRole: RoleDefinition = {
        id: `custom_${Date.now()}`,
        system: false,
        color: "bg-teal-100 text-teal-800 border-teal-200",
        ...data,
      };
      const updated = [...customRoles, newRole];
      setCustomRoles(updated);
      saveCustomRoles(updated);
    }
    setEditingRole(null);
  };

  const handleEdit = (role: RoleDefinition) => {
    setEditingRole(role);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = customRoles.filter((r) => r.id !== id);
    setCustomRoles(updated);
    saveCustomRoles(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Roles &amp; Permissions
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage role definitions and section access. Assign roles to users from the Users page.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRole(null);
            setDialogOpen(true);
          }}
          className="shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Role
        </Button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          <strong>System roles</strong> (MEMBER, WORKER, PASTOR, ADMIN, SUPER_ADMIN) are built-in
          and cannot be deleted. Custom roles are stored locally and serve as a reference for backend
          role configuration. Permissions are enforced server-side.
        </p>
      </div>

      {/* Role grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {allRoles.map((role) => (
          <RoleCard key={role.id} role={role} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {/* Form dialog */}
      <RoleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        existing={editingRole}
        onSave={handleSave}
      />
    </div>
  );
}
