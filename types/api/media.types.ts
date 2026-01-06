// Media Types
export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "OTHER";

export interface Media {
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
  filename: string;
  originalName: string;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaResponse {
  data: Media[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MediaStats {
  totalMedia: number;
  mediaByType: {
    type: MediaType;
    _count: number;
  }[];
  totalSize: number;
}

export interface QueryMediaParams {
  page?: number;
  limit?: number;
  type?: MediaType;
}

