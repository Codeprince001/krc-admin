"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsService } from "@/lib/api/services/groups.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import type {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
} from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageUpload } from "@/components/ui/image-upload";

const groupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200, "Name must be less than 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description must be less than 2000 characters"),
  type: z.enum(["YOUTH", "WOMEN", "MEN", "CHOIR", "WORKERS", "USHERS", "PROTOCOL", "MEDIA", "OTHER"]),
  coverImage: z.string().url().optional().or(z.literal("")),
});

type GroupFormData = z.infer<typeof groupSchema>;

const GROUP_CATEGORIES = [
  "YOUTH",
  "WOMEN",
  "MEN",
  "CHOIR",
  "WORKERS",
  "USHERS",
  "PROTOCOL",
  "MEDIA",
  "OTHER",
];

export default function GroupsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["groups", page, limit, search],
    queryFn: () => groupsService.getGroups(page, limit, search || undefined),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
  });

  const imageValue = watch("coverImage");

  const createMutation = useMutation({
    mutationFn: (data: CreateGroupRequest) =>
      groupsService.createGroup(data),
    onSuccess: async () => {
      toast.success("Group created successfully");
      await queryClient.refetchQueries({ queryKey: ["groups"] });
      setIsDialogOpen(false);
      reset();
      setPage(1);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create group");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateGroupRequest;
    }) => groupsService.updateGroup(id, data),
    onSuccess: () => {
      toast.success("Group updated successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsDialogOpen(false);
      setEditingGroup(null);
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update group");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => groupsService.deleteGroup(id),
    onSuccess: async () => {
      toast.success("Group deleted successfully");
      await queryClient.refetchQueries({ queryKey: ["groups"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete group");
    },
  });

  const onSubmit = (data: GroupFormData) => {
    const submitData: CreateGroupRequest = {
      name: data.name,
      description: data.description,
      type: data.type,
      coverImage: data.coverImage || undefined,
    };
    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setValue("name", group.name);
    setValue("description", group.description || "");
    setValue("type", (group.category as any) || "OTHER");
    setValue("coverImage", group.image || "");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this group?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    setEditingGroup(null);
    reset();
    setIsDialogOpen(true);
  };

  const groups = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage church groups</p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Groups</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                className="pl-8 w-full"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg border border-border bg-white">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Name</TableHead>
                        <TableHead className="min-w-[120px]">Category</TableHead>
                        <TableHead className="min-w-[100px]">Members</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">Created</TableHead>
                        <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                <TableBody>
                  {groups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No groups found
                      </TableCell>
                    </TableRow>
                  ) : (
                    groups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">
                          {group.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{group.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {group.memberCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={group.isActive ? "default" : "secondary"}
                          >
                            {group.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(group.createdAt, "PP")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(group)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(group.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                  </Table>
                </div>
              </div>
              {meta && meta.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {meta.page} of {meta.totalPages}
                  </p>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex-1 sm:flex-none"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(meta.totalPages, p + 1))
                      }
                      disabled={page === meta.totalPages}
                      className="flex-1 sm:flex-none"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? "Edit Group" : "Add New Group"}
            </DialogTitle>
            <DialogDescription>
              {editingGroup
                ? "Update the group information below."
                : "Fill in the details to add a new group."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Group name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Group description"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <select
                id="type"
                {...register("type")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {GROUP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-sm text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>

            <ImageUpload
              value={imageValue}
              onChange={(url) => setValue("coverImage", url || "")}
              label="Cover Image"
              context="groups"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  reset();
                  setEditingGroup(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingGroup ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
