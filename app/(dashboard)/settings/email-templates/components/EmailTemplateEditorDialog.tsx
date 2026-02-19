"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Eye, Save, Code, Type, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { emailTemplatesService, EmailTemplate } from "@/lib/api/services/email-templates.service";

interface Props {
  template: EmailTemplate | null;
  onClose: () => void;
}

export function EmailTemplateEditorDialog({ template, onClose }: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewSubject, setPreviewSubject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  useEffect(() => {
    if (template) {
      setName(template.name);
      setSubject(template.subject);
      setBody(template.body);
      setDescription(template.description || "");
      setPreviewHtml(null);
      setPreviewSubject(null);
      setActiveTab("editor");
    }
  }, [template]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!template) return;
      return emailTemplatesService.create({
        type: template.type,
        name,
        subject,
        body,
        description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast.success("Template saved successfully");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to save template");
    },
  });

  const previewMutation = useMutation({
    mutationFn: () => emailTemplatesService.preview(subject, body),
    onSuccess: (data) => {
      setPreviewSubject(data.subject);
      setPreviewHtml(data.body);
      setActiveTab("preview");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to generate preview");
    },
  });

  const handleSave = () => {
    if (!name.trim() || !subject.trim() || !body.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    saveMutation.mutate();
  };

  if (!template) return null;

  return (
    <Dialog open={!!template} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl">Edit Template</DialogTitle>
            {template.isCustomized && (
              <Badge variant="default" className="text-xs">Customized</Badge>
            )}
          </div>
          <DialogDescription>
            Editing: {template.name} • Type: {template.type}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 border-b">
            <TabsList className="h-10">
              <TabsTrigger value="editor" className="gap-2">
                <Code className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="flex-1 overflow-hidden m-0 p-0">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Welcome Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., Sent when a new user registers"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Welcome to {{churchName}}, {{firstName}}!"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use variables like <code>{`{{firstName}}`}</code> for dynamic content
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="body">Email Body (HTML)</Label>
                    {template.availableVariables && (
                      <div className="flex flex-wrap gap-1">
                        {template.availableVariables.slice(0, 5).map((v) => (
                          <Badge
                            key={v}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-muted"
                            onClick={() => {
                              setBody((prev) => prev + `{{${v}}}`);
                            }}
                          >
                            {v}
                          </Badge>
                        ))}
                        {(template.availableVariables.length > 5) && (
                          <Badge variant="outline" className="text-xs">
                            +{template.availableVariables.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="<h2>Welcome, {{firstName}}!</h2>..."
                    className="font-mono text-sm min-h-[350px] resize-y"
                  />
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Tip:</strong> The body will be wrapped in a branded email template with header and footer.
                    You only need to provide the main content area.
                  </div>
                </div>

                {template.defaultBody && (
                  <details className="border rounded-lg p-3">
                    <summary className="text-sm font-medium cursor-pointer">
                      View Default Template
                    </summary>
                    <div className="mt-3 space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Default Subject</Label>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                          {template.defaultSubject}
                        </pre>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Default Body</Label>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                          {template.defaultBody}
                        </pre>
                      </div>
                    </div>
                  </details>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-hidden m-0 p-0">
            {previewHtml ? (
              <div className="h-full flex flex-col">
                <div className="px-6 py-3 border-b bg-muted/50">
                  <p className="text-xs text-muted-foreground font-medium">Subject Preview</p>
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
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Click "Generate Preview" to see how the email will look</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => previewMutation.mutate()}
            disabled={previewMutation.isPending}
          >
            {previewMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Eye className="h-4 w-4 mr-2" />
            Generate Preview
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
