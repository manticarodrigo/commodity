import DocumentAI from "@google-cloud/documentai"

const { DocumentProcessorServiceClient } = DocumentAI.v1

const projectId = "896559694339"
const processorId = "99eeb3da01c05ed9"

const client = new DocumentProcessorServiceClient({
  apiEndpoint: "us-documentai.googleapis.com",
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
