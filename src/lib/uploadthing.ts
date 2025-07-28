import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Gallery image uploader
  galleryImage: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      // Check if user is authenticated admin
      const authHeader = req.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        throw new UploadThingError("Authentication required");
      }

      const token = authHeader.substring(7);

      // Verify admin token (you can enhance this with proper JWT verification)
      if (!token) {
        throw new UploadThingError("Invalid token");
      }

      return { adminToken: token };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for admin:", metadata.adminToken);
      console.log("File URL:", file.url);
      console.log("File key:", file.key);

      return { uploadedBy: metadata.adminToken, url: file.url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
