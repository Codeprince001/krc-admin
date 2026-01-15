"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { mediaService } from "@/lib/api/services/media.service";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  context?: string; // Context for folder organization (books, events, devotions, etc.)
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  className = "",
  disabled = false,
  context,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      // Upload using backend media service
      const result = await mediaService.uploadImage(file, context);
      const imageUrl = result.secureUrl || result.url;

      setPreview(imageUrl);
      onChange(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      const message = typeof error?.message === 'string' ? error.message : "Failed to upload image";
      toast.error(message);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="space-y-2">
        {preview ? (
          <div className="relative group">
            <div className="relative w-full h-48 border rounded-md overflow-hidden bg-muted">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled || uploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleButtonClick}
                  disabled={disabled || uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Replace
                </Button>
              </div>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || uploading}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || uploading}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleButtonClick}
                  disabled={disabled || uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

