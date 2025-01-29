import { utapi } from "@/app/api/uploadthing/uploathing";
import { useUploadThing } from "@/lib/uploathing";
import { useState } from "react";
import { toast } from "sonner";

export interface Attachment {
  file: File;
  by?: string | { id: string | null };
  url?: string;
  size?: number;
  isUploading: boolean;
  type?: string;
}

export default function useUploader() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();
  const [urls, setUrls] = useState<string[] | null>(null);

  const { startUpload, isUploading, routeConfig } = useUploadThing(
    "attachment",
    {
      onBeforeUploadBegin(files) {
        const renamedFiles = files.map((file) => {
          const extension = file.name.split(".").pop();
          return new File([file], `file_${crypto.randomUUID()}.${extension}`, {
            type: file.type,
          });
        });

        setAttachments((prev) => [
          ...prev,
          ...renamedFiles.map((file) => ({ file, isUploading: true })),
        ]);

        return renamedFiles;
      },
      onUploadProgress: setUploadProgress,
      onClientUploadComplete(res) {
        console.log(res);

        setAttachments((prev) =>
          prev.map((a) => {
            const uploadResult = res.find((r) => r.name === a.file.name);

            if (!uploadResult) return a;

            return {
              ...a,
              by: uploadResult.serverData.uploadedBy,
              url: uploadResult.url,
              isUploading: false,
              size: uploadResult.size,
              type: uploadResult.type.split("/")[1],
            };
          })
        );
        setUrls(res.map((r) => r.url));
        const urls = res.map((r) => r.url);

        console.log(urls);
      },

      onUploadError(e) {
        setAttachments((prev) => prev.filter((a) => !a.isUploading));
        toast.error("Upload failed");
      },
    }
  );

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.error("Upload failed");
      return;
    }

    if (attachments.length + files.length > 5) {
      toast.error("Upload failed");
      return;
    }

    startUpload(files);
  }

  async function removeAttachment(fileName: string) {
    const file = attachments.find((a) => a.file.name === fileName);

    if (!file) return;

    const key = file.url?.split("/f/")[1];

    const res = await fetch("/api/remove", {
      method: "POST",
      body: JSON.stringify({ key }),
    });

    if (res.ok) {
      setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
    }
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
    routeConfig,
    urls,
  };
}
