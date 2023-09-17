"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { bufferToBase64 } from "@/utils/encoding"
import { fileToString } from "@/utils/file"
import { measureImage } from "@/utils/image"
import { Upload } from "lucide-react"

import { Document, Entity } from "@/lib/google"
import { trpc } from "@/lib/trpc"

import fixture from "@/fixtures/output.json"

import { Button } from "@/components/ui/button"
import { DrawDocument } from "@/components/viewer/doc"
import { EntityHighlight } from "@/components/viewer/highlight"
import { PageSelector } from "@/components/viewer/page-selector"
import { EntityTable } from "@/components/viewer/table"

export default function RootPage() {
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

  async function loadFile(event: React.ChangeEvent<HTMLInputElement>) {
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

  function onClickEntity(entity: Entity) {
    setHighlight(entity)
  }

  const missingData =
    !data || !imageData || (imageSize.width === 0 && imageSize.height === 0)

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center border-b px-4 py-2">
        {/* <h1 className="grow font-bold">CommodityAI</h1> */}
        <div className="grow">
          <Image
            alt=""
            src="/pantaleon.jpg"
            width={468}
            height={177}
            className="h-[40px] w-[105px] object-contain"
          />
        </div>
        <label>
          <input
            className="hidden"
            accept=".pdf"
            type="file"
            onChange={loadFile}
          />
          <Button asChild variant="outline" className="cursor-pointer">
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Upload document
            </span>
          </Button>
        </label>
      </header>
      {mutation.isLoading ? (
        <div className="p-4">
          <h2 className="">Loading...</h2>
        </div>
      ) : missingData ? (
        <div className="p-4">
          <h2>No data.</h2>
          <p>Load a PDF document from your device to begin processing.</p>
        </div>
      ) : (
        <div className="flex h-full min-h-0">
          <div className="h-full w-[500px] overflow-y-auto">
            <EntityTable data={data} />
          </div>
          <div className="flex grow">
            <div className="grow">
              <DrawDocument imageData={imageData} imageSize={imageSize}>
                {({ imageSize }) => {
                  return (
                    <>
                      {data.entities.map((entity) => (
                        <EntityHighlight
                          key={entity.id}
                          entity={entity}
                          imageSize={imageSize}
                          highlight={highlight}
                          onClick={onClickEntity}
                        />
                      ))}
                    </>
                  )
                }}
              </DrawDocument>
            </div>
            <PageSelector data={data}></PageSelector>
          </div>
        </div>
      )}
    </div>
  )
}
