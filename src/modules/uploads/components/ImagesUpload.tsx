"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { trpc } from "@/trpc/client";

interface ImagesUploadComponentProps {
  imageUrls: string[];
  onChange: (newImageUrls: string[]) => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

function ImagesUploadComponent({
  imageUrls,
  onChange,
}: ImagesUploadComponentProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.uploads.image.useMutation();

  // Simulate file upload with progress
  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      try {
        // Step 1: Get upload URL from your mutation
        const response = await uploadMutation.mutateAsync({
          filename: file.name,
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to get upload URL");
        }

        const { uploadUrl, imageUrl } = response.data;

        // Step 2: Upload file to Cloudflare R2 using the upload URL
        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadingFiles((prev) =>
                prev.map((f) => (f.file === file ? { ...f, progress } : f))
              );
            }
          },
        });

        // Return the final image URL
        return imageUrl;
      } catch (error) {
        console.error("Upload error:", error);
        throw error;
      }
    },
    [uploadMutation]
  );

  // Handle duplicate file names
  const getUniqueFileName = useCallback(
    (fileName: string, existingFiles: File[]): string => {
      const existingNames = existingFiles.map((f) => f.name);
      let uniqueName = fileName;
      let counter = 1;

      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      const extension = fileName.match(/\.[^/.]+$/)?.[0] || "";

      while (existingNames.includes(uniqueName)) {
        uniqueName = `${nameWithoutExt} (${counter})${extension}`;
        counter++;
      }

      return uniqueName;
    },
    []
  );

  // Process and upload files
  const handleFiles = useCallback(
    async (files: FileList) => {
      const validFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (validFiles.length === 0) return;

      // Handle duplicate names
      const processedFiles = validFiles.map((file) => {
        const uniqueName = getUniqueFileName(file.name, validFiles);
        if (uniqueName !== file.name) {
          // Create a new file with the unique name
          return new File([file], uniqueName, { type: file.type });
        }
        return file;
      });

      // Initialize uploading state
      const newUploadingFiles: UploadingFile[] = processedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
      }));

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

      // Upload files
      const uploadPromises = processedFiles.map(async (file) => {
        try {
          const imageUrl = await uploadFile(file);
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.file === file ? { ...f, url: imageUrl, progress: 100 } : f
            )
          );
          return imageUrl;
        } catch (error) {
          console.log(error);
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.file === file
                ? { ...f, error: "Upload failed", progress: 0 }
                : f
            )
          );
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as string[];

      if (successfulUploads.length > 0) {
        onChange([...imageUrls, ...successfulUploads]);
      }

      // Clean up uploading state after a delay
      setTimeout(() => {
        setUploadingFiles((prev) =>
          prev.filter((f) => !processedFiles.includes(f.file))
        );
      }, 1000);
    },
    [imageUrls, onChange, uploadFile, getUniqueFileName]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  // Manual file selection
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        handleFiles(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleFiles]
  );

  // Remove image
  const handleRemoveImage = useCallback(
    (urlToRemove: string) => {
      const newUrls = imageUrls.filter((url) => url !== urlToRemove);
      onChange(newUrls);
      // Clean up blob URL if it was created locally
      if (urlToRemove.startsWith("blob:")) {
        URL.revokeObjectURL(urlToRemove);
      }
    },
    [imageUrls, onChange]
  );

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
          ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-1">
          <Upload className="size-6 text-primary opacity-50" />

          <h3 className="text-sm opacity-60 mb-1">Drag & Drop images here</h3>

          <Button
            size={"xs"}
            type="button"
            onClick={handleFileSelect}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-1" />
            Choose Files
          </Button>
        </div>
      </div>

      {/* Uploading Files Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploading files...</h4>
          {uploadingFiles.map((uploadingFile) => (
            <div key={uploadingFile.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate flex-1 mr-2">
                  {uploadingFile.file.name}
                </span>
                <span className="text-muted-foreground">
                  {uploadingFile.error
                    ? "Failed"
                    : `${Math.round(uploadingFile.progress)}%`}
                </span>
              </div>
              <Progress
                value={uploadingFile.progress}
                className={`h-2 ${
                  uploadingFile.error ? "bg-destructive/20" : ""
                }`}
              />
              {uploadingFile.error && (
                <p className="text-xs text-destructive">
                  {uploadingFile.error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Images Grid */}
      {imageUrls.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm">Uploaded Images ({imageUrls.length})</h4>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-4">
            {imageUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for broken images
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement("div");
                        fallback.className =
                          "w-full h-full flex items-center justify-center bg-muted";
                        fallback.innerHTML =
                          '<svg class="h-8 w-8 text-muted-foreground"><use href="#image-icon"></use></svg>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveImage(url)}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90"
                  aria-label="Remove image"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {imageUrls.length === 0 && uploadingFiles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No images uploaded yet</p>
        </div>
      )}

      {/* Hidden SVG for fallback icon */}
      <svg className="hidden">
        <defs>
          <g id="image-icon">
            <path d="m21 19-7-7-7 7" />
            <path d="M3 21h18" />
            <path d="M3 10h18" />
            <circle cx="12" cy="7" r="4" />
          </g>
        </defs>
      </svg>
    </div>
  );
}

export default ImagesUploadComponent;
