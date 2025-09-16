import { R2_CLIENT } from "@/cd_r2";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import z from "zod";

export const uploadsRouter = createTRPCRouter({
  image: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
      const objectKey = `uploads/${Date.now()}-${input.filename}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        ContentType: "image/*",
      });

      const uploadUrl = await getSignedUrl(R2_CLIENT, command, {
        expiresIn: 60,
      });

      return {
        success: true,
        message: "Upload link generated!",
        data: {
          uploadUrl,
          imageUrl: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${objectKey}`,
        },
      };
    }),
  video: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
      const objectKey = `uploads/${Date.now()}-${input.filename}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        ContentType: "video/*",
      });

      const uploadUrl = await getSignedUrl(R2_CLIENT, command, {
        expiresIn: 180,
      });

      return {
        success: true,
        message: "Upload link generated!",
        data: {
          uploadUrl,
          videoUrl: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${objectKey}`,
        },
      };
    }),
});
