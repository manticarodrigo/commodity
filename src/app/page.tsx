"use client"

import { Settings, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Chat } from "@/components/chat"
import { Header } from "@/components/header"

import { DocumentTable } from "./table"

export default function RootPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <Header />
      <div className="relative flex h-full min-h-0 w-full flex-col lg:flex-row">
        <div className="hidden h-full shrink-0 flex-col overflow-y-auto border-x lg:flex">
          <ul className="flex flex-col gap-2 p-2">
            <li>
              <Button variant="secondary" size="icon">
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload documents</span>
              </Button>
            </li>
            <li>
              <Button variant="secondary" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </li>
          </ul>
        </div>
        <div className="h-full w-full min-w-0 overflow-auto p-4">
          <DocumentTable />
        </div>
        <div className="hidden h-full w-[400px] shrink-0 flex-col overflow-y-auto border-l lg:flex">
          <Chat
            prompt={`
                You are a state of the art document processor. Evaluate the appended text and answer the user's questions based on the provided document context.
                Your response should be formatted as rich markdown with bold labels where possible.
            `}
          />
        </div>
      </div>
    </div>
  )
}
