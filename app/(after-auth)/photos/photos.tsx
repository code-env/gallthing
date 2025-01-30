"use client";

import Image from "next/image";
import { useState } from "react";
import PhotoPreview from "./photo";

export type Photo = {
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
          {column.map((photo, idx) => (
            <PhotoPreview photo={photo} key={idx} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Photos;
