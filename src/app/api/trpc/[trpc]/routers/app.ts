import { del } from "@vercel/blob"
import { z } from "zod"

import { processDocument, Response } from "@/lib/google"
import { prisma } from "@/lib/prisma"

import { createRouter, protectedProcedure } from "../trpc"

export const appRouter = createRouter({
  processDocument: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await processDocument(input.content)

      return JSON.parse(JSON.stringify(result)) as Response
    }),
  deleteFileUploads: protectedProcedure
    .input(
      z.object({
        fileUploadIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const exisingFileUploads = await prisma.fileUpload.findMany({
        where: {
          id: {
            in: input.fileUploadIds,
          },
        },
        select: {
          url: true,
        },
      })

      del(exisingFileUploads.map((fileUpload) => fileUpload.url))

      const result = await prisma.fileUpload.deleteMany({
        where: {
          id: {
            in: input.fileUploadIds,
          },
        },
      })

      return result
    }),
})

export type AppRouter = typeof appRouter
