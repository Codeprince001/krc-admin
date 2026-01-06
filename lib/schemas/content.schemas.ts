import { z } from "zod";

// Book Schemas
export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0).optional(),
  isbn: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  stockQuantity: z.number().min(0, "Stock quantity must be positive"),
  isDigital: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type BookFormData = z.infer<typeof bookSchema>;

// Sermon Schemas
export const sermonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  speaker: z.string().min(3, "Speaker name is required"),
  category: z.enum(["SUNDAY_SERVICE", "BIBLE_STUDY", "PRAYER_MEETING", "SPECIAL_EVENT", "OTHER"]),
  bibleReference: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  audioUrl: z.string().url().optional().or(z.literal("")),
  thumbnail: z.string().url().optional().or(z.literal("")),
  duration: z.number().min(0).optional(),
  isFeatured: z.boolean().optional(),
});

export type SermonFormData = z.infer<typeof sermonSchema>;

// Devotional Schemas
export const devotionalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  bibleVerse: z.string().min(1, "Bible verse is required"),
  verseReference: z.string().min(1, "Verse reference is required"),
  date: z.string().min(1, "Date is required"),
  author: z.string().min(3, "Author name is required"),
  image: z.string().url().optional().or(z.literal("")),
  prayer: z.string().optional(),
});

export type DevotionalFormData = z.infer<typeof devotionalSchema>;

// Event Schemas
export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["SERVICE", "CONFERENCE", "WORKSHOP", "FELLOWSHIP", "OUTREACH", "OTHER"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().min(3, "Location is required"),
  image: z.string().url().optional().or(z.literal("")),
  requiresRegistration: z.boolean().optional(),
  maxAttendees: z.number().min(0).optional(),
  registrationFee: z.number().min(0).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

