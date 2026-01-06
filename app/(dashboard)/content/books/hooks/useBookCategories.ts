import { useQuery } from "@tanstack/react-query";
import { booksService } from "@/lib/api/services/books.service";

export function useBookCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["book-categories"],
    queryFn: () => booksService.getCategories(),
  });

  return {
    categories: data || [],
    isLoading,
    error,
  };
}

