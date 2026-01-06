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
import { TESTIMONY_STATUSES } from "../constants";

interface TestimoniesFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function TestimoniesFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TestimoniesFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search testimonies..."
          className="pl-9 w-64"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {TESTIMONY_STATUSES.map((stat) => (
            <SelectItem key={stat.value} value={stat.value}>
              {stat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

