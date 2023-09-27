"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { bufferToBase64 } from "@/utils/encoding"
import { fileToString } from "@/utils/file"
import { measureImage } from "@/utils/image"
import { Upload } from "lucide-react"

import { Document, Entity } from "@/lib/google"
import { trpc } from "@/lib/trpc"

import contract from "@/fixtures/13ba0a2985996da3.json"
import bol from "@/fixtures/929ba35e991edc07.json"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DocumentBlock } from "@/components/document/block"
import { DocumentCanvas } from "@/components/document/canvas"
import { DocumentEntity } from "@/components/document/entity"
import { DocumentPagination } from "@/components/document/pagination"
import { EntityList } from "@/components/entity/list"
import { Header } from "@/components/header"

const outputMap = {
  "13ba0a2985996da3": contract,
  "929ba35e991edc07": bol,
}

export default function RootPage() {
  const params = useParams()
  const processorId = params.processorId as keyof typeof outputMap
  const [doc, setDoc] = useState<Document | null>(
    outputMap[processorId].document
  )
  const [highlight, setHighlight] = useState<Entity | null>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  const [page, setPage] = useState(0)
  const [editable, setEditable] = useState(false)

  const mutation = trpc.processDocument.useMutation()

  const imageData = bufferToBase64(doc?.pages[page].image.content.data ?? [])

  useEffect(() => {
    if (imageData) {
      measureImage(imageData).then((size) => {
        setImageSize(size)
      })
    }
  }, [imageData])

  const loadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files && files[0]) {
      const content = await fileToString(files[0])

      mutation.mutate(
        {
          processorId: params.processorId as string,
          content,
        },
        {
          onSuccess: (result) => {
            if (result.document) {
              setDoc(result.document)
            } else {
              setDoc(null)
            }
          },
        }
      )
    } else {
      setDoc(null)
    }
  }

  const onClickEntity = (entity: Entity) => {
    setHighlight(entity)
  }

  const isLoading =
    mutation.isLoading ||
    (imageData && imageSize.width === 0 && imageSize.height === 0)

  const missingData = !doc || !imageData

  return (
    <div className="flex h-full w-full flex-col">
      <Header
        sheet={
          <EntityList
            doc={doc}
            editable={editable}
            onClickEdit={() => setEditable(!editable)}
          />
        }
        actions={
          <label>
            <input
              className="hidden"
              accept=".pdf"
              type="file"
              onChange={loadFile}
            />
            <Button asChild size="icon" className="cursor-pointer">
              <span>
                <Upload className="h-4 w-4" />
              </span>
            </Button>
          </label>
        }
      />

      {isLoading ? (
        <div className="flex flex-col gap-2 p-4">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : missingData ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-8">
          <div className="text-center">
            <h2 className="font-mono text-lg font-bold">
              Begin document processing
            </h2>
            <p className="text-muted-foreground">
              Select a PDF document from your device to begin processing.
            </p>
          </div>
          <label>
            <input
              className="hidden"
              accept=".pdf"
              type="file"
              onChange={loadFile}
            />
            <Button asChild className="cursor-pointer">
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload document
              </span>
            </Button>
          </label>
        </div>
      ) : (
        <div className="relative flex h-full min-h-0 w-full flex-col lg:flex-row">
          <div className="hidden h-full w-[500px] shrink-0 overflow-y-auto p-4 lg:block">
            <EntityList
              doc={doc}
              editable={editable}
              onClickEdit={() => setEditable(!editable)}
            />
          </div>
          <div className="relative flex h-full w-full min-w-0 flex-col">
            <DocumentCanvas imageData={imageData} imageSize={imageSize}>
              {({ imageSize }) => {
                return (
                  <React.Fragment>
                    {doc.entities.map((entity) => (
                      <DocumentEntity
                        key={entity.id}
                        entity={entity}
                        imageSize={imageSize}
                        highlight={highlight}
                        onClick={onClickEntity}
                      />
                    ))}
                    {(!doc.entities || !doc.entities.length) &&
                      doc.pages[page].blocks.map((block, index) => (
                        <DocumentBlock
                          key={index}
                          block={block}
                          imageSize={imageSize}
                        />
                      ))}
                  </React.Fragment>
                )
              }}
            </DocumentCanvas>
            <div className="absolute bottom-0 left-0 w-full">
              <DocumentPagination
                data={doc}
                page={page}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
