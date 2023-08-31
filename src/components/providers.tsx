"use client"

import { PropsWithChildren } from "react"

import { TrpcProvider } from "@/lib/trpc"

export function Providers(props: PropsWithChildren) {
  return <TrpcProvider>{props.children}</TrpcProvider>
}
