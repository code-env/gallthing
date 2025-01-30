"use client";

import { ClipboardEvent, useEffect, useState } from "react";
import { getImageDimensions } from "@/lib/getImageDimensions"; // Adjust the import path as needed
import { Photo } from "@prisma/client";
import { cn } from "@/lib/utils";
import useUploader from "@/hooks/use-uploader";

const Photos = ({ photos }: { photos: Photo[] }) => {
  const [imageDimensions, setImageDimensions] = useState<
    { url: string; width: number; height: number }[]
  >([]);

  const { startUpload } = useUploader();

  useEffect(() => {
    const fetchImageDimensions = async () => {
      const dimensions = await Promise.all(
        photos.map(async (photo) => {
          const { width, height } = await getImageDimensions(photo.url);
          return { url: photo.url, width, height };
        })
      );
      setImageDimensions(dimensions);
    };

    fetchImageDimensions();
  }, [photos]);

  const splitIntoColumns = (photoss: Photo[], cols: number) => {
    const result: Photo[][] = Array.from({ length: cols }, () => []);
    photoss.forEach((photos, index) => {
      result[index % cols].push(photos);
    });
    return result;
  };

  const columns = splitIntoColumns(photos, 3);

  return (
    <div className="max-w-5xl mx-auto min-h-screen border-x w-full fixed inset-0 m-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-y-auto">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="gap-4 flex flex-col">
          {column.map((photo, idx) => {
            const dimensions = imageDimensions.find(
              (dim) => dim.url === photo.url
            );
            // const {} =
            return (
              <div
                key={photo.name + idx}
                className="border rounded-3xl overflow-hidden"
                style={{
                  height: dimensions ? dimensions.height / 2.5 : "auto",
                }}
              >
                <img
                  src={photo.url}
                  alt="nothing"
                  className="size-full aspect-auto object-cover"
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Photos;
