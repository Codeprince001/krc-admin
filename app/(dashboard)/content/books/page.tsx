"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderTree } from "lucide-react";
import { useBooks } from "./hooks/useBooks";
import { BooksTable } from "./components/BooksTable";
import { BooksFilters } from "./components/BooksFilters";
import { BooksFormDialog } from "./components/BooksFormDialog";
import { BooksStats } from "./components/BooksStats";
import { Pagination } from "@/components/shared/Pagination";
import { BOOKS_PAGE_SIZE } from "./constants";
import type { Book, CreateBookRequest } from "@/types";

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const {
    books,
    meta,
    isLoading,
    createBook,
    updateBook,
    deleteBook,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBooks({
    page,
    limit: BOOKS_PAGE_SIZE,
    search: search || undefined,
  });

  const handleAdd = () => {
    setEditingBook(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      deleteBook(id);
    }
  };

  const handleSubmit = (data: CreateBookRequest) => {
    if (editingBook) {
      updateBook({ id: editingBook.id, data });
    } else {
      createBook(data);
    }
    setIsDialogOpen(false);
    setEditingBook(null);
  };

  // Calculate stats from books data
  const stats = {
    totalBooks: meta?.total || 0,
    totalRevenue: books.reduce((sum, book) => sum + Number(book.price) * book.soldCount, 0),
    totalStock: books.reduce((sum, book) => sum + book.stockQuantity, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground mt-1">
            Manage your book library and inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/content/books/categories">
            <Button variant="outline">
              <FolderTree className="mr-2 h-4 w-4" />
              Categories
            </Button>
          </Link>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Stats */}
      <BooksStats
        totalBooks={stats.totalBooks}
        totalRevenue={stats.totalRevenue}
        totalStock={stats.totalStock}
        isLoading={isLoading}
      />

      {/* Books Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Books</CardTitle>
            <BooksFilters
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <BooksTable
            books={books}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
              pageSize={BOOKS_PAGE_SIZE}
            />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <BooksFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        book={editingBook}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
