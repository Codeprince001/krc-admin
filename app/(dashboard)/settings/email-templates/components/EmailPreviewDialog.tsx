"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { emailTemplatesService, EmailTemplate } from "@/lib/api/services/email-templates.service";

interface Props {
  template: EmailTemplate | null;
  onClose: () => void;
}

export function EmailPreviewDialog({ template, onClose }: Props) {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewSubject, setPreviewSubject] = useState<string | null>(null);

  const previewMutation = useMutation({
    mutationFn: () => {
      if (!template) throw new Error("No template");
      return emailTemplatesService.preview(template.subject, template.body);
    },
    onSuccess: (data) => {
      setPreviewSubject(data.subject);
      setPreviewHtml(data.body);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to generate preview");
    },
  });

  useEffect(() => {
    if (template) {
      setPreviewHtml(null);
      setPreviewSubject(null);
      previewMutation.mutate();
    }
  }, [template]);

  if (!template) return null;

  return (
    <Dialog open={!!template} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Email Preview</DialogTitle>
          <DialogDescription>{template.name}</DialogDescription>
        </DialogHeader>

        {previewMutation.isPending ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : previewHtml ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-3 border-b bg-muted/50">
              <p className="text-xs text-muted-foreground font-medium">Subject</p>
              <p className="font-medium">{previewSubject}</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6">
                <div 
                  className="border rounded-lg overflow-hidden shadow-sm bg-white"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="mb-4">Failed to load preview</p>
              <Button variant="outline" onClick={() => previewMutation.mutate()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
