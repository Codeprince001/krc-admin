"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  POPUP_CONTEXT_OPTIONS,
  POPUP_CTA_OPTIONS,
  POPUP_STATUS_OPTIONS,
  USER_ROLE_OPTIONS,
} from "../constants";
import { inAppPopupSchema, type InAppPopupFormData } from "../schemas";
import type {
  CreateInAppPopupRequest,
  InAppPopup,
  UpdateInAppPopupRequest,
} from "@/types";

interface InAppPopupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  popup?: InAppPopup | null;
  onSubmit: (data: CreateInAppPopupRequest | UpdateInAppPopupRequest) => void;
  isSubmitting?: boolean;
}

const defaultValues: InAppPopupFormData = {
  title: "",
  message: "",
  imageUrl: "",
  ctaType: "NONE",
  ctaLabel: "",
  ctaValue: "",
  status: "DRAFT",
  contexts: ["APP_OPEN"],
  priority: 0,
  targetAllUsers: true,
  targetRoles: [],
  startDate: "",
  endDate: "",
  minIntervalHours: 24,
  maxShowsPerDay: 1,
  maxShowsPerWeek: 2,
  maxShowsLifetimePerUser: 5,
  maxShowsPerSession: 1,
  delayAfterAppOpenSeconds: 5,
  dismissible: true,
  requireAction: false,
};

export function InAppPopupFormDialog({
  open,
  onOpenChange,
  popup,
  onSubmit,
  isSubmitting = false,
}: InAppPopupFormDialogProps) {
  const isEditing = !!popup;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InAppPopupFormData>({
    resolver: zodResolver(inAppPopupSchema),
    defaultValues,
  });

  const values = watch();

  useEffect(() => {
    if (!popup) {
      reset(defaultValues);
      return;
    }
    reset({
      title: popup.title,
      message: popup.message,
      imageUrl: popup.imageUrl ?? "",
      ctaType: popup.ctaType,
      ctaLabel: popup.ctaLabel ?? "",
      ctaValue: popup.ctaValue ?? "",
      status: popup.status,
      contexts: popup.contexts,
      priority: popup.priority,
      targetAllUsers: popup.targetAllUsers,
      targetRoles: popup.targetRoles,
      startDate: popup.startDate ? new Date(popup.startDate).toISOString().slice(0, 16) : "",
      endDate: popup.endDate ? new Date(popup.endDate).toISOString().slice(0, 16) : "",
      minIntervalHours: popup.minIntervalHours,
      maxShowsPerDay: popup.maxShowsPerDay,
      maxShowsPerWeek: popup.maxShowsPerWeek,
      maxShowsLifetimePerUser: popup.maxShowsLifetimePerUser,
      maxShowsPerSession: popup.maxShowsPerSession,
      delayAfterAppOpenSeconds: popup.delayAfterAppOpenSeconds,
      dismissible: popup.dismissible,
      requireAction: popup.requireAction,
    });
  }, [popup, reset]);

  const handleContextToggle = (value: InAppPopupFormData["contexts"][number], checked: boolean) => {
    const current = values.contexts ?? [];
    if (checked) {
      if (!current.includes(value)) setValue("contexts", [...current, value], { shouldValidate: true });
      return;
    }
    setValue(
      "contexts",
      current.filter((item) => item !== value),
      { shouldValidate: true }
    );
  };

  const handleRoleToggle = (value: InAppPopupFormData["targetRoles"][number], checked: boolean) => {
    const current = values.targetRoles ?? [];
    if (checked) {
      if (!current.includes(value)) setValue("targetRoles", [...current, value], { shouldValidate: true });
      return;
    }
    setValue(
      "targetRoles",
      current.filter((item) => item !== value),
      { shouldValidate: true }
    );
  };

  const submit = (data: InAppPopupFormData) => {
    onSubmit({
      ...data,
      imageUrl: data.imageUrl || undefined,
      ctaLabel: data.ctaLabel || undefined,
      ctaValue: data.ctaValue || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    });
  };

  const close = () => {
    reset(defaultValues);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit In-App Popup" : "Create In-App Popup"}</DialogTitle>
          <DialogDescription>
            Build a reminder popup with display controls so it appears at the right frequency.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={values.status} onValueChange={(v) => setValue("status", v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POPUP_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={4} {...register("message")} />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Image (optional)</Label>
            <ImageUpload
              value={values.imageUrl}
              onChange={(url) => setValue("imageUrl", url || "", { shouldValidate: true })}
              label="Upload popup image"
              context="in-app-popups"
            />
            {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>CTA Type</Label>
              <Select value={values.ctaType} onValueChange={(v) => setValue("ctaType", v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POPUP_CTA_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaLabel">CTA Label</Label>
              <Input id="ctaLabel" {...register("ctaLabel")} placeholder="e.g. View Event" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaValue">CTA Value</Label>
              <Input id="ctaValue" {...register("ctaValue")} placeholder="/events/123 or https://..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Display Contexts</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {POPUP_CONTEXT_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 rounded border p-2 text-sm">
                  <Checkbox
                    checked={values.contexts.includes(opt.value as any)}
                    onCheckedChange={(checked) =>
                      handleContextToggle(opt.value as any, Boolean(checked))
                    }
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            {errors.contexts && <p className="text-xs text-destructive">{errors.contexts.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={values.targetAllUsers}
                onCheckedChange={(checked) => setValue("targetAllUsers", Boolean(checked))}
              />
              <span>Target all users</span>
            </label>
            {!values.targetAllUsers && (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                {USER_ROLE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 rounded border p-2 text-xs">
                    <Checkbox
                      checked={values.targetRoles.includes(opt.value as any)}
                      onCheckedChange={(checked) =>
                        handleRoleToggle(opt.value as any, Boolean(checked))
                      }
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input id="startDate" type="datetime-local" {...register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" type="datetime-local" {...register("endDate")} />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input id="priority" type="number" min={0} {...register("priority")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="minIntervalHours">Cooldown (hours)</Label>
              <Input id="minIntervalHours" type="number" min={0} {...register("minIntervalHours")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxShowsPerDay">Max/day</Label>
              <Input id="maxShowsPerDay" type="number" min={0} {...register("maxShowsPerDay")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxShowsPerWeek">Max/week</Label>
              <Input id="maxShowsPerWeek" type="number" min={0} {...register("maxShowsPerWeek")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxShowsLifetimePerUser">Max/lifetime</Label>
              <Input
                id="maxShowsLifetimePerUser"
                type="number"
                min={0}
                {...register("maxShowsLifetimePerUser")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxShowsPerSession">Max/session</Label>
              <Input id="maxShowsPerSession" type="number" min={0} {...register("maxShowsPerSession")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delayAfterAppOpenSeconds">Delay after open (s)</Label>
              <Input
                id="delayAfterAppOpenSeconds"
                type="number"
                min={0}
                {...register("delayAfterAppOpenSeconds")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={values.dismissible}
                onCheckedChange={(checked) => setValue("dismissible", Boolean(checked))}
              />
              <span>User can dismiss popup</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={values.requireAction}
                onCheckedChange={(checked) => setValue("requireAction", Boolean(checked))}
              />
              <span>Require action before close</span>
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Popup" : "Create Popup"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
