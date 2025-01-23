"use client";

import useUploader, { Attachment } from "@/hooks/use-uploader";
import { cn } from "@/lib/utils";
import { useDropzone } from "@uploadthing/react";
import byteSize from "byte-size";
import { Image, Link, XCircle } from "lucide-react";
import { motion } from "motion/react";

const UploadZone = () => {
  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
  } = useUploader();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  return (
    <motion.div
      layoutId="uploader"
      className=" w-full max-w-xl border p-5 rounded-3xl bg-muted flex flex-col gap-8 items-center overflow-hidden"
    >
      <div className="text-center space-y-1 pt-10">
        <h1 className="text-3xl font-semibold">Upload your images</h1>
        <p className="text-muted-foreground text-sm">
          PNG, JPG, and GIF's are supported
        </p>
      </div>
      <div {...getRootProps()} className="size-full">
        <motion.div
          layoutId="uploader-container"
          className={cn(
            "space-y-4 bg-background w-full flex items-center flex-col justify-center p-10 rounded-2xl border-dashed border-muted-foreground/20 border-2 cursor-pointer transition-all duration-300",
            {
              "border-primary border-dashed ": isDragActive,
            }
          )}
        >
          <UploadIcon isUploading={isUploading} />
          <motion.p
            layoutId="uploader-description"
            className="text-muted-foreground texlg"
          >
            Drag and Drop or browse to choose a file.
          </motion.p>
          <input
            {...getInputProps()}
            accept="image/*"
            className="outline-none"
          />
        </motion.div>
      </div>
      {!!attachments.length && (
        <div className="flex flex-col gap-2  w-full">
          {attachments.map((attachment) => (
            <Attachments
              key={attachment.file.name}
              attachment={attachment}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              removeAttachment={removeAttachment}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const iconVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

interface AttachmentsProps {
  attachment: Attachment;
  isUploading: boolean;
  uploadProgress: number | undefined;
  removeAttachment: (fileName: string) => void;
}

const Attachments = ({
  attachment,
  isUploading,
  uploadProgress,
  removeAttachment,
}: AttachmentsProps) => {
  const size = byteSize(attachment.file.size);

  return (
    <motion.div
      key={attachment.file.name}
      layoutId={attachment.file.name}
      className="flex items-center justify-between w-full bg-background border border-muted-foreground/20 rounded-lg relative overflow-hidden z-0 p-2 gap-4"
    >
      <div className="size-10 border border-muted-foreground/20 rounded-lg flex items-center justify-center">
        <Image className="size-5" />
      </div>
      <div className="flex-1">
        <p className="flex flex-col">
          <span className="text-sm">{attachment.file.name}</span>
          <span className="text-xs">{size.toString()}</span>
        </p>
      </div>

      {!isUploading && (
        <motion.div
          className="absolute top-0 right-1 my-auto bottom-0 flex items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.a
            className="size-8 rounded-md flex items-center justify-center cursor-pointer"
            variants={iconVariants}
            target="_blank"
            href={attachment.url}
          >
            <Link className="size-4" />
          </motion.a>
          <motion.button
            className="size-8 rounded-md flex items-center justify-center"
            variants={iconVariants}
            onClick={() => removeAttachment(attachment.file.name)}
          >
            <XCircle className="size-4" />
          </motion.button>
        </motion.div>
      )}

      {isUploading && attachment.isUploading && (
        <motion.div
          animate={{
            width: `${uploadProgress}%`,
          }}
          className="bg-primary/40 absolute top-0 left-0 h-full -z-10"
        />
      )}
    </motion.div>
  );
};

interface UploadIconProps {
  isUploading: boolean;
}

const UploadIcon = ({ isUploading }: UploadIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-cloud-upload size-20 text-muted-foreground"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 13v8" className={isUploading ? "animate-pulse" : ""} />
      <path d="m8 17 4-4 4 4" className={isUploading ? "animate-pulse" : ""} />
    </svg>
  );
};

export default UploadZone;
