import { z } from "zod"

import { processDocument, Response } from "@/lib/google"

import { createRouter, protectedProcedure } from "../trpc"

export const appRouter = createRouter({
  processDocument: protectedProcedure
    .input(
      z.object({
        processorId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await processDocument(input.processorId, input.content)

      return JSON.parse(JSON.stringify(result)) as Response
    }),
})

export type AppRouter = typeof appRouter
