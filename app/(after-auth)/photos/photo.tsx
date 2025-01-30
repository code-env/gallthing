"use client";

import { useInView } from "react-intersection-observer";
import { Photo as PhotoType } from "./photos";
import Image from "next/image";

const Photo = ({ photo }: { photo: PhotoType }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  return (
    <div
      ref={ref}
      className="border rounded-3xl overflow-hidden relative"
      style={{
        height: photo.img.height / 2.5,
      }}
    >
      {inView && (
        <Image
          fill
          src={photo.img.src}
          placeholder="blur"
          blurDataURL={photo.base64}
          alt="nothing"
          className="size-full aspect-auto object-cover"
        />
      )}
    </div>
  );
};

export default Photo;
