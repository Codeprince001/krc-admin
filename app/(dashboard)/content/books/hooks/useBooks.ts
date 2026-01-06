import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { booksService } from "@/lib/api/services/books.service";
import { toast } from "sonner";
import type { Book, CreateBookRequest } from "@/types";

interface UseBooksParams {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  isFeatured?: boolean;
  isDigital?: boolean;
}

export function useBooks(params: UseBooksParams) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["books", params.page, params.limit, params.search, params.categoryId, params.isFeatured, params.isDigital],
    queryFn: () => booksService.getBooks(
      params.page,
      params.limit,
      params.search,
      params.categoryId,
      params.isFeatured,
      params.isDigital
    ),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateBookRequest) => booksService.createBook(data),
    onSuccess: () => {
      toast.success("Book created successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create book");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBookRequest> }) =>
      booksService.updateBook(id, data),
    onSuccess: () => {
      toast.success("Book updated successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update book");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => booksService.deleteBook(id),
    onSuccess: () => {
      toast.success("Book deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete book");
    },
  });

  return {
    books: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    createBook: createMutation.mutate,
    updateBook: updateMutation.mutate,
    deleteBook: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

