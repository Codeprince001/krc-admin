import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wordsOfWisdomService } from "@/lib/api/services/words-of-wisdom.service";
import { toast } from "sonner";
import type {
  WordOfWisdom,
  CreateWordOfWisdomRequest,
  UpdateWordOfWisdomRequest,
} from "@/types";

interface UseWordsOfWisdomParams {
  page: number;
  limit: number;
  title?: string;
  category?: string;
  weekOf?: string;
}

export function useWordsOfWisdom(params: UseWordsOfWisdomParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "wordsOfWisdom",
      params.page,
      params.limit,
      params.title,
      params.category,
      params.weekOf,
    ],
    queryFn: () =>
      wordsOfWisdomService.getWordsOfWisdom(
        params.page,
        params.limit,
        params.title,
        params.category,
        params.weekOf
      ),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateWordOfWisdomRequest) =>
      wordsOfWisdomService.createWordOfWisdom(data),
    onSuccess: async () => {
      toast.success("Word of wisdom created successfully");
      await queryClient.refetchQueries({ queryKey: ["wordsOfWisdom"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create word of wisdom");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateWordOfWisdomRequest;
    }) => wordsOfWisdomService.updateWordOfWisdom(id, data),
    onSuccess: async () => {
      toast.success("Word of wisdom updated successfully");
      await queryClient.refetchQueries({ queryKey: ["wordsOfWisdom"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update word of wisdom");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => wordsOfWisdomService.deleteWordOfWisdom(id),
    onSuccess: async () => {
      toast.success("Word of wisdom deleted successfully");
      await queryClient.refetchQueries({ queryKey: ["wordsOfWisdom"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete word of wisdom");
    },
  });

  return {
    wordsOfWisdom: data?.wordsOfWisdom || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    createWordOfWisdom: createMutation.mutate,
    updateWordOfWisdom: updateMutation.mutate,
    deleteWordOfWisdom: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useWordOfWisdom(id: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wordOfWisdom", id],
    queryFn: () => wordsOfWisdomService.getWordOfWisdomById(id),
    enabled: !!id,
  });

  return {
    wordOfWisdom: data,
    isLoading,
    error,
    refetch,
  };
}

export function useCurrentWeekWordOfWisdom() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wordOfWisdom", "current-week"],
    queryFn: () => wordsOfWisdomService.getCurrentWeek(),
  });

  return {
    wordOfWisdom: data,
    isLoading,
    error,
    refetch,
  };
}

