import { z } from "zod"

import { processFile } from "@/app/api/ocr/service"

import { createRouter, protectedProcedure } from "../trpc"

export const appRouter = createRouter({
  uploadFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        base64: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await processFile(input.name, input.base64)

      console.log("result", !!result)
    }),
})

export type AppRouter = typeof appRouter
