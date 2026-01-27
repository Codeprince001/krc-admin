"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNSELING_STATUSES, COUNSELING_CATEGORIES } from "../constants";

interface CounselingFiltersProps {
  status: string;
  category: string;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function CounselingFilters({
  status,
  category,
  onStatusChange,
  onCategoryChange,
}: CounselingFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {COUNSELING_STATUSES.map((stat) => (
            <SelectItem key={stat.value} value={stat.value}>
              {stat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {COUNSELING_CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
