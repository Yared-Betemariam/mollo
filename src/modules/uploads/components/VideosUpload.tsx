"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getInfoSummary, isUploadValid } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Info, UploadingFile } from "@/types";
import axios from "axios";
import { Film, Upload, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

interface VideosUploadComponentProps {
  videoUrls: string[];
  onChange: (newVideoUrls: string[]) => void;
  maxFileSizeMB?: number;
  info: Info | null;
}

function VideosUploadComponent({
  videoUrls,
  onChange,
  info,
  maxFileSizeMB = 500,
}: VideosUploadComponentProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.uploads.video.useMutation();

  const getUniqueFileName = useCallback(
    (original: string, taken: Set<string>) => {
      if (!taken.has(original)) return original;
      const dot = original.lastIndexOf(".");
      const base = dot > -1 ? original.slice(0, dot) : original;
      const ext = dot > -1 ? original.slice(dot) : "";
      let i = 1;
      let candidate = `${base} (${i})${ext}`;
      while (taken.has(candidate)) {
        i++;
        candidate = `${base} (${i})${ext}`;
      }
      return candidate;
    },
    []
  );

  const handleFiles = useCallback(
    async (filesList: FileList) => {
      const filtered = Array.from(filesList).filter((f) =>
        f.type.startsWith("video/")
      );
      if (filtered.length === 0) return;

      const isValid = isUploadValid(info, filtered, "image");
      if (!isValid) return;

      // Basic size validation (optional)
      // const maxBytes = maxFileSizeMB * 1024 * 1024;
      // const filtered = incoming.filter((f) => {
      //   if (f.size > maxBytes) {
      //     console.warn(`Skipping ${f.name}: exceeds ${maxFileSizeMB}MB`);
      //     return false;
      //   }
      //   return true;
      // });
      // if (filtered.length === 0) return;

      // Build taken names from currently uploading to avoid duplicates across the same session
      const taken = new Set<string>([
        ...uploadingFiles.map((u) => u.file.name),
        ...filtered.map((f) => f.name),
      ]);

      // Ensure unique names within this batch
      const processedFiles = filtered.map((file) => {
        const unique = getUniqueFileName(file.name, taken);
        taken.add(unique);
        return unique !== file.name
          ? new File([file], unique, {
              type: file.type,
              lastModified: file.lastModified,
            })
          : file;
      });

      const batch: UploadingFile[] = processedFiles.map((file) => ({
        id: Math.random().toString(36).slice(2),
        file,
        progress: 0,
        previewUrl: URL.createObjectURL(file),
      }));
      setUploadingFiles((prev) => [...prev, ...batch]);

      // Upload each file: 1) get uploadUrl via mutateAsync 2) axios.put(uploadUrl, file)
      const results = await Promise.all(
        batch.map(async (item) => {
          try {
            const res = await uploadMutation.mutateAsync({
              filename: item.file.name,
            });
            if (!res.success)
              throw new Error(res.message || "Failed to get upload URL");

            const { uploadUrl, videoUrl } = res.data;
            await axios.put(
              `${uploadUrl}${
                uploadUrl.includes("?") ? "&" : "?"
              }filename=${encodeURIComponent(item.file.name)}`,
              item.file,
              {
                headers: {
                  "Content-Type": item.file.type || "application/octet-stream",
                },
                onUploadProgress: (e) => {
                  if (e.total) {
                    const pct = Math.round((e.loaded * 100) / e.total);
                    setUploadingFiles((prev) =>
                      prev.map((u) =>
                        u.id === item.id ? { ...u, progress: pct } : u
                      )
                    );
                  } else {
                    // Fallback when total is missing, show indeterminate climb
                    setUploadingFiles((prev) =>
                      prev.map((u) =>
                        u.id === item.id
                          ? { ...u, progress: Math.min(99, u.progress + 1) }
                          : u
                      )
                    );
                  }
                },
              }
            );

            setUploadingFiles((prev) =>
              prev.map((u) =>
                u.id === item.id ? { ...u, progress: 100, url: videoUrl } : u
              )
            );
            return videoUrl;
          } catch (err) {
            console.error("Video upload failed:", err);
            setUploadingFiles((prev) =>
              prev.map((u) =>
                u.id === item.id ? { ...u, error: "Upload failed" } : u
              )
            );
            return null;
          }
        })
      );

      const successful = results.filter(Boolean) as string[];
      if (successful.length > 0) {
        onChange([...videoUrls, ...successful]);
      }

      // Cleanup previews and remove completed items from uploading list
      setTimeout(() => {
        setUploadingFiles((prev) => {
          prev.forEach((u) => {
            if (u.previewUrl) URL.revokeObjectURL(u.previewUrl);
          });
          return prev.filter(
            (u) => !processedFiles.find((pf) => pf.name === u.file.name)
          );
        });
      }, 1000);
    },
    [
      getUniqueFileName,
      maxFileSizeMB,
      onChange,
      uploadMutation,
      uploadingFiles,
      videoUrls,
    ]
  );

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
      if (e.dataTransfer.files?.length) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleChooseClick = useCallback(
    () => fileInputRef.current?.click(),
    []
  );
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleRemoveVideo = useCallback(
    (url: string) => {
      const updated = videoUrls.filter((u) => u !== url);
      onChange(updated);
    },
    [onChange, videoUrls]
  );

  return (
    <div className="w-full space-y-4">
      {/* Drop zone */}
      <div
        className={`relative bg-zinc-50 border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col h-full justify-center gap-3 items-center">
          <Film className="size-6 text-primary opacity-75" />

          <div>
            <p className="opacity-75 text-base">Drag & Drop an video here</p>
            {info && (
              <p className="text-muted-foreground text-sm">
                {getInfoSummary(info, "video")}
              </p>
            )}
          </div>

          <Button
            size={"xs"}
            type="button"
            onClick={handleChooseClick}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-1" />
            Choose File
          </Button>
        </div>
      </div>

      {/* Uploading state */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploading videos...</h4>
          {uploadingFiles.map((u) => (
            <div key={u.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate flex-1 mr-2">{u.file.name}</span>
                <span className="text-muted-foreground">
                  {u.error ? "Failed" : `${Math.round(u.progress)}%`}
                </span>
              </div>
              <Progress
                value={u.progress}
                className={`h-2 ${u.error ? "bg-destructive/20" : ""}`}
              />
              {u.error && <p className="text-xs text-destructive">{u.error}</p>}
              {/* Optional small preview while uploading */}
              {u.previewUrl && (
                <div className="rounded-lg overflow-hidden bg-black/5">
                  <video
                    src={u.previewUrl}
                    className="w-full max-h-40"
                    muted
                    controls
                    preload="metadata"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded videos grid */}
      {videoUrls.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            Uploaded Videos ({videoUrls.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videoUrls.map((url, i) => (
              <div key={`${url}-${i}`} className="relative group">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                </div>
                <button
                  onClick={() => handleRemoveVideo(url)}
                  aria-label="Remove video"
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {videoUrls.length === 0 && uploadingFiles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Film className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No videos uploaded yet</p>
        </div>
      )}
    </div>
  );
}

export default VideosUploadComponent;
