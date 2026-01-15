"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { usersService } from "@/lib/api/services/users.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserRoleSchema, type UpdateUserRoleInput } from "@/lib/utils/validations";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", resolvedParams.id],
    queryFn: () => usersService.getUserById(resolvedParams.id),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: () => usersService.toggleUserStatus(resolvedParams.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated");
    },
    onError: (error: any) => {
      const message = typeof error?.message === 'string' ? error.message : "Failed to update user status";
      toast.error(message);
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: UpdateUserRoleInput) =>
      usersService.updateUserRole(resolvedParams.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", resolvedParams.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated");
    },
    onError: (error: any) => {
      const message = typeof error?.message === 'string' ? error.message : "Failed to update user role";
      toast.error(message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserRoleInput>({
    resolver: zodResolver(updateUserRoleSchema),
    defaultValues: {
      role: user?.role || "USER",
    },
  });

  const onSubmit = (data: UpdateUserRoleInput) => {
    updateRoleMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">
            View and manage user information
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <p className="text-sm font-medium">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p className="text-sm font-medium">{user.phone || "N/A"}</p>
            </div>
            <div>
              <Label>Role</Label>
              <div className="mt-1">
                <Badge variant="outline">{user.role}</Badge>
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <div className="mt-1">
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <Label>Created At</Label>
              <p className="text-sm font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="role">Update Role</Label>
                <select
                  id="role"
                  {...register("role")}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={updateRoleMutation.isPending}
                className="w-full"
              >
                {updateRoleMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Role"
                )}
              </Button>
            </form>

            <Button
              variant="outline"
              onClick={() => toggleStatusMutation.mutate()}
              disabled={toggleStatusMutation.isPending}
              className="w-full"
            >
              {toggleStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                `Mark as ${user.isActive ? "Inactive" : "Active"}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

