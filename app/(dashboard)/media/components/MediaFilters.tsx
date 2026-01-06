"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MediaType } from "@/types/api/media.types";

interface MediaFiltersProps {
  type: string;
  onTypeChange: (value: string) => void;
}

const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: "IMAGE", label: "Images" },
  { value: "VIDEO", label: "Videos" },
  { value: "AUDIO", label: "Audio" },
  { value: "DOCUMENT", label: "Documents" },
  { value: "OTHER", label: "Other" },
];

export function MediaFilters({ type, onTypeChange }: MediaFiltersProps) {
  return (
    <Select value={type} onValueChange={onTypeChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        {MEDIA_TYPES.map((mediaType) => (
          <SelectItem key={mediaType.value} value={mediaType.value}>
            {mediaType.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

