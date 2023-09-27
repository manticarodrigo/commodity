import { useChat } from "ai/react"
import { Bot, Send, User } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { Document } from "@/lib/google"

import { Badge } from "@/components/ui/badge"

interface Props {
  doc: Document | null
}

export function DocumentChat(props: Props) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "prompt",
        role: "system",
        content: `
          You are a state of the art document processor. Evaluate the appended text and answer the user's questions based on the provided document context.
          Your response should be formatted as markdown.
          The document text is as follows:
          ${props.doc?.text ?? ""}
      `,
      },
    ],
  })

  const filteredMessages = messages.filter((m) => m.role !== "system")

  return (
    <div className="flex grow flex-col rounded-lg bg-secondary">
      {filteredMessages.length === 0 && (
        <div className="flex grow items-center justify-center">
          <div className="flex flex-col items-center gap-4 p-4">
            <Bot className="h-16 w-16" />
            Ask me a question!
          </div>
        </div>
      )}
      <ul className="grow">
        {filteredMessages.map((m, index) => (
          <li key={index} className="flex flex-col items-start gap-4 p-4">
            <div className="flex items-center gap-2">
              <Badge className="flex items-center gap-2">
                {m.role === "user" ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Bot className="h-3 w-3" />
                )}
                {m.role === "user" ? "You" : "Bot"}
              </Badge>
            </div>
            <ReactMarkdown className="prose prose-sm whitespace-pre-line dark:prose-invert prose-p:my-0">
              {m.content}
            </ReactMarkdown>
          </li>
        ))}
      </ul>
      <div className="shrink-0 p-4">
        <form
          className="flex items-center rounded-full bg-foreground px-2 text-background"
          onSubmit={handleSubmit}
        >
          <label className="flex grow">
            <span className="sr-only">Say something...</span>
            <input
              value={input}
              placeholder="Say something..."
              className="grow bg-transparent px-4 py-2 outline-none placeholder:text-background placeholder:opacity-50"
              onChange={handleInputChange}
            />
          </label>
          <button
            type="submit"
            disabled={!input}
            className="flex shrink-0 items-center gap-2 border-l border-muted-foreground px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="sr-only">Send</span>
            <Send className="h-5 w-5 rotate-45" />
          </button>
        </form>
      </div>
    </div>
  )
}
