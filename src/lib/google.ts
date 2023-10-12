/* eslint-disable @typescript-eslint/no-explicit-any */
import DocumentAI from "@google-cloud/documentai"

const { DocumentProcessorServiceClient } = DocumentAI.v1

const processorId = "13ba0a2985996da3"
const projectId = "896559694339"

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

  // await promises.writeFile(
  //   `src/fixtures/${processorId}.json`,
  //   JSON.stringify(result)
  // )

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
  properties: any[]
  textAnchor: TextAnchor
  type: string
  mentionText: string
  mentionId: string
  confidence: number
  pageAnchor: PageAnchor
  id: string
  normalizedValue: NormalizedValue | null
  provenance: null
  redacted: boolean
}

export interface NormalizedValue {
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
  layoutType: string
  layoutId: string
  boundingPoly: BoundingPoly
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
  visualElements: VisualElement[]
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
  textAnchor: TextAnchor | null
  confidence: number
  boundingPoly: BoundingPoly
  orientation: Orientation
}

export type Orientation = string

export interface Dimension {
  width: number
  height: number
  unit: string
}

export interface Image {
  content: string
  mimeType: string
  width: number
  height: number
}

export interface Token {
  detectedLanguages: DetectedLanguage[]
  layout: Layout
  detectedBreak: DetectedBreak | null
  provenance: null
  styleInfo: null
}

export interface DetectedBreak {
  type: DetectedBreakType
}

export type DetectedBreakType = string

export interface VisualElement {
  detectedLanguages: any[]
  layout: Layout
  type: string
}

export interface HumanReviewStatus {
  state: string
  stateMessage: string
  humanReviewOperation: string
}

export const ENTITY_TYPES = {
  CUSTOMER_ORDER_ADDITIONAL_SHIPPER_INFO:
    "customer_order_additional_shipper_info",
  CUSTOMER_ORDER_COD: "customer_order_cod",
  CUSTOMER_ORDER_DESCRIPTION: "customer_order_description",
  CUSTOMER_ORDER_NUMBER: "customer_order_number",
  CUSTOMER_ORDER_PACKAGE_NUMBER: "customer_order_package_number",
  CUSTOMER_ORDER_PACKAGE_TYPE: "customer_order_package_type",
  CUSTOMER_ORDER_TYPE: "customer_order_type",
  CUSTOMER_ORDER_WEIGHT: "customer_order_weight",
  DOCUMENT_DATE: "document_date",
  DOCUMENT_NUMBER: "document_number",
  FREIGHT_BILL_TO_ADDRESS: "freight_bill_to_address",
  FREIGHT_BILL_TO_CITY: "freight_bill_to_city",
  FREIGHT_BILL_TO_COUNTRY: "freight_bill_to_country",
  FREIGHT_BILL_TO_NAME: "freight_bill_to_name",
  FREIGHT_BILL_TO_STATE: "freight_bill_to_state",
  FREIGHT_BILL_TO_ZIP: "freight_bill_to_zip",
  FREIGHT_CARRIER_ALPHA_CODE: "freight_carrier_alpha_code",
  FREIGHT_CARRIER_NAME: "freight_carrier_name",
  FREIGHT_CHARGE_TERMS_COLLECT: "freight_charge_terms_collect",
  SHIP_FROM_ADDRESS: "ship_from_address",
  SHIP_FROM_CITY: "ship_from_city",
  SHIP_FROM_NAME: "ship_from_name",
  SHIP_FROM_SID: "ship_from_sid",
  SHIP_FROM_STATE: "ship_from_state",
  SHIP_FROM_ZIP: "ship_from_zip",
  SHIP_TO_ADDRESS: "ship_to_address",
  SHIP_TO_CID: "ship_to_cid",
  SHIP_TO_CITY: "ship_to_city",
  SHIP_TO_COUNTRY: "ship_to_country",
  SHIP_TO_NAME: "ship_to_name",
  SHIP_TO_STATE: "ship_to_state",
  SHIP_TO_ZIP: "ship_to_zip",
}
