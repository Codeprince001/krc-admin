"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { givingManagementService } from "@/lib/api/services/giving-management.service";
import type {
  GivingCategory,
  CreateGivingCategoryInput,
} from "@/types/api/giving-management.types";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function GivingCategoriesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GivingCategory | null>(null);
  const [form, setForm] = useState<CreateGivingCategoryInput>({
    name: "",
    slug: "",
    description: "",
    sortOrder: 0,
    isActive: true,
    isOthers: false,
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["giving-categories"],
    queryFn: () => givingManagementService.getCategories(false),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateGivingCategoryInput) =>
      givingManagementService.createCategory(data),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["giving-categories"] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateGivingCategoryInput }) =>
      givingManagementService.updateCategory(id, data),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["giving-categories"] });
      setDialogOpen(false);
      setEditing(null);
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => givingManagementService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["giving-categories"] });
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to delete"),
  });

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      sortOrder: 0,
      isActive: true,
      isOthers: false,
    });
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (c: GivingCategory) => {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      sortOrder: c.sortOrder,
      isActive: c.isActive,
      isOthers: c.isOthers,
    });
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((p) => ({
      ...p,
      name,
      slug: editing ? p.slug : slugify(name),
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Giving Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Admin-defined giving types (tithe, offerings, seed faith, etc.)
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No categories yet. Create one to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Others</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories
                  .sort((a, b) => (a as GivingCategory).sortOrder - (b as GivingCategory).sortOrder)
                  .map((c) => (
                    <TableRow key={(c as GivingCategory).id}>
                      <TableCell className="font-medium">{(c as GivingCategory).name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {(c as GivingCategory).slug}
                      </TableCell>
                      <TableCell>{(c as GivingCategory).sortOrder}</TableCell>
                      <TableCell>
                        {(c as GivingCategory).isActive ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {(c as GivingCategory).isOthers ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(c as GivingCategory)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("Delete this category?"))
                                deleteMutation.mutate((c as GivingCategory).id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Seed Faith"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="seed-faith"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Optional description"
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={form.sortOrder ?? 0}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    sortOrder: parseInt(e.target.value, 10) || 0,
                  }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive ?? true}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isActive: v }))
                }
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isOthers ?? false}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isOthers: v }))
                }
              />
              <Label>Others (custom title/reason)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
