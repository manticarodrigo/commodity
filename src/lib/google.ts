import DocumentAI from "@google-cloud/documentai"

const { DocumentProcessorServiceClient } = DocumentAI.v1

const projectId = "896559694339"
const processorId = "99eeb3da01c05ed9"

const client = new DocumentProcessorServiceClient({
  apiEndpoint: "us-documentai.googleapis.com",
  credentials: {
    private_key: process.env.GOOGLE_DOCUMENTAI_PRIVATE_KEY,
    client_email: "commodity-ai@commodity-ai.iam.gserviceaccount.com",
  },
})

export async function processDocument(content: string) {
  const name = `projects/${projectId}/locations/us/processors/${processorId}`
  const request = {
    name: name,
    rawDocument: {
      content,
      mimeType: "application/pdf",
    },
  }

  const [result] = await client.processDocument(request)

  return result
}
