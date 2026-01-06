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
import type { OrderStatus, DeliveryType } from "@/types/api/orders.types";

interface OrderFiltersProps {
  search: string;
  status: string;
  deliveryType: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDeliveryTypeChange: (value: string) => void;
}

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "READY", label: "Ready" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
];

const DELIVERY_TYPES: { value: DeliveryType; label: string }[] = [
  { value: "PICKUP", label: "Pickup" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "HOME_DELIVERY", label: "Home Delivery" },
];

export function OrderFilters({
  search,
  status,
  deliveryType,
  onSearchChange,
  onStatusChange,
  onDeliveryTypeChange,
}: OrderFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          className="pl-8"
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
          {ORDER_STATUSES.map((statusOption) => (
            <SelectItem key={statusOption.value} value={statusOption.value}>
              {statusOption.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={deliveryType} onValueChange={onDeliveryTypeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {DELIVERY_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

