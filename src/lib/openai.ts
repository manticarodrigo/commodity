import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function generateEmbedding(_input: string) {
  const input = _input.replace(/\n/g, " ")
  const embeddingData = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  })
  const [{ embedding }] = embeddingData.data
  return embedding
}
