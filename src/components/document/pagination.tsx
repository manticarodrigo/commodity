import { useState } from "react"
import { bufferToBase64 } from "@/utils/encoding"

import { Document } from "@/lib/google"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Props {
  data: Document
  onPageChange?: (pageNumber: number) => void
}

export function DocumentViewerPagination(props: Props) {
  const [value, setValue] = useState(0)

  function pageChange(pageNumber: number) {
    setValue(pageNumber)
    if (props.onPageChange) {
      props.onPageChange(pageNumber)
    }
  }

  return (
    <ol className="flex gap-2 bg-gradient-to-t from-secondary/50 via-secondary/25">
      {props.data.pages?.map((page, index) => {
        const imageData = `data:image/png;base64,${bufferToBase64(
          page.image?.content?.data
        )}`
        return (
          <li key={index} className="flex flex-col justify-center gap-2 p-2">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col gap-2 h-auto rounded hover:bg-secondary/75 border",
                index === value ? "bg-secondary/50" : ""
              )}
              onClick={() => pageChange(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageData} className="w-16 border" alt="page" />
              <Badge>Page {index + 1}</Badge>
            </Button>
          </li>
        )
      })}
    </ol>
  )
}
