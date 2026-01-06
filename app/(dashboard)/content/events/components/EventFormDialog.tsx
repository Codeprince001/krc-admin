"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2 } from "lucide-react";
import { eventSchema, type EventFormData } from "../schemas";
import { EVENT_CATEGORIES, EVENT_STATUSES } from "../constants";
import type { Event, CreateEventRequest, UpdateEventRequest } from "@/types";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event | null;
  onSubmit: (data: CreateEventRequest | UpdateEventRequest) => void;
  isSubmitting?: boolean;
}

export function EventFormDialog({
  open,
  onOpenChange,
  event,
  onSubmit,
  isSubmitting = false,
}: EventFormDialogProps) {
  const isEditing = !!event;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      requiresRegistration: false,
      isFeatured: false,
    },
  });

  const imageValue = watch("image");
  const categoryValue = watch("category");
  const statusValue = watch("status");

  useEffect(() => {
    if (event) {
      setValue("title", event.title);
      setValue("description", event.description);
      setValue("category", event.category);
      setValue("startDate", event.startDate.split("T")[0]);
      setValue("endDate", event.endDate.split("T")[0]);
      setValue("location", event.location);
      setValue("image", event.image || "");
      setValue("requiresRegistration", event.requiresRegistration);
      setValue("maxAttendees", event.maxAttendees);
      setValue("registrationFee", event.registrationFee);
      setValue("isFeatured", event.isFeatured);
      setValue("status", event.status);
    } else {
      reset({
        requiresRegistration: false,
        isFeatured: false,
      });
    }
  }, [event, setValue, reset]);

  const handleFormSubmit = (data: EventFormData) => {
    onSubmit({
      title: data.title,
      description: data.description,
      category: data.category,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      image: data.image || undefined,
      requiresRegistration: data.requiresRegistration,
      maxAttendees: data.maxAttendees,
      registrationFee: data.registrationFee,
      isFeatured: data.isFeatured,
      status: data.status,
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the event information below."
              : "Create a new event to engage with your community."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter event title"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={categoryValue}
                  onValueChange={(value) => setValue("category", value as any)}
                >
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter event description"
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Event Image</Label>
              <ImageUpload
                value={imageValue}
                onChange={(url) => setValue("image", url || "")}
                label="Upload event image"
                context="events"
              />
            </div>
          </div>

          {/* Date & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Date & Location</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className={errors.startDate ? "border-destructive" : ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className={errors.endDate ? "border-destructive" : ""}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Enter location"
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Registration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Registration</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("requiresRegistration")}
                  className="h-4 w-4 rounded border-input cursor-pointer accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                  Requires Registration
                </span>
              </label>
              {watch("requiresRegistration") && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      min="0"
                      {...register("maxAttendees", { valueAsNumber: true })}
                      placeholder="Unlimited"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationFee">Registration Fee</Label>
                    <Input
                      id="registrationFee"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register("registrationFee", { valueAsNumber: true })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(value) => setValue("status", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_STATUSES.map((stat) => (
                      <SelectItem key={stat.value} value={stat.value}>
                        {stat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Features</Label>
                <label className="flex items-center gap-2 cursor-pointer group mt-2">
                  <input
                    type="checkbox"
                    {...register("isFeatured")}
                    className="h-4 w-4 rounded border-input cursor-pointer accent-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                    Featured Event
                  </span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

