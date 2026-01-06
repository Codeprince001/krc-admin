"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { GivingCategory } from "@/types/api/giving.types";

interface GivingFiltersProps {
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const GIVING_CATEGORIES: { value: GivingCategory; label: string }[] = [
  { value: "OFFERING", label: "Offering" },
  { value: "TITHE", label: "Tithe" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "PROJECT", label: "Project" },
  { value: "SEED", label: "Seed" },
  { value: "SPECIAL", label: "Special" },
];

export function GivingFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: GivingFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search giving records..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {GIVING_CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

