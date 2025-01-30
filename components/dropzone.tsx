"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState, useEffect } from "react";
import type { ClipboardEvent } from "react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import useUploader, { Attachment } from "@/hooks/use-uploader";
import { cn } from "@/lib/utils";
import byteSize from "byte-size";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const DropZone = () => {
  const {
    routeConfig,
    startUpload,
    attachments,
    urls,
    uploadProgress,
    isUploading,
    reset,
  } = useUploader();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      startUpload(acceptedFiles);
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  const onPaste = (e: ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.items) {
      const files = Array.from(e.clipboardData.items)
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null); // Filter out null files
      if (files.length > 0) {
        startUpload(files);
      }
    }
  };

  useEffect(() => {
    const handlePaste = (e: Event) => {
      // Cast the event to ClipboardEvent
      const clipboardEvent = e as unknown as ClipboardEvent;
      onPaste(clipboardEvent);
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div
      {...getRootProps()}
      className={cn("min-h-screen transition-colors duration-200", {
        "bg-primary/5": isDragActive,
      })}
    >
      <input {...getInputProps()} />
      <UploadDone
        urls={urls}
        attachments={attachments}
        uploadProgress={uploadProgress}
        isUploading={isUploading}
        reset={reset}
      />
    </div>
  );
};

const UploadDone = ({
  urls,
  attachments,
  uploadProgress,
  isUploading,
  reset,
}: {
  urls: string[] | null;
  attachments: Attachment[];
  uploadProgress?: number;
  isUploading?: boolean;
  reset?: () => void;
}) => {
  if (!attachments?.length) return null;

  const fileSizes = attachments.reduce((acc, a) => acc + a.file.size, 0);
  const size = byteSize(fileSizes).toString();
  const first4 = attachments.slice(0, 4);

  return (
    <div className="fixed bottom-10 right-10 z-50 w-96 border rounded-xl p-2 bg-background flex gap-4 overflow-hidden">
      <div
        className={cn(
          "grid grid-cols-2 size-40 min-w-40 gap-1 rounded-xl overflow-hidden opacity-100 relative",
          first4.length === 1 && "grid-cols-1",
          isUploading && "opacity-50"
        )}
      >
        {first4.map((attachment, idx) => {
          const span2 = first4.length % 2 !== 0;
          return (
            <div
              key={attachment.file.name}
              className={cn("overflow-hidden", {
                "col-span-2": span2,
              })}
            >
              <img
                src={URL.createObjectURL(attachment.file)}
                alt="uploaded"
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
        <button
          className="absolute size-5 bg-red-50 rounded-full top-2 right-2 flex items-center justify-center"
          onClick={reset}
        >
          <X className="size-3" />
        </button>
      </div>
      <div className="flex flex-col justify-between">
        <h2 className="font-semibold text-base">
          You&apos;ve added {attachments.length} images of size {size}
        </h2>
        <Button disabled={isUploading}>Add to Album</Button>
      </div>
      <div className="bg-transparent h-1 w-full absolute bottom-0 right-0">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
    </div>
  );
};

export default DropZone;
