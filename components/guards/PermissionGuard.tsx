"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getPermissionsForRole } from "@/lib/permissions";
import { AccessDenied } from "@/components/ui/AccessDenied";
import type { Permission } from "@/lib/permissions";

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
}

/**
 * Renders `children` when the authenticated user has `permission`.
 * Uses profile.permissions from API when available; falls back to role-based lookup.
 * Shows a full-page access-denied screen otherwise.
 *
 * The sidebar remains visible at all times; this guard only controls the
 * main content area of each page.
 */
export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const apiPermissions = user?.permissions;
  const permissions =
    Array.isArray(apiPermissions) && apiPermissions.length > 0
      ? apiPermissions
      : getPermissionsForRole(user?.role ?? "");
  const canAccess = permissions.includes(permission);

  if (!canAccess) {
    return <AccessDenied permission={permission} />;
  }

  return <>{children}</>;
}
