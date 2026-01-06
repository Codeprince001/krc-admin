export const BOOKS_PAGE_SIZE = 10;

export const BOOK_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export const BOOK_FEATURED_OPTIONS = [
  { value: "all", label: "All" },
  { value: "featured", label: "Featured" },
  { value: "not-featured", label: "Not Featured" },
] as const;

export const BOOK_DIGITAL_OPTIONS = [
  { value: "all", label: "All" },
  { value: "digital", label: "Digital" },
  { value: "physical", label: "Physical" },
] as const;

