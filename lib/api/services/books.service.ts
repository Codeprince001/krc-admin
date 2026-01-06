import { apiClient } from "../client";
import { endpoints } from "../endpoints";
import type {
  Book,
  BooksResponse,
  CreateBookRequest,
  UpdateBookRequest,
  BookCategory,
  CreateBookCategoryRequest,
  UpdateBookCategoryRequest,
} from "@/types";

export const booksService = {
  async getBooks(
    page = 1,
    limit = 10,
    search?: string,
    categoryId?: string,
    isFeatured?: boolean,
    isDigital?: boolean
  ): Promise<BooksResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (categoryId) params.append("categoryId", categoryId);
    if (isFeatured !== undefined) params.append("isFeatured", String(isFeatured));
    if (isDigital !== undefined) params.append("isDigital", String(isDigital));
    const url = `${endpoints.books}?${params.toString()}`;
    return apiClient.get<BooksResponse>(url);
  },

  async getBookById(id: string): Promise<Book> {
    return apiClient.get<Book>(`${endpoints.books}/${id}`);
  },

  async createBook(data: CreateBookRequest): Promise<Book> {
    const response = await apiClient.post<{ message: string; book: Book }>(endpoints.books, data);
    // Backend returns { message, book }, unwrap it
    return (response as any).book || response;
  },

  async updateBook(id: string, data: UpdateBookRequest): Promise<Book> {
    return apiClient.put<Book>(`${endpoints.books}/${id}`, data);
  },

  async deleteBook(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.books}/${id}`);
  },

  async getCategories(): Promise<BookCategory[]> {
    return apiClient.get<BookCategory[]>(`${endpoints.books}/categories/list`);
  },

  async createCategory(data: CreateBookCategoryRequest): Promise<BookCategory> {
    const response = await apiClient.post<{ category: BookCategory }>(`${endpoints.books}/categories`, data);
    // Backend returns { message, category }, unwrap it
    return (response as any).category || response;
  },

  async updateCategory(id: string, data: UpdateBookCategoryRequest): Promise<BookCategory> {
    const response = await apiClient.put<{ category: BookCategory }>(`${endpoints.books}/categories/${id}`, data);
    return (response as any).category || response;
  },

  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete<void>(`${endpoints.books}/categories/${id}`);
  },
};

