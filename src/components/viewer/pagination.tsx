import { useState } from "react"
import { bufferToBase64 } from "@/utils/encoding"

import { Document } from "@/lib/google"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

interface Props {
  data: Document
  onPageChange?: (pageNumber: number) => void
}

export function ViewerPagination(props: Props) {
  const [value, setValue] = useState(0)

  function pageChange(pageNumber: number) {
    setValue(pageNumber)
    if (props.onPageChange) {
      props.onPageChange(pageNumber)
    }
  }

  return (
    <ol className="flex gap-2 bg-gradient-to-t from-slate-950/50 via-slate-900/50">
      {props.data.pages?.map((page, index) => {
        const imageData = `data:image/png;base64,${bufferToBase64(
          page.image?.content?.data
        )}`
        return (
          <li key={index} className="p-2">
            <div
              className={cn(
                "p-2 rounded",
                index === value ? "bg-slate-950/50" : ""
              )}
            >
              <Button
                variant="ghost"
                className={"h-auto rounded px-2 hover:bg-slate-500/50"}
                onClick={() => pageChange(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageData} className="w-16 border" alt="page" />
              </Button>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
