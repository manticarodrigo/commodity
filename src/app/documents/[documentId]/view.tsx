"use client"

import React, { useEffect, useState } from "react"
import { measureImage } from "@/utils/image"

import { Document, Entity } from "@/lib/google"
import { trpc } from "@/lib/trpc"

import { useEffectOnce } from "@/hooks/use-effect-once"

import { Skeleton } from "@/components/ui/skeleton"
import { DocumentChat } from "@/components/document-chat"
import { DocumentBlock } from "@/components/document/block"
import { DocumentCanvas } from "@/components/document/canvas"
import { DocumentEntity } from "@/components/document/entity"
import { DocumentPagination } from "@/components/document/pagination"
import { EntityList } from "@/components/entity/list"
import { Header } from "@/components/header"

export function DocumentView({ doc }: { doc: Document | null }) {
  const [highlight, setHighlight] = useState<Entity | null>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  const [page, setPage] = useState(0)
  const [editable, setEditable] = useState(false)
  const [context, setContext] = useState<Record<string, string> | null>(null)

  const mutation = trpc.processDocument.useMutation()

  const imageData = doc?.pages[page].image.content ?? ""

  const isLoading =
    mutation.isLoading ||
    (imageData && imageSize.width === 0 && imageSize.height === 0)

  useEffectOnce(() => {
    async function fetchAll() {
      const [costs, trades] = await Promise.all([
        fetch("/fixtures/costs.csv").then((res) => res.text()),
        fetch("/fixtures/trades.csv").then((res) => res.text()),
      ])
      setContext({
        costs,
        trades,
      })
    }
    fetchAll()
  })
  useEffect(() => {
    if (imageData) {
      measureImage(imageData).then((size) => {
        setImageSize(size)
      })
    }
  }, [imageData])

  const onClickEntity = (entity: Entity) => {
    setHighlight(entity)
  }

  const missingData = !doc || !imageData

  return (
    <div className="flex h-full w-full flex-col">
      <Header
        sheet={
          <div className="p-4">
            <EntityList
              doc={doc}
              editable={editable}
              onClickEdit={() => setEditable(!editable)}
            />
          </div>
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
            <h2 className="font-mono text-lg font-bold">No document found.</h2>
            <p className="text-muted-foreground">
              Go back to the homepage and upload a document.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative flex h-full min-h-0 w-full flex-col lg:flex-row">
          <div className="hidden h-full w-[400px] shrink-0 overflow-y-auto lg:block">
            <div className="p-4">
              <EntityList
                doc={doc}
                editable={editable}
                onClickEdit={() => setEditable(!editable)}
              />
            </div>
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
          <div className="hidden h-full w-[400px] shrink-0 flex-col overflow-y-auto lg:flex">
            <DocumentChat doc={doc} context={context} />
          </div>
        </div>
      )}
    </div>
  )
}
