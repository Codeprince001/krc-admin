import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { booksService } from "@/lib/api/services/books.service";
import { toast } from "sonner";
import type {
  BookCategory,
  CreateBookCategoryRequest,
  UpdateBookCategoryRequest,
} from "@/types";

export function useBookCategories() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["book-categories"],
    queryFn: () => booksService.getCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateBookCategoryRequest) => booksService.createCategory(data),
    onSuccess: async () => {
      toast.success("Category created successfully");
      await queryClient.refetchQueries({ queryKey: ["book-categories"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookCategoryRequest }) =>
      booksService.updateCategory(id, data),
    onSuccess: async () => {
      toast.success("Category updated successfully");
      await queryClient.refetchQueries({ queryKey: ["book-categories"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => booksService.deleteCategory(id),
    onSuccess: async () => {
      toast.success("Category deleted successfully");
      await queryClient.refetchQueries({ queryKey: ["book-categories"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  return {
    categories: data || [],
    isLoading,
    error,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

