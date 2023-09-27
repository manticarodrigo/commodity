import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { appRouter } from "./routers/app"

export const runtime = "nodejs"

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: function (): object | Promise<object> {
      return {}
    },
  })
}

export { handler as GET, handler as POST }
