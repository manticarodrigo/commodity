import { Message } from "ai"
import { useChat } from "ai/react"
import {
  Bot,
  RotateCcw,
  RotateCw,
  Send,
  StopCircle,
  Undo,
  User,
} from "lucide-react"
import ReactMarkdown from "react-markdown"

import { Document } from "@/lib/google"

import { Badge } from "@/components/ui/badge"

import { Button } from "./ui/button"

interface Props {
  doc: Document | null
}

export function DocumentChat(props: Props) {
  const prompt: Message = {
    id: "prompt",
    role: "system",
    content: `
    You are a state of the art document processor. Evaluate the appended text and answer the user's questions based on the provided document context.
    Your response should be formatted as rich markdown with bold labels where possible.
    The document text is as follows:
    ${props.doc?.text ?? ""}
`,
  }

  const {
    messages,
    input,
    append,
    stop,
    reload,
    isLoading,
    setMessages,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: "/api/chat",
    initialMessages: [prompt],
  })

  const filteredMessages = messages.filter((m) => m.role !== "system")

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <div className="flex grow items-center justify-center gap-2">
          <h1 className="font-mono font-bold">Copilot chat</h1>
        </div>
      </div>
      {filteredMessages.length === 0 && (
        <div className="flex grow flex-col items-center justify-center gap-4 p-4">
          <p>What are the __ in my document?</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "risks",
              "obligations",
              "rights",
              "terms",
              "missing clauses",
              "errors",
              "inconsistencies",
            ].map((word) => (
              <Button
                key={word}
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  append({
                    role: "user",
                    content: `What are the ${word} in my document?`,
                  })
                }}
              >
                {word}
              </Button>
            ))}
          </div>
          <p></p>
        </div>
      )}
      <ul className="grow overflow-y-auto">
        {filteredMessages.map((m, index) => (
          <li key={index} className="flex flex-col items-start gap-4 p-4">
            <div className="flex items-center gap-2">
              <Badge className="flex items-center gap-2">
                {m.role === "user" ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Bot className="h-3 w-3" />
                )}
                {m.role === "user" ? "You" : "Copilot"}
              </Badge>
            </div>
            <ReactMarkdown className="prose prose-sm whitespace-pre-line dark:prose-invert prose-p:my-0">
              {m.content}
            </ReactMarkdown>
          </li>
        ))}
      </ul>
      <div className="shrink-0 p-4">
        <div className="flex flex-wrap justify-center gap-2 p-4">
          {isLoading ? (
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                stop()
              }}
            >
              <StopCircle className="h-4 w-4" />
              Stop
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={messages.length === 1}
                className="flex items-center gap-2"
                onClick={() => {
                  setMessages([prompt])
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={messages.length === 1}
                className="flex items-center gap-2"
                onClick={() => {
                  setMessages(messages.slice(0, -2))
                }}
              >
                <Undo className="h-4 w-4" />
                Undo
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={messages.length === 1}
                className="flex items-center gap-2"
                onClick={() => {
                  setMessages(messages.slice(0, -1))
                  reload()
                }}
              >
                <RotateCw className="h-4 w-4" />
                Retry
              </Button>
            </>
          )}
        </div>
        <form
          className="flex items-center rounded-full border bg-background px-2"
          onSubmit={handleSubmit}
        >
          <label className="flex grow">
            <span className="sr-only">Ask something...</span>
            <input
              value={input}
              placeholder="Ask something..."
              className="grow bg-transparent px-4 py-2 outline-none placeholder:text-background placeholder:opacity-50"
              onChange={handleInputChange}
            />
          </label>
          <button
            type="submit"
            disabled={!input}
            className="flex shrink-0 items-center gap-2 border-l px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="sr-only">Send</span>
            <Send className="h-5 w-5 rotate-45" />
          </button>
        </form>
      </div>
    </div>
  )
}
