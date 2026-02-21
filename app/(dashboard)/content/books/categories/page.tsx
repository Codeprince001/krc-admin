"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useBookCategories } from "./hooks/useBookCategories";
import { CategoriesTable } from "./components/CategoriesTable";
import { CategoryFormDialog } from "./components/CategoryFormDialog";
import type {
  BookCategory,
  CreateBookCategoryRequest,
  UpdateBookCategoryRequest,
} from "@/types";

export default function BookCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BookCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBookCategories();

  const handleAdd = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: BookCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (
    data: CreateBookCategoryRequest | UpdateBookCategoryRequest
  ) => {
    const onSuccess = () => {
      setIsDialogOpen(false);
      setEditingCategory(null);
    };
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, data }, { onSuccess });
    } else {
      createCategory(data as CreateBookCategoryRequest, { onSuccess });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Book Categories"
        description="Organize your bookstore with categories to help users find books easily"
        actions={
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <CategoriesTable
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <CategoryFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
