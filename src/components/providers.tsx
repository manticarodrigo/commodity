"use client"

import { PropsWithChildren } from "react"
import { ThemeProvider } from "next-themes"

import { TrpcProvider } from "@/lib/trpc"

export function Providers(props: PropsWithChildren) {
  return (
    <TrpcProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {props.children}
      </ThemeProvider>
    </TrpcProvider>
  )
}
