import { Document } from "@/lib/google"
import { prisma } from "@/lib/prisma"

import { DocumentView } from "./view"

interface Props {
  params: {
    documentId: string
  }
}

export default async function DocumentPage({ params }: Props) {
  const { documentId } = params

  const fileUpload = await prisma.fileUpload.findUnique({
    where: { id: documentId },
    select: {
      id: true,
      document: true,
    },
  })

  const doc = fileUpload?.document as unknown as Document

  return <DocumentView doc={doc} />
}
