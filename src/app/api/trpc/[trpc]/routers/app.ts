import { FileUpload } from "@prisma/client"
import { del } from "@vercel/blob"
import { z } from "zod"

import { processDocument, Response } from "@/lib/google"
import { generateEmbedding } from "@/lib/openai"
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
  searchFileUploads: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { query } = input

      if (query.trim().length === 0) return []

      const embedding = await generateEmbedding(query)
      const vectorQuery = `[${embedding.join(",")}]`
      const fileUpload = await prisma.$queryRaw`
        SELECT
          "id",
          "name",
          "type",
          "url",
          "createdAt",
          1 - (embedding <=> ${vectorQuery}::vector) as similarity
        FROM "FileUpload"
        where 1 - (embedding <=> ${vectorQuery}::vector) > .5
        ORDER BY  similarity DESC
        LIMIT 8;
      `

      return fileUpload as Array<
        Pick<FileUpload, "id" | "name" | "type" | "url" | "createdAt"> & {
          similarity: number
        }
      >
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
