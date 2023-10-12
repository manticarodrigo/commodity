import { Document } from "@/lib/google"

import { Chat } from "./chat"

interface Props {
  doc: Document | null
  context: unknown
}

export function DocumentChat(props: Props) {
  return (
    <Chat
      prompt={`
          You are a state of the art document processor. Evaluate the appended text and answer the user's questions based on the provided document context.
          Your response should be formatted as rich markdown with bold labels where possible.

          The document text is as follows:
          ${props.doc?.text ?? ""}

          The document context is as follows:
          ${JSON.stringify(props.context)}
      `}
    />
  )
}
