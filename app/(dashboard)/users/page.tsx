"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/lib/api/services/users.service";
import { rolesService } from "@/lib/api/services/roles.service";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, FileDown } from "lucide-react";
import Link from "next/link";
import { downloadExcel } from "@/lib/utils/exportExcel";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import { Pagination } from "@/components/shared/Pagination";
import { PermissionGuard } from "@/components/guards/PermissionGuard";

function UsersPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const limit = 10;

  // Debounce search input with 500ms delay
  const debouncedSearch = useDebounce(search, 500);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleId]);

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesService.list(),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, limit, debouncedSearch, roleId],
    queryFn: () =>
      usersService.getUsers(page, limit, debouncedSearch || undefined, roleId || undefined),
  });

  // Debug logging to see what we're getting
  if (process.env.NODE_ENV === 'development') {
    if (data) console.log('Users response:', data);
    if (error) console.error('Users error:', error);
  }

  const users = data?.data || [];
  const meta = data?.meta;

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await usersService.exportUsers(1, 10000, debouncedSearch || undefined, roleId || undefined);
      const list = res?.data || [];
      const rows = list.map((u) => ({
        Name: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : "N/A",
        Email: u.email,
        Role: u.role,
        Status: u.isActive ? "Active" : "Inactive",
        Phone: u.phone ?? "",
        "Created At": formatDate(u.createdAt, "yyyy-MM-dd HH:mm"),
      }));
      downloadExcel(rows, `users-export-${new Date().toISOString().slice(0, 10)}`, "Users");
      toast.success(`Exported ${rows.length} users`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage users and their permissions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Export Excel
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/users/new">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Users</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
              <Select value={roleId || "all"} onValueChange={(v) => setRoleId(v === "all" ? "" : v)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-destructive mb-2">Error loading users</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          ) : (
            <>
              <ResponsiveTableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Name</TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead className="min-w-[100px]">Role</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Created</TableHead>
                      <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstName && user.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.isActive ? "default" : "secondary"}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(user.createdAt, "PP")}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/users/${user.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ResponsiveTableWrapper>
              {meta && meta.totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={meta.totalPages}
                  total={meta.total}
                  onPageChange={setPage}
                  pageSize={limit}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function UsersPage() {
  return (
    <PermissionGuard permission="users">
      <UsersPageContent />
    </PermissionGuard>
  );
}
