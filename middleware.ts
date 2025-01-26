import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoutes(request)) {
    await auth.protect();
  }
  //   const { userId } = await auth();

  //   if (!userId) return NextResponse.redirect(new URL("/sign-in", request.url));

  //   const user = await (await clerkClient()).users.getUser(userId);

  //   if (!user) return NextResponse.redirect(new URL("/sign-in", request.url));

  //   const { role } = user.publicMetadata;

  //   console.log(`User ${userId} has role ${role}`);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
