// Books
export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description?: string;
  categoryId: string;
  category?: BookCategory;
  price: number;
  discountPrice?: number;
  isbn?: string;
  coverImage?: string;
  previewPages?: string[];
  pdfUrl?: string;
  stockQuantity: number;
  soldCount: number;
  viewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  tags?: string[];
  publishedDate?: string;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookCategoryRequest {
  name: string;
  description?: string;
  image?: string;
  order?: number;
}

export interface UpdateBookCategoryRequest extends Partial<CreateBookCategoryRequest> {}

export interface CreateBookRequest {
  title: string;
  author: string;
  description?: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  isbn?: string;
  coverImage?: string;
  previewPages?: string[];
  pdfUrl?: string;
  stockQuantity: number;
  isDigital?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  publishedDate?: string;
  pageCount?: number;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {}

export interface BooksResponse {
  data: Book[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Sermons
export type SermonType = "SUNDAY_SERVICE" | "BIBLE_STUDY" | "PRAYER_MEETING" | "SPECIAL_EVENT" | "OTHER";

export interface Sermon {
  id: string;
  title: string;
  slug: string;
  description: string;
  speaker: string;
  category: SermonType;
  bibleReference?: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnail?: string;
  duration?: number;
  youtubeId?: string;
  facebookVideoId?: string;
  isLive: boolean;
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSermonRequest {
  title: string;
  description: string;
  speaker: string;
  category: SermonType;
  bibleReference?: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnail?: string;
  duration?: number;
  youtubeId?: string;
  facebookVideoId?: string;
  isLive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateSermonRequest extends Partial<CreateSermonRequest> {}

export interface SermonsResponse {
  data: Sermon[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Devotionals
export interface Devotional {
  id: string;
  title: string;
  slug: string;
  content: string;
  bibleVerse: string;
  verseReference: string;
  date: string;
  author: string;
  image?: string;
  prayer?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDevotionalRequest {
  title: string;
  content: string;
  bibleVerse: string;
  verseReference: string;
  date: string;
  author: string;
  image?: string;
  prayer?: string;
}

export interface UpdateDevotionalRequest extends Partial<CreateDevotionalRequest> {}

export interface DevotionalsResponse {
  data: Devotional[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Events
export type EventCategory = "SERVICE" | "CONFERENCE" | "WORKSHOP" | "FELLOWSHIP" | "OUTREACH" | "OTHER";
export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  requiresRegistration: boolean;
  maxAttendees?: number;
  registrationFee?: number;
  registeredCount: number;
  isFeatured: boolean;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  requiresRegistration?: boolean;
  maxAttendees?: number;
  registrationFee?: number;
  isFeatured?: boolean;
  status?: EventStatus;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface EventsResponse {
  data: Event[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Words of Wisdom
export interface WordOfWisdom {
  id: string;
  title: string;
  content: string;
  scripture?: string;
  imageUrl?: string;
  category?: string;
  weekOf: string;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateWordOfWisdomRequest {
  title: string;
  content: string;
  scripture?: string;
  image?: string;
  category?: string;
  weekOf: string;
}

export interface UpdateWordOfWisdomRequest extends Partial<CreateWordOfWisdomRequest> {}

export interface WordsOfWisdomResponse {
  wordsOfWisdom: WordOfWisdom[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Words of Knowledge
export interface WordOfKnowledge {
  id: string;
  title: string;
  content: string;
  scripture?: string;
  imageUrl?: string;
  category?: string;
  weekOf: string;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateWordOfKnowledgeRequest {
  title: string;
  content: string;
  scripture?: string;
  image?: string;
  category?: string;
  weekOf: string;
}

export interface UpdateWordOfKnowledgeRequest extends Partial<CreateWordOfKnowledgeRequest> {}

export interface WordsOfKnowledgeResponse {
  wordsOfKnowledge: WordOfKnowledge[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

