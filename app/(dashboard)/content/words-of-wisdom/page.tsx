"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/shared/Pagination";
import { useWordsOfWisdom } from "./hooks/useWordsOfWisdom";
import { WordsOfWisdomTable } from "./components/WordsOfWisdomTable";
import { WordsOfWisdomFilters } from "./components/WordsOfWisdomFilters";
import { WordOfWisdomFormDialog } from "./components/WordOfWisdomFormDialog";
import { WORDS_OF_WISDOM_PAGE_SIZE } from "./constants";
import type { WordOfWisdom, CreateWordOfWisdomRequest, UpdateWordOfWisdomRequest } from "@/types";

export default function WordsOfWisdomPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWordOfWisdom, setEditingWordOfWisdom] = useState<WordOfWisdom | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    wordsOfWisdom,
    pagination,
    isLoading,
    createWordOfWisdom,
    updateWordOfWisdom,
    deleteWordOfWisdom,
    isCreating,
    isUpdating,
    isDeleting,
  } = useWordsOfWisdom({
    page,
    limit: WORDS_OF_WISDOM_PAGE_SIZE,
    title: search || undefined,
  });

  const handleAdd = () => {
    setEditingWordOfWisdom(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (wordOfWisdom: WordOfWisdom) => {
    setEditingWordOfWisdom(wordOfWisdom);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => setDeleteTarget(id);

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteWordOfWisdom(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = (data: CreateWordOfWisdomRequest | UpdateWordOfWisdomRequest) => {
    const onSuccess = () => {
      setIsDialogOpen(false);
      setEditingWordOfWisdom(null);
      setPage(1);
    };
    if (editingWordOfWisdom) {
      updateWordOfWisdom({ id: editingWordOfWisdom.id, data }, { onSuccess });
    } else {
      createWordOfWisdom(data as CreateWordOfWisdomRequest, { onSuccess });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Words of Wisdom"
        description="Manage weekly words of wisdom to inspire your community"
        actions={
          <Button onClick={handleAdd} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Word of Wisdom
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Words of Wisdom</CardTitle>
            <WordsOfWisdomFilters
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <WordsOfWisdomTable
            wordsOfWisdom={wordsOfWisdom}
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
              pageSize={WORDS_OF_WISDOM_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      <WordOfWisdomFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        wordOfWisdom={editingWordOfWisdom}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete word of wisdom"
        description="Are you sure you want to delete this word of wisdom?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

