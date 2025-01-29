"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import useUploader, { Attachment } from "@/hooks/use-uploader";
import { cn } from "@/lib/utils";
import byteSize from "byte-size";
import { Button } from "@/components/ui/button";

const DropZone = () => {
  const { routeConfig, startUpload, attachments, urls } = useUploader();
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    startUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  return (
    <div
      {...getRootProps()}
      className={cn("min-h-screen  transition-colors duration-200", {
        "bg-blue-500": isDragActive,
      })}
    >
      <input {...getInputProps()} />

      <UploadDone urls={urls} attachments={attachments} />
    </div>
  );
};

const UploadDone = ({
  urls,
  attachments,
}: {
  urls: string[] | null;
  attachments: Attachment[];
}) => {
  console.log(urls);

  if (!urls?.length) return null;

  const fileSizes = attachments.reduce((acc, a) => acc + a.file.size, 0);

  const size = byteSize(fileSizes).toString();

  const first4 = urls.slice(0, 4);

  return (
    <div className="fixed bottom-10 right-10 z-50 w-96 border rounded-xl p-2 bg-background flex gap-4">
      <div
        className={cn(
          "grid grid-cols-2 size-40 min-w-40  gap-1 rounded-xl overflow-hidden",
          first4.length === 1 && "grid-cols-1"
        )}
      >
        {first4.map((url, idx) => {
          const span2 = first4.length % 2 !== 0;
          return (
            <div
              key={url}
              className={cn("overflow-hidden", {
                "col-span-2": span2,
              })}
            >
              <img
                src={url}
                alt="uploaded"
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
      <div className="flex flex-col justify-between">
        <h2 className="font-semibold text-base">
          You&apos;ve added {urls.length} images of size {size}
        </h2>
        <Button>Add to Album</Button>
      </div>
    </div>
  );
};
export default DropZone;
