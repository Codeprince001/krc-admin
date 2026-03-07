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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2, ExternalLink } from "lucide-react";
import { advertisementSchema, type AdvertisementFormData } from "../schemas";
import { AD_STATUS_OPTIONS, AD_PLACEMENT_OPTIONS } from "../constants";
import type { Advertisement, CreateAdvertisementRequest, UpdateAdvertisementRequest } from "@/types";

interface AdvertisementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertisement?: Advertisement | null;
  onSubmit: (data: CreateAdvertisementRequest | UpdateAdvertisementRequest) => void;
  isSubmitting?: boolean;
}

export function AdvertisementFormDialog({
  open,
  onOpenChange,
  advertisement,
  onSubmit,
  isSubmitting = false,
}: AdvertisementFormDialogProps) {
  const isEditing = !!advertisement;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AdvertisementFormData>({
    resolver: zodResolver(advertisementSchema),
    defaultValues: {
      status: "DRAFT",
      placement: "HOME_BANNER",
      priority: 0,
    },
  });

  const statusValue = watch("status");
  const placementValue = watch("placement");
  const imageUrlValue = watch("imageUrl");
  const targetUrlValue = watch("targetUrl");

  useEffect(() => {
    if (advertisement) {
      setValue("title", advertisement.title);
      setValue("brandName", advertisement.brandName);
      setValue("imageUrl", advertisement.imageUrl);
      setValue("targetUrl", advertisement.targetUrl);
      setValue("status", advertisement.status);
      setValue("placement", advertisement.placement);
      setValue("priority", advertisement.priority ?? 0);
      setValue(
        "startDate",
        advertisement.startDate
          ? new Date(advertisement.startDate).toISOString().slice(0, 16)
          : undefined
      );
      setValue(
        "endDate",
        advertisement.endDate
          ? new Date(advertisement.endDate).toISOString().slice(0, 16)
          : undefined
      );
    } else {
      reset({ status: "DRAFT", placement: "HOME_BANNER", priority: 0 });
    }
  }, [advertisement, setValue, reset]);

  const handleFormSubmit = (data: AdvertisementFormData) => {
    onSubmit({
      title: data.title,
      brandName: data.brandName,
      imageUrl: data.imageUrl,
      targetUrl: data.targetUrl,
      status: data.status,
      placement: data.placement,
      priority: data.priority,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Advertisement" : "Create Advertisement"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the advertisement details below."
              : "Add a new banner advertisement that links to a brand's website."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Title + Brand Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Ad Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g. Summer Sale 2026"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandName">
                Brand Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="brandName"
                {...register("brandName")}
                placeholder="e.g. Domino's Pizza"
                className={errors.brandName ? "border-destructive" : ""}
              />
              {errors.brandName && (
                <p className="text-xs text-destructive">{errors.brandName.message}</p>
              )}
            </div>
          </div>

          {/* Target URL */}
          <div className="space-y-2">
            <Label htmlFor="targetUrl">
              Destination URL <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="targetUrl"
                {...register("targetUrl")}
                placeholder="https://brand-website.com/campaign"
                className={errors.targetUrl ? "border-destructive pl-8" : "pl-8"}
              />
              <ExternalLink className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
            {errors.targetUrl && (
              <p className="text-xs text-destructive">{errors.targetUrl.message}</p>
            )}
            {targetUrlValue && !errors.targetUrl && (
              <a
                href={targetUrlValue}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Preview link
              </a>
            )}
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <Label>
              Banner Image <span className="text-destructive">*</span>
            </Label>
            <ImageUpload
              value={imageUrlValue}
              onChange={(url) => setValue("imageUrl", url || "", { shouldValidate: true })}
              label="Upload banner image (recommended: 1200×400)"
              context="advertisements"
            />
            {errors.imageUrl && (
              <p className="text-xs text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Status + Placement */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusValue}
                onValueChange={(v) => setValue("status", v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {AD_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Placement</Label>
              <Select
                value={placementValue}
                onValueChange={(v) => setValue("placement", v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
                <SelectContent>
                  {AD_PLACEMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                {...register("startDate")}
              />
              <p className="text-xs text-muted-foreground">Leave blank to show immediately</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...register("endDate")}
                className={errors.endDate ? "border-destructive" : ""}
              />
              {errors.endDate && (
                <p className="text-xs text-destructive">{errors.endDate.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Leave blank to run indefinitely</p>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Display Priority</Label>
            <Input
              id="priority"
              type="number"
              min={0}
              {...register("priority")}
              placeholder="0"
              className="w-32"
            />
            <p className="text-xs text-muted-foreground">
              Higher value = shown first. Use 0 for default order.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Advertisement" : "Create Advertisement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
