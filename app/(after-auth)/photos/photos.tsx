"use client";

import Image from "next/image";
import { useState } from "react";

type Photo = {
  base64: string;
  img: {
    src: string;
    height: number;
    width: number;
  };
};

const Photos = ({ photos }: { photos: Photo[] }) => {
  const splitIntoColumns = (photos: Photo[], cols: number) => {
    const result: Photo[][] = Array.from({ length: cols }, () => []);
    photos.forEach((photo, index) => {
      result[index % cols].push(photo);
    });
    return result;
  };

  const columns = splitIntoColumns(photos, 3);

  return (
    <div className="max-w-5xl mx-auto min-h-screen border-x w-full fixed inset-0 m-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-y-auto">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="gap-4 flex flex-col">
          {column.map((photo, idx) => {
            return (
              <div
                key={photo.img.src + idx}
                className="border rounded-3xl overflow-hidden relative"
                style={{
                  height: photo.img.height / 2.5,
                }}
              >
                <Image
                  fill
                  src={photo.img.src}
                  placeholder="blur"
                  blurDataURL={photo.base64}
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
