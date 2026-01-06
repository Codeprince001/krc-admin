import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wordsOfKnowledgeService } from "@/lib/api/services/words-of-knowledge.service";
import { toast } from "sonner";
import type {
  WordOfKnowledge,
  CreateWordOfKnowledgeRequest,
  UpdateWordOfKnowledgeRequest,
} from "@/types";

interface UseWordsOfKnowledgeParams {
  page: number;
  limit: number;
  title?: string;
  category?: string;
  weekOf?: string;
}

export function useWordsOfKnowledge(params: UseWordsOfKnowledgeParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "wordsOfKnowledge",
      params.page,
      params.limit,
      params.title,
      params.category,
      params.weekOf,
    ],
    queryFn: () =>
      wordsOfKnowledgeService.getWordsOfKnowledge(
        params.page,
        params.limit,
        params.title,
        params.category,
        params.weekOf
      ),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateWordOfKnowledgeRequest) =>
      wordsOfKnowledgeService.createWordOfKnowledge(data),
    onSuccess: () => {
      toast.success("Word of knowledge created successfully");
      queryClient.invalidateQueries({ queryKey: ["wordsOfKnowledge"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create word of knowledge");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateWordOfKnowledgeRequest;
    }) => wordsOfKnowledgeService.updateWordOfKnowledge(id, data),
    onSuccess: () => {
      toast.success("Word of knowledge updated successfully");
      queryClient.invalidateQueries({ queryKey: ["wordsOfKnowledge"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update word of knowledge");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      wordsOfKnowledgeService.deleteWordOfKnowledge(id),
    onSuccess: () => {
      toast.success("Word of knowledge deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["wordsOfKnowledge"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete word of knowledge");
    },
  });

  return {
    wordsOfKnowledge: data?.wordsOfKnowledge || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    createWordOfKnowledge: createMutation.mutate,
    updateWordOfKnowledge: updateMutation.mutate,
    deleteWordOfKnowledge: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useWordOfKnowledge(id: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wordOfKnowledge", id],
    queryFn: () => wordsOfKnowledgeService.getWordOfKnowledgeById(id),
    enabled: !!id,
  });

  return {
    wordOfKnowledge: data,
    isLoading,
    error,
    refetch,
  };
}

export function useCurrentWeekWordOfKnowledge() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["wordOfKnowledge", "current-week"],
    queryFn: () => wordsOfKnowledgeService.getCurrentWeek(),
  });

  return {
    wordOfKnowledge: data,
    isLoading,
    error,
    refetch,
  };
}

