"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Info,
  Loader2,
  Search,
  Sparkles,
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
import { PermissionGuard } from "@/components/guards/PermissionGuard";
import { rolesService, type Role, type CreateRoleRequest } from "@/lib/api/services/roles.service";
import {
  type Permission,
  PERMISSION_GROUPS,
  ALL_PERMISSIONS,
} from "@/lib/permissions";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
      selected.includes(key)
        ? selected.filter((p) => p !== key)
        : [...selected, key]
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

function RoleCard({
  role,
  onEdit,
  onDelete,
  canEdit,
}: {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const perms = role.permissions ?? [];
  const validPerms = perms.filter((p) =>
    ALL_PERMISSIONS.includes(p as Permission)
  ) as Permission[];
  const previewPerms = validPerms.slice(0, 6);
  const remainingPerms = Math.max(validPerms.length - previewPerms.length, 0);
  const permissionCoverage = Math.round(
    (validPerms.length / ALL_PERMISSIONS.length) * 100
  );

  return (
    <Card className="group relative overflow-hidden border-border/60 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <CardHeader className="pb-3 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${role.color ?? "bg-gray-100 text-gray-800 border-gray-200"}`}
            >
              {role.slug}
            </span>
            <CardTitle className="text-base">{role.name}</CardTitle>
            {role.isSystem && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                System
              </Badge>
            )}
            {role.canAccessAdmin && (
              <Badge variant="secondary" className="text-xs">
                Admin access
              </Badge>
            )}
          </div>
          {canEdit && (
            <div className="flex gap-1 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => onEdit(role)}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              {!role.isSystem && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => onDelete(role.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
        <CardDescription className="text-xs mt-1">
          {role.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-md border bg-muted/40 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Permissions
            </p>
            <p className="text-sm font-semibold">
              {validPerms.length} / {ALL_PERMISSIONS.length}
            </p>
          </div>
          <div className="rounded-md border bg-muted/40 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Assigned Users
            </p>
            <p className="text-sm font-semibold">{role.userCount ?? 0}</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>Coverage</span>
            <span>{permissionCoverage}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${permissionCoverage}%` }}
            />
          </div>
        </div>

        {!expanded && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {previewPerms.map((perm) => (
              <Badge key={perm} variant="secondary" className="text-[11px]">
                {perm}
              </Badge>
            ))}
            {remainingPerms > 0 && (
              <Badge variant="outline" className="text-[11px]">
                +{remainingPerms} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide full permission matrix" : "View full permission matrix"}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 rounded-lg border p-3 bg-muted/20">
            <PermissionGrid selected={validPerms} disabled />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RoleFormDialog({
  open,
  onOpenChange,
  existing,
  onSave,
  isSaving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existing?: Role | null;
  onSave: (data: CreateRoleRequest) => void;
  isSaving: boolean;
}) {
  const isEditing = !!existing;
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(
    existing?.description ?? ""
  );
  const [canAccessAdmin, setCanAccessAdmin] = useState(
    existing?.canAccessAdmin ?? false
  );
  const [permissions, setPermissions] = useState<string[]>(
    existing?.permissions ?? ["dashboard"]
  );

  // Sync form state when dialog opens or existing role changes
  useEffect(() => {
    if (open) {
      if (existing) {
        setName(existing.name ?? "");
        setDescription(existing.description ?? "");
        setCanAccessAdmin(existing.canAccessAdmin ?? false);
        setPermissions(
          Array.isArray(existing.permissions) && existing.permissions.length > 0
            ? existing.permissions
            : ["dashboard"]
        );
      } else {
        setName("");
        setDescription("");
        setCanAccessAdmin(false);
        setPermissions(["dashboard"]);
      }
    }
  }, [open, existing]);

  const handleOpen = (v: boolean) => {
    onOpenChange(v);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const validPerms = permissions.filter((p) =>
      ALL_PERMISSIONS.includes(p as Permission)
    );
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      permissions: validPerms,
      canAccessAdmin,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Role" : "Create Custom Role"}
          </DialogTitle>
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
                placeholder="e.g., Content Creator"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-desc">Description</Label>
              <Input
                id="role-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="can-access-admin"
              checked={canAccessAdmin}
              onChange={(e) => setCanAccessAdmin(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <Label htmlFor="can-access-admin" className="cursor-pointer">
              Can access admin dashboard (users with this role can log in)
            </Label>
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
                  onClick={() => setPermissions([...ALL_PERMISSIONS])}
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
            <PermissionGrid
              selected={permissions as Permission[]}
              onChange={(p) => setPermissions(p)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RolesPageContent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesService.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create role"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRoleRequest> }) =>
      rolesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update role"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete role"),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSystemOnly, setShowSystemOnly] = useState(false);

  const handleSave = (data: CreateRoleRequest) => {
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data });
    } else {
      createMutation.mutate(data);
    }
    setEditingRole(null);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const role = roles.find((r) => r.id === id);
    if (role) setDeleteTarget(role);
  };

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredRoles = roles.filter((role) => {
    if (showSystemOnly && !role.isSystem) return false;
    if (!normalizedSearch) return true;
    const haystack = `${role.name} ${role.slug} ${role.description ?? ""}`.toLowerCase();
    return haystack.includes(normalizedSearch);
  });

  const totalUsers = roles.reduce((sum, role) => sum + (role.userCount ?? 0), 0);
  const systemRolesCount = roles.filter((r) => r.isSystem).length;
  const customRolesCount = Math.max(roles.length - systemRolesCount, 0);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background to-primary/5 p-5 sm:p-6">
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Roles &amp; Permissions
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Fine-grained access control for church administration.
            </p>
          </div>
          {isSuperAdmin && (
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
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Roles</p>
            <p className="text-2xl font-semibold">{roles.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">System Roles</p>
            <p className="text-2xl font-semibold">{systemRolesCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Custom Roles</p>
            <p className="text-2xl font-semibold">{customRolesCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Assigned Users</p>
            <p className="text-2xl font-semibold">{totalUsers}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-sky-300 bg-sky-100 dark:border-sky-700 dark:bg-sky-950/60 p-4 text-sm text-sky-900 dark:text-sky-200">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          <strong>System roles</strong> (MEMBER, WORKER, PASTOR, ADMIN,
          SUPER_ADMIN) are built-in. They can be edited, but cannot be deleted.{" "}
          {isSuperAdmin
            ? "You can create custom roles and edit role permissions."
            : "Only Super Admins can create or edit roles."}
        </p>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by role name, slug, or description..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showSystemOnly}
                  onChange={(e) => setShowSystemOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                Show only system roles
              </label>
              {(searchTerm || showSystemOnly) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setShowSystemOnly(false);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRoles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={isSuperAdmin}
          />
        ))}
      </div>
      {filteredRoles.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No roles match your filters</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try a different search term or clear active filters.
            </p>
          </CardContent>
        </Card>
      )}

      <RoleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        existing={editingRole}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete role"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? Users with this role must be reassigned first.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function RolesPage() {
  return (
    <PermissionGuard permission="settings">
      <RolesPageContent />
    </PermissionGuard>
  );
}
