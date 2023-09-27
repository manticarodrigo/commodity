import { bufferToBase64 } from "@/utils/encoding"

import { Document } from "@/lib/google"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Props {
  data: Document
  page: number
  onPageChange: (pageNumber: number) => void
}

export function DocumentPagination(props: Props) {
  return (
    <ol className="flex gap-4 bg-gradient-to-t from-secondary/50 via-secondary/25 p-4">
      {props.data.pages?.map((page, index) => {
        const imageData = `data:image/png;base64,${bufferToBase64(
          page.image?.content?.data
        )}`
        return (
          <li key={index} className="flex flex-col justify-center">
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col gap-2 h-auto rounded hover:bg-secondary/75 border",
                index === props.page ? "bg-secondary/50" : ""
              )}
              onClick={() => props.onPageChange(index)}
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
