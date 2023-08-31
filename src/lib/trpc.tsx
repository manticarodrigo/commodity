"use client"

import React, { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import superjson from "superjson"

import type { AppRouter } from "@/app/api/trpc/[trpc]/routers/app"

export const trpc = createTRPCReact<AppRouter>()

const Provider = trpc.Provider

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5000 } },
      })
  )

  const url =
    typeof document !== "undefined" &&
    document.location.host &&
    document.location.host !== "localhost:3000"
      ? `https://${document.location.host}/api/trpc/`
      : "http://localhost:3000/api/trpc/"

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url,
          fetch: async (input, init?) => {
            const fetch = getFetch()
            return fetch(input, {
              ...init,
              credentials: "include",
            })
          },
        }),
      ],
      transformer: superjson,
    })
  )
  return (
    <Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Provider>
  )
}
