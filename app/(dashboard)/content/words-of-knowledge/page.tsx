"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { useWordsOfKnowledge } from "./hooks/useWordsOfKnowledge";
import { WordsOfKnowledgeTable } from "./components/WordsOfKnowledgeTable";
import { WordsOfKnowledgeFilters } from "./components/WordsOfKnowledgeFilters";
import { WordOfKnowledgeFormDialog } from "./components/WordOfKnowledgeFormDialog";
import { WORDS_OF_KNOWLEDGE_PAGE_SIZE } from "./constants";
import type { WordOfKnowledge, CreateWordOfKnowledgeRequest, UpdateWordOfKnowledgeRequest } from "@/types";

export default function WordsOfKnowledgePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWordOfKnowledge, setEditingWordOfKnowledge] = useState<WordOfKnowledge | null>(null);

  const {
    wordsOfKnowledge,
    pagination,
    isLoading,
    createWordOfKnowledge,
    updateWordOfKnowledge,
    deleteWordOfKnowledge,
    isCreating,
    isUpdating,
    isDeleting,
  } = useWordsOfKnowledge({
    page,
    limit: WORDS_OF_KNOWLEDGE_PAGE_SIZE,
    title: search || undefined,
  });

  const handleAdd = () => {
    setEditingWordOfKnowledge(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (wordOfKnowledge: WordOfKnowledge) => {
    setEditingWordOfKnowledge(wordOfKnowledge);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this word of knowledge?")) {
      deleteWordOfKnowledge(id);
    }
  };

  const handleSubmit = (data: CreateWordOfKnowledgeRequest | UpdateWordOfKnowledgeRequest) => {
    if (editingWordOfKnowledge) {
      updateWordOfKnowledge({ id: editingWordOfKnowledge.id, data });
    } else {
      createWordOfKnowledge(data as CreateWordOfKnowledgeRequest);
    }
    setIsDialogOpen(false);
    setEditingWordOfKnowledge(null);
    setPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Words of Knowledge"
        description="Manage weekly words of knowledge to inspire your community"
        actions={
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Word of Knowledge
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Words of Knowledge</CardTitle>
            <WordsOfKnowledgeFilters
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <WordsOfKnowledgeTable
            wordsOfKnowledge={wordsOfKnowledge}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={setPage}
              pageSize={WORDS_OF_KNOWLEDGE_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      <WordOfKnowledgeFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        wordOfKnowledge={editingWordOfKnowledge}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}

