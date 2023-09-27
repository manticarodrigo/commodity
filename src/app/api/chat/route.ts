import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { messages, prompt } = await req.json()

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    stream: true,
    messages: prompt ? [{ role: "user", content: prompt }] : messages,
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
