import { useState } from "react"
import { bufferToBase64 } from "@/utils/encoding"

import { Document } from "@/lib/google"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

interface Props {
  data: Document
  onPageChange?: (pageNumber: number) => void
}

export function PageSelector(props: Props) {
  const [value, setValue] = useState(0)

  function pageChange(pageNumber: number) {
    setValue(pageNumber)
    if (props.onPageChange) {
      props.onPageChange(pageNumber)
    }
  }

  return (
    <ol className="flex flex-col bg-gray-300">
      {props.data.pages?.map((page, index) => {
        const imageData = `data:image/png;base64,${bufferToBase64(
          page.image?.content?.data
        )}`
        return (
          <li key={index} className="p-2">
            <Button
              variant="ghost"
              className={cn(
                "px-2 h-auto",
                index === value ? "bg-secondary" : ""
              )}
              onClick={() => pageChange(index)}
            >
              <div className="">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageData} className="w-32 border" alt="page" />
                <br />
                {page.pageNumber}
              </div>
            </Button>
          </li>
        )
      })}
    </ol>
  )
}
