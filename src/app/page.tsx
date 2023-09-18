"use client"

import React, { useEffect, useState } from "react"
import { bufferToBase64 } from "@/utils/encoding"
import { fileToString } from "@/utils/file"
import { measureImage } from "@/utils/image"
import { FileText, Upload } from "lucide-react"

import { Document, Entity } from "@/lib/google"
import { trpc } from "@/lib/trpc"

import fixture from "@/fixtures/output.json"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { DocumentCanvas } from "@/components/document/canvas"
import { DocumentHighlight } from "@/components/document/highlight"
import { DocumentPagination } from "@/components/document/pagination"
import { EntityPane } from "@/components/entity/pane"
import { ModeToggle } from "@/components/mode-toggle"

export default function RootPage() {
  const [edit, setEdit] = useState(false)
  const [data, setData] = useState<Document | null>(fixture.document)
  const [highlight, setHighlight] = useState<Entity | null>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  const mutation = trpc.processDocument.useMutation()

  const imageData = bufferToBase64(data?.pages[0].image.content.data ?? [])

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

      mutation.mutate(content, {
        onSuccess: (result) => {
          if (result.document) {
            setData(result.document)
          } else {
            setData(null)
          }
        },
      })
    } else {
      setData(null)
    }
  }

  const onClickEntity = (entity: Entity) => {
    setHighlight(entity)
  }

  const isLoading =
    mutation.isLoading ||
    (imageData && imageSize.width === 0 && imageSize.height === 0)

  const missingData = !data || !imageData

  const uploadButton = (
    <label>
      <input className="hidden" accept=".pdf" type="file" onChange={loadFile} />
      <Button asChild size="icon" className="cursor-pointer">
        <span>
          <Upload className="h-4 w-4" />
        </span>
      </Button>
    </label>
  )
  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center border-b px-4 py-2">
        <div className="flex grow items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2 lg:hidden">
                <FileText className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[500px] max-w-full overflow-y-auto px-4 pt-12 sm:max-w-full lg:hidden"
              side="left"
            >
              <EntityPane
                data={data}
                edit={edit}
                onClickEdit={() => setEdit(!edit)}
              />
            </SheetContent>
          </Sheet>
          <h1 className="font-mono font-bold">commodity.ai</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {uploadButton}
        </div>
      </header>
      {isLoading ? (
        <div className="flex flex-col gap-2 p-4">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : missingData ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 py-8">
          <h2 className="font-mono text-lg font-bold">Upload document</h2>
          <p className="text-muted-foreground">
            Load a PDF document from your device to begin processing.
          </p>
          {uploadButton}
        </div>
      ) : (
        <div className="relative flex h-full min-h-0 w-full flex-col lg:flex-row">
          <div className="hidden h-full w-[500px] shrink-0 overflow-y-auto p-4 lg:block">
            <EntityPane
              data={data}
              edit={edit}
              onClickEdit={() => setEdit(!edit)}
            />
          </div>
          <div className="relative flex h-full w-full min-w-0 flex-col">
            <DocumentCanvas imageData={imageData} imageSize={imageSize}>
              {({ imageSize }) => {
                return (
                  <React.Fragment>
                    {data.entities.map((entity) => (
                      <DocumentHighlight
                        key={entity.id}
                        entity={entity}
                        imageSize={imageSize}
                        highlight={highlight}
                        onClick={onClickEntity}
                      />
                    ))}
                  </React.Fragment>
                )
              }}
            </DocumentCanvas>
            <div className="absolute bottom-0 left-0 w-full">
              <DocumentPagination data={data}></DocumentPagination>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
