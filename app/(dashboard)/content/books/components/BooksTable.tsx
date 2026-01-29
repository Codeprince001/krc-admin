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
import { Edit, Trash2, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { ResponsiveTableWrapper } from "@/components/shared/ResponsiveTableWrapper";
import type { Book } from "@/types";

interface BooksTableProps {
  books: Book[];
  isLoading?: boolean;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onView?: (book: Book) => void;
}

export function BooksTable({
  books,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
}: BooksTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading books...</p>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">No books found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Get started by adding your first book to the library.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveTableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[300px]">Title</TableHead>
            <TableHead className="min-w-[150px]">Author</TableHead>
            <TableHead className="min-w-[120px]">Category</TableHead>
            <TableHead className="text-right min-w-[100px]">Price</TableHead>
            <TableHead className="text-center min-w-[80px]">Stock</TableHead>
            <TableHead className="text-center min-w-[100px]">Status</TableHead>
            <TableHead className="text-right min-w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {book.coverImage && (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{book.title}</div>
                    {book.isbn && (
                      <div className="text-xs text-muted-foreground">ISBN: {book.isbn}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>
                <Badge variant="outline">{book.category?.name || "N/A"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-semibold">{formatCurrency(Number(book.price))}</span>
                  {book.discountPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(Number(book.discountPrice))}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={book.stockQuantity > 0 ? "default" : "destructive"}
                  className="font-mono"
                >
                  {book.stockQuantity}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col gap-1 items-center">
                  <Badge variant={book.isActive ? "default" : "secondary"}>
                    {book.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {book.isFeatured && (
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(book)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(book)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(book.id)}
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

