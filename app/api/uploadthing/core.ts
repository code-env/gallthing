import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();

  if (!userId) new UploadThingError("Unauthorized");

  return { userId };
};

export const ourFileRouter = {
  attachment: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      const { userId } = await handleAuth();
      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata: { userId }, file }) => {
      const attachment = await db.photo.create({
        data: {
          url: file.url,
          key: file.key,
          size: file.size,
          name: file.name,
          userId,
        },
      });
      revalidatePath("/photos");
      return { userId, id: attachment.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
