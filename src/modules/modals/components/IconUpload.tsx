"use client";

import DialogWrapper from "@/components/custom/dialog-wrapper";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { getInfoSummary, isUploadValid } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Info } from "@/types";
import { Check, ImageIcon, RotateCcw, Upload } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

interface IconUploadDialogProps {
  currentIconUrl?: string;
  onIconChange: (iconUrl: string) => void;
  trigger?: React.ReactNode;
  info: Info | null;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PanOffset {
  x: number;
  y: number;
}

function IconUploadDialog({
  currentIconUrl,
  onIconChange,
  trigger,
  info,
}: IconUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [panOffset, setPanOffset] = useState<PanOffset>({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState<"select" | "crop" | "uploading">("select");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const uploadMutation = trpc.uploads.image.useMutation();

  // Reset dialog state
  const resetDialog = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl("");
    setCropArea({ x: 0, y: 0, width: 100, height: 100 });
    setPanOffset({ x: 0, y: 0 });
    setImageSize({ width: 0, height: 0 });
    setIsUploading(false);
    setUploadProgress(0);
    setStep("select");
    setIsDragging(false);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const isValid = isUploadValid(info, [file], "image");
        if (!isValid) return;

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setStep("crop");
      }
      e.target.value = "";
    },
    [info]
  );

  // Handle image load to set initial crop area
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageSize({ width: naturalWidth, height: naturalHeight });

