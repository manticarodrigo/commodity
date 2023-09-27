import { useChat } from "ai/react"
import { Bot, Send, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { Document } from "@/lib/google"

import { useEffectOnce } from "@/hooks/use-effect-once"

import { Badge } from "@/components/ui/badge"

interface Props {
  doc: Document | null
}

export function DocumentChat(props: Props) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    reload,
    isLoading,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "prompt",
        role: "user",
        content: `
      You are a state of the art commodity trading contract processor. Take the appended contract text and follow the instructions below.
  
      List out each clause you recognize in the text from the following options: Seller, Buyer, Quantity, Quality, Packing, Origin, Destination, Delivery, Delivery Method, Price, Payment Terms, Weight, Quality & Packing, Title, Insurance, License, Taxation, Assignment, Insolvence, Exclusions, Force Majeure, Arbitration, Governing Law, Status & Powers
  
      Start with an introduction saying "Here are the clauses I found:"

      Then provide your answer as a simple markdown list with a title and a description or value like so:

      **Seller**
      Acme Inc.

      **Buyer**
      Widget Corp.

      **Force Majeure**
      The fulfillment of this contract adheres to the force majeure rules of the Refined Sugar Association.

      The contract text is appended below:
      ${props.doc?.text ?? ""}
      `,
      },
    ],
  })

  useEffectOnce(() => {
    if (props.doc?.text && !isLoading) {
      reload()
    }
  })

  return (
    <div className="flex grow flex-col rounded-lg bg-secondary">
      <ul className="grow">
        {messages
          .slice(1)
          .filter((m) => m.role !== "system")
          .map((m, index) => (
            <li key={index} className="flex flex-col items-start gap-4 p-4">
              <Badge className="p-2">
                {m.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </Badge>
              <ReactMarkdown className="prose prose-sm whitespace-pre-line prose-p:my-0">
                {m.content}
              </ReactMarkdown>
            </li>
          ))}
      </ul>

      <div className="shrink-0 p-4">
        <form
          className="flex items-center rounded-full bg-foreground text-background placeholder:text-secondary"
          onSubmit={handleSubmit}
        >
          <label className="flex grow">
            <span className="sr-only">Say something...</span>
            <input
              value={input}
              placeholder="Say something..."
              className="grow bg-transparent p-4 outline-none"
              onChange={handleInputChange}
            />
          </label>
          <button
            type="submit"
            className="flex shrink-0 items-center gap-2 border-l border-muted-foreground p-4"
          >
            <span className="sr-only">Send</span>
            <Send className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  )
}
