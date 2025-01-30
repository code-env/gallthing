import DropZone from "@/components/dropzone";
import { Icons } from "@/components/icons";
import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Photo } from "@prisma/client";
import Images from "./photos";
import { Suspense } from "react";
import { getImages } from "@/lib/images";

const Photos = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await (await clerkClient()).users.getUser(userId);

  const userInDb = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userInDb) {
    const email = user.emailAddresses[0].emailAddress;
    await db.user.create({
      data: {
        id: user.id,
        email,
        username: email.split("@")[0],
      },
    });
  }

  const photos = await db.photo.findMany({
    where: {
      userId,
    },
  });

  const urls = photos.map((photo) => photo.url);

  const images = await getImages(urls);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative">
        <DropZone />
        {photos.length === 0 && (
          <div className="absolute inset-0 m-auto size-fit flex flex-col items-center justify-center gap-8">
            <Icons.empty />
            <h1 className="text-5xl font-semibold">
              Ready to add some Photos?
            </h1>
            <p className="text-xl text-center">
              Drag and drop your photos videos anywhere to upload.
            </p>
          </div>
        )}

        {photos.length > 0 && <Images photos={images} />}
      </div>
    </Suspense>
  );
};

export default Photos;