      // Set initial crop area to center square
      const size = Math.min(naturalWidth, naturalHeight);
      const x = (naturalWidth - size) / 2;
      const y = (naturalHeight - size) / 2;
      setCropArea({ x, y, width: size, height: size });
      setPanOffset({ x: 0, y: 0 });
    }
  }, []);

  // Generate preview of the final result
  const generatePreview = useCallback(() => {
    if (!previewCanvasRef.current || !imageRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const img = imageRef.current;

    // Always show 100x100 preview
    canvas.width = 100;
    canvas.height = 100;

    // Apply pan offset to crop area
    const adjustedCropArea = {
      x: Math.max(
        0,
        Math.min(cropArea.x + panOffset.x, imageSize.width - cropArea.width)
      ),
      y: Math.max(
        0,
        Math.min(cropArea.y + panOffset.y, imageSize.height - cropArea.height)
      ),
      width: cropArea.width,
      height: cropArea.height,
    };

    // Enable high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the cropped and resized image
    ctx.drawImage(
      img,
      adjustedCropArea.x,
      adjustedCropArea.y,
      adjustedCropArea.width,
      adjustedCropArea.height,
      0,
      0,
      100,
      100
    );
  }, [cropArea, panOffset, imageSize]);

  // Automatic image processing and optimization
  const processImage = useCallback(
    async (file: File): Promise<File> => {
      return new Promise((resolve) => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const img = new Image();

        img.onload = () => {
          // Always resize to 100x100 for icons
          canvas.width = 100;
          canvas.height = 100;

          // Apply pan offset to crop area
          const adjustedCropArea = {
            x: Math.max(
              0,
              Math.min(
                cropArea.x + panOffset.x,
                imageSize.width - cropArea.width
              )
            ),
            y: Math.max(
              0,
              Math.min(
                cropArea.y + panOffset.y,
                imageSize.height - cropArea.height
              )
            ),
            width: cropArea.width,
            height: cropArea.height,
          };

          // Enable high quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Draw cropped and resized image
          ctx.drawImage(
            img,
            adjustedCropArea.x,
            adjustedCropArea.y,
            adjustedCropArea.width,
            adjustedCropArea.height,
            0,
            0,
            100,
            100
          );

          // Apply sharpening for small images to maintain clarity
          const imageData = ctx.getImageData(0, 0, 100, 100);
          const data = imageData.data;
          const tempData = new Uint8ClampedArray(data);

          // Simple sharpening kernel
          const sharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

          for (let y = 1; y < 99; y++) {
            for (let x = 1; x < 99; x++) {
              for (let c = 0; c < 3; c++) {
                // RGB channels only
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                  for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * 100 + (x + kx)) * 4 + c;
                    sum +=
                      tempData[idx] * sharpenKernel[(ky + 1) * 3 + (kx + 1)];
                  }
                }
                const idx = (y * 100 + x) * 4 + c;
                data[idx] = Math.max(0, Math.min(255, sum));
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);

          canvas.toBlob(
            (webpBlob) => {
              if (webpBlob && webpBlob.size < file.size * 0.5) {
                const processedFile = new File(
                  [webpBlob],
                  file.name.replace(/\.[^/.]+$/, ".webp"),
                  {
                    type: "image/webp",
                    lastModified: Date.now(),
                  }
                );
                resolve(processedFile);
              } else {
                canvas.toBlob(
                  (jpegBlob) => {
                    if (jpegBlob) {
                      const processedFile = new File(
                        [jpegBlob],
                        file.name.replace(/\.[^/.]+$/, ".png"),
                        {
                          type: "image/png",
                          lastModified: Date.now(),
                        }
                      );
                      resolve(processedFile);
                    }
                  },
                  "image/png",
                  0.85
                );
              }
            },
            "image/webp",
            0.85
          );
        };

        img.src = previewUrl;
      });
    },
    [cropArea, panOffset, imageSize, previewUrl]
  );

  // Handle mouse events for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        // Convert screen coordinates to image coordinates
        const scaleX = imageSize.width / (imageRef.current?.offsetWidth || 1);
        const scaleY = imageSize.height / (imageRef.current?.offsetHeight || 1);

        const newPanOffset = {
          x: panOffset.x + deltaX * scaleX,
          y: panOffset.y + deltaY * scaleY,
        };

        // Constrain pan offset to keep crop area within image bounds
        newPanOffset.x = Math.max(
          -cropArea.x,
          Math.min(
            newPanOffset.x,
            imageSize.width - cropArea.x - cropArea.width
          )
        );
        newPanOffset.y = Math.max(
          -cropArea.y,
          Math.min(
            newPanOffset.y,
            imageSize.height - cropArea.y - cropArea.height
          )
        );

        setPanOffset(newPanOffset);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, dragStart, panOffset, cropArea, imageSize]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset pan offset
  const resetPosition = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Upload processed image
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStep("uploading");
    setUploadProgress(0);

    try {
      // Process image automatically (crop, resize to 100x100, compress, optimize)
      const processedFile = await processImage(selectedFile);

      setUploadProgress(25);

      // Get upload URL
      const response = await uploadMutation.mutateAsync({
        filename: processedFile.name,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to get upload URL");
      }

      setUploadProgress(50);

      const { uploadUrl, imageUrl } = response.data;

      // Upload to Cloudflare R2
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: processedFile,
        headers: {
          "Content-Type": processedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      setUploadProgress(100);

      // Update parent component
      onIconChange(imageUrl);

      // Close dialog after short delay
      setTimeout(() => {
        setIsOpen(false);
        resetDialog();
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      setStep("crop"); // Go back to crop step on error
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, uploadMutation, processImage, onIconChange, resetDialog]);

  // Update preview when crop or pan changes
  React.useEffect(() => {
    if (step === "crop" && imageSize.width > 0) {
      generatePreview();
    }
  }, [step, generatePreview, cropArea, panOffset]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setStep("crop");
    }
  }, []);

  return (
    <>
      {trigger || (
        <Button onClick={() => setIsOpen(true)} variant={"outline"} size={"xs"}>
          <Upload className="h-4 w-4 mr-1" />
          {currentIconUrl ? "Change Icon" : "Upload Icon"}
        </Button>
      )}

      <DialogWrapper
        open={isOpen}
        onOpen={(open) => {
          setIsOpen(open);
          if (!open) resetDialog();
        }}
        title="Upload Icon"
      >
        <div className="space-y-4">
          {step === "select" && (
            <div className="space-y-4 px-6 pb-6">
              {/* File Selection */}
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors bg-zinc-50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center space-y-3">
                  <ImageIcon className="size-6 opacity-75 text-muted-foreground" />

                  <div>
                    <h3 className="text-lg font-medium">
                      Drag & Drop your icon here
                    </h3>
                    {info && (
                      <p className="opacity-75 text-sm">
                        {getInfoSummary(info, "image")}
                      </p>
                    )}
                  </div>

                  <Button
                    disabled={!info}
                    onClick={handleFileSelect}
                    variant="outline"
                    size="xs"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>

              {/* Current Icon Preview */}
              {currentIconUrl && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current icon:
                  </p>
                  <div className="inline-block p-2 border rounded-lg">
                    <img
                      src={currentIconUrl || "/placeholder.svg"}
                      alt="Current icon"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "crop" && previewUrl && (
            <>
              {/* Image Cropper and Positioner */}
              <div className="space-y-4 px-6">
                <div className="flex flex-col relative gap-4">
                  {/* Original image with crop overlay */}
                  <div className="space-y-2 mx-auto">
                    <div className="relative w-fit inline-block">
                      <img
                        ref={imageRef}
                        src={previewUrl || "/placeholder.svg"}
                        alt="Original"
                        className="w-full max-h-40 object-contain cursor-move select-none"
                        onLoad={handleImageLoad}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{
                          display: imageSize.width > 0 ? "block" : "none",
                        }}
                        draggable={false}
                      />

                      {/* Crop overlay with pan offset */}
                      {imageSize.width > 0 && imageRef.current && (
                        <div
                          className="absolute border-2 border-primary bg-primary/20 aspect-square pointer-events-none"
                          style={{
                            left: `${
                              ((cropArea.x + panOffset.x) / imageSize.width) *
                              imageRef.current.offsetWidth
                            }px`,
                            top: `${
                              ((cropArea.y + panOffset.y) / imageSize.height) *
                              imageRef.current.offsetHeight
                            }px`,
                            width: `${
                              (cropArea.width / imageSize.width) *
                              imageRef.current.offsetWidth
                            }px`,
                            height: `${
                              (cropArea.height / imageSize.height) *
                              imageRef.current.offsetHeight
                            }px`,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Preview */}

                  <canvas
                    ref={previewCanvasRef}
                    className="size-14 border rounded absolute bottom-0"
                    style={{ imageRendering: "auto" }}
                  />
                </div>

                {/* Crop Size Control */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Crop size</Label>
                  <Slider
                    value={[cropArea.width]}
                    onValueChange={([width]) => {
                      const maxSize = Math.min(
                        imageSize.width,
                        imageSize.height
                      );
                      const newWidth = Math.min(width, maxSize);
                      const newHeight = newWidth; // Keep square
                      setCropArea((prev) => ({
                        ...prev,
                        width: newWidth,
                        height: newHeight,
                        x: Math.min(prev.x, imageSize.width - newWidth),
                        y: Math.min(prev.y, imageSize.height - newHeight),
                      }));
                      // Reset pan when crop size changes
                      setPanOffset({ x: 0, y: 0 });
                    }}
                    max={Math.min(imageSize.width, imageSize.height)}
                    min={Math.min(
                      50,
                      Math.min(imageSize.width, imageSize.height)
                    )}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <DialogFooter>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep("select")}
                  >
                    Back
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetPosition}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                  </Button>
                </div>
                <Button onClick={handleUpload}>
                  <Check className="h-4 w-4 mr-2" />
                  Upload Icon
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "uploading" && (
            <div className="text-center space-y-4 px-6 pb-6">
              <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                <Upload className="h-8 w-8 opacity-60 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Optimizing and uploading...</h3>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {uploadProgress}% complete
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogWrapper>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}

export default IconUploadDialog;
