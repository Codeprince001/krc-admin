"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, Target } from "lucide-react";
import { toast } from "sonner";
import { givingManagementService } from "@/lib/api/services/giving-management.service";
import type {
  GivingCampaign,
  CreateGivingCampaignInput,
  UpdateGivingCampaignInput,
} from "@/types/api/giving-management.types";

function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function GivingCampaignsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GivingCampaign | null>(null);
  const [form, setForm] = useState<CreateGivingCampaignInput>({
    name: "",
    slug: "",
    description: "",
    targetAmount: 0,
    startDate: "",
    endDate: "",
    currency: "NGN",
    sortOrder: 0,
    isActive: true,
    status: "ACTIVE",
  });

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["giving-campaigns"],
    queryFn: () => givingManagementService.getCampaigns(false),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateGivingCampaignInput) =>
      givingManagementService.createCampaign(data),
    onSuccess: () => {
      toast.success("Campaign created");
      queryClient.invalidateQueries({ queryKey: ["giving-campaigns"] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateGivingCampaignInput;
    }) => givingManagementService.updateCampaign(id, data),
    onSuccess: () => {
      toast.success("Campaign updated");
      queryClient.invalidateQueries({ queryKey: ["giving-campaigns"] });
      setDialogOpen(false);
      setEditing(null);
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => givingManagementService.deleteCampaign(id),
    onSuccess: () => {
      toast.success("Campaign deleted");
      queryClient.invalidateQueries({ queryKey: ["giving-campaigns"] });
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to delete"),
  });

  const resetForm = () => {
    const today = new Date().toISOString().slice(0, 10);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setForm({
      name: "",
      slug: "",
      description: "",
      targetAmount: 0,
      startDate: today,
      endDate: nextMonth.toISOString().slice(0, 10),
      currency: "NGN",
      sortOrder: 0,
      isActive: true,
      status: "ACTIVE",
    });
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (c: GivingCampaign) => {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      targetAmount: c.targetAmount,
      startDate: c.startDate.slice(0, 10),
      endDate: c.endDate.slice(0, 10),
      currency: c.currency,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
      status: c.status,
    });
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((p) => ({
      ...p,
      name,
      slug: editing ? p.slug : slugify(name),
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.targetAmount || form.targetAmount <= 0) {
      toast.error("Target amount must be positive");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Start and end dates are required");
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Giving Campaigns
          </h1>
          <p className="text-sm text-muted-foreground">
            Time-bound fundraising goals with progress tracking
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No campaigns yet. Create a campaign to start fundraising.
            </p>
            <Button onClick={openCreate}>Create Campaign</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(campaigns as GivingCampaign[]).map((c) => (
            <Card key={c.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{c.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(c)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Delete this campaign?"))
                        deleteMutation.mutate(c.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Raised</span>
                    <span>
                      {formatCurrency(c.raised ?? 0, c.currency)} /{" "}
                      {formatCurrency(c.targetAmount, c.currency)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, c.progress ?? 0)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(c.startDate).toLocaleDateString()} -{" "}
                      {new Date(c.endDate).toLocaleDateString()}
                    </span>
                    <span>{c.transactionCount ?? 0} transactions</span>
                  </div>
                  <span
                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                      c.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : c.status === "COMPLETED"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Campaign" : "New Campaign"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Building Fund"
              />
            </div>
            <div>
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                min={1}
                value={form.targetAmount || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    targetAmount: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="10000000"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, endDate: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((p) => ({ ...p, status: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
