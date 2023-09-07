/* eslint-disable @typescript-eslint/no-explicit-any */
import DocumentAI from "@google-cloud/documentai"

const { DocumentProcessorServiceClient } = DocumentAI.v1

const projectId = "896559694339"
const processorId = "99eeb3da01c05ed9"

const client = new DocumentProcessorServiceClient({
  apiEndpoint: "us-documentai.googleapis.com",
  credentials: {
    private_key: process.env.GOOGLE_DOCUMENTAI_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    ),
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

export interface Response {
  document: Document
  humanReviewStatus: HumanReviewStatus
}

export interface Document {
  textStyles: any[]
  pages: Page[]
  entities: Entity[]
  entityRelations: any[]
  revisions: any[]
  textChanges: any[]
  mimeType: string
  text: string
  shardInfo: null
  error: null
  uri: string
  source: string
}

export interface Entity {
  properties: Property[]
  textAnchor: TextAnchor | null
  type: string
  mentionText: string
  mentionId: string
  confidence: number
  pageAnchor: PageAnchor
  id: string
  normalizedValue: EntityNormalizedValue | null
  provenance: null
  redacted: boolean
}

export interface EntityNormalizedValue {
  text: string
  dateValue?: DateValue
  structuredValue?: string
}

export interface DateValue {
  year: number
  month: number
  day: number
}

export interface PageAnchor {
  pageRefs: PageRef[]
}

export interface PageRef {
  page: string
  layoutType: LayoutType
  layoutId: string
  boundingPoly: BoundingPoly | null
  confidence: number
}

export interface BoundingPoly {
  vertices: Vertex[]
  normalizedVertices: Vertex[]
}

export interface Vertex {
  x: number
  y: number
}

export type LayoutType = string

export interface Property {
  properties: any[]
  textAnchor: TextAnchor
  type: string
  mentionText: string
  mentionId: string
  confidence: number
  pageAnchor: PageAnchor
  id: string
  normalizedValue: PropertyNormalizedValue | null
  provenance: null
  redacted: boolean
}

export interface PropertyNormalizedValue {
  text: string
}

export interface TextAnchor {
  textSegments: TextSegment[]
  content: string
}

export interface TextSegment {
  startIndex: string
  endIndex: string
}

export interface Page {
  detectedLanguages: DetectedLanguage[]
  blocks: Block[]
  paragraphs: Block[]
  lines: Block[]
  tokens: Token[]
  visualElements: any[]
  tables: any[]
  formFields: any[]
  symbols: any[]
  transforms: any[]
  detectedBarcodes: any[]
  pageNumber: number
  dimension: Dimension
  layout: Layout
  image: Image
  provenance: null
  imageQualityScores: null
}

export interface Block {
  detectedLanguages: DetectedLanguage[]
  layout: Layout
  provenance: null
}

export interface DetectedLanguage {
  languageCode: LanguageCode
  confidence: number
}

export type LanguageCode = string

export interface Layout {
  textAnchor: TextAnchor
  confidence: number
  boundingPoly: BoundingPoly
  orientation: string
}

export interface Dimension {
  width: number
  height: number
  unit: string
}

export interface Image {
  content: Content
  mimeType: string
  width: number
  height: number
}

export interface Content {
  type: string
  data: number[]
}

export interface Token {
  detectedLanguages: DetectedLanguage[]
  layout: Layout
  detectedBreak: DetectedBreak | null
  provenance: null
  styleInfo: null
}

export interface DetectedBreak {
  type: string
}

export interface HumanReviewStatus {
  state: string
  stateMessage: string
  humanReviewOperation: string
}
