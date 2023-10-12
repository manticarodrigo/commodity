import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import invariant from "tiny-invariant"

import { processDocument } from "@/lib/google"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")
  const type = searchParams.get("type") as
    | "BILL_OF_LADING"
    | "CONTRACT"
    | "INVOICE"

  invariant(filename, "Filename is missing")
  invariant(type, "Type is missing")
  invariant(request.body, "Request body is missing")

  const file = await request.arrayBuffer()
  const content = Buffer.from(file).toString("base64")

  const [blob, response] = await Promise.all([
    put(filename, file, {
      access: "public",
    }),
    processDocument(content),
  ])

  const fileUpload = await prisma.fileUpload.create({
    data: {
      name: filename,
      type,
      url: blob.url,
      document: response.document as { [key: string]: string },
    },
    select: {
      id: true,
    },
  })

  return NextResponse.json(fileUpload)
}
