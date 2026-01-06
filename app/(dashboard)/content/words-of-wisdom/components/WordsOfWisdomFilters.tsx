"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface WordsOfWisdomFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function WordsOfWisdomFilters({
  search,
  onSearchChange,
}: WordsOfWisdomFiltersProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search words of wisdom..."
        className="pl-9 w-64"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

