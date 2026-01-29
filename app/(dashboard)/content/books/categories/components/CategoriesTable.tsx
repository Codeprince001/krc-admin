"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FolderTree } from "lucide-react";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import type { BookCategory } from "@/types";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";

interface CategoriesTableProps {
  categories: BookCategory[];
  isLoading?: boolean;
  onEdit: (category: BookCategory) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function CategoriesTable({
  categories,
  isLoading = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: CategoriesTableProps) {
  if (isLoading) {
    return <LoadingState message="Loading categories..." />;
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={FolderTree}
        title="No categories found"
        description="Get started by creating your first book category to organize your bookstore."
      />
    );
  }

  return (
    <ResponsiveTableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Category</TableHead>
            <TableHead className="min-w-[250px]">Description</TableHead>
            <TableHead className="text-center min-w-[80px]">Order</TableHead>
            <TableHead className="text-center min-w-[100px]">Status</TableHead>
            <TableHead className="text-right min-w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div className="font-semibold">{category.name}</div>
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {category.description || "No description"}
                </p>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="font-mono">
                  {category.order}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(category.id)}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ResponsiveTableWrapper>
  );
}

