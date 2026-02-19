"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emailTemplatesService, EmailTemplate, EmailTemplateType } from "@/lib/api/services/email-templates.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Edit2, RotateCcw, Eye, Check, X } from "lucide-react";
import { toast } from "sonner";
import { EmailTemplateEditorDialog } from "./components/EmailTemplateEditorDialog";
import { EmailPreviewDialog } from "./components/EmailPreviewDialog";

const TYPE_ICONS: Record<string, string> = {
  WELCOME: "👋",
  ORDER_CONFIRMATION: "🛒",
  ORDER_STATUS_UPDATE: "📦",
  ORDER_SHIPPED: "🚚",
  ORDER_DELIVERED: "✅",
  ORDER_CANCELLED: "❌",
  ORDER_REFUNDED: "💰",
  PASSWORD_RESET: "🔑",
  EMAIL_VERIFICATION: "✉️",
  CUSTOM: "⚙️",
};

export default function EmailTemplatesPage() {
  const queryClient = useQueryClient();
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["email-templates"],
    queryFn: emailTemplatesService.getAll,
  });

  const resetMutation = useMutation({
    mutationFn: (type: EmailTemplateType) => emailTemplatesService.resetToDefault(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast.success("Template reset to default");
    },
    onError: () => toast.error("Failed to reset template"),
  });

  const handleReset = (type: EmailTemplateType) => {
    if (confirm("Are you sure you want to reset this template to the default version?")) {
      resetMutation.mutate(type);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground mt-1">
          Customize transactional email templates sent to users. Use <code className="text-xs bg-muted px-1 py-0.5 rounded">{`{{variableName}}`}</code> syntax for dynamic content.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates?.map((template) => (
          <Card key={template.type} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{TYPE_ICONS[template.type] || "📧"}</span>
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-xs mt-0.5 line-clamp-1">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
                {template.isCustomized ? (
                  <Badge variant="default" className="shrink-0 text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Customized
                  </Badge>
                ) : (
                  <Badge variant="outline" className="shrink-0 text-xs">
                    Default
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <p className="text-xs text-muted-foreground font-medium mb-1">Subject</p>
                <p className="text-sm font-mono truncate">{template.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setPreviewTemplate(template)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingTemplate(template)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {template.isCustomized && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReset(template.type)}
                    disabled={resetMutation.isPending}
                    title="Reset to default"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Template Variables Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="font-medium text-sm mb-2">Common Variables</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><code>{`{{firstName}}`}</code> - User's first name</li>
                <li><code>{`{{lastName}}`}</code> - User's last name</li>
                <li><code>{`{{email}}`}</code> - User's email</li>
                <li><code>{`{{churchName}}`}</code> - Church name</li>
                <li><code>{`{{appUrl}}`}</code> - App URL</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Order Variables</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><code>{`{{orderNumber}}`}</code> - Order number</li>
                <li><code>{`{{orderStatus}}`}</code> - Status code</li>
                <li><code>{`{{orderStatusLabel}}`}</code> - Readable status</li>
                <li><code>{`{{orderItemsTable}}`}</code> - Items table HTML</li>
                <li><code>{`{{pricingSummary}}`}</code> - Pricing summary HTML</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Special Variables</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li><code>{`{{trackingNote}}`}</code> - Tracking info</li>
                <li><code>{`{{cancellationReason}}`}</code> - Cancellation reason</li>
                <li><code>{`{{resetLink}}`}</code> - Password reset link</li>
                <li><code>{`{{verificationLink}}`}</code> - Email verification link</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Use Handlebars conditional syntax <code>{`{{#if variable}}...{{/if}}`}</code> to show content only when a variable exists.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Editor Dialog */}
      <EmailTemplateEditorDialog
        template={editingTemplate}
        onClose={() => setEditingTemplate(null)}
      />

      {/* Preview Dialog */}
      <EmailPreviewDialog
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}
