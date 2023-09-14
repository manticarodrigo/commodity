import { useState } from "react"
import { bufferToBase64 } from "@/utils/encoding"
import { Tab, Tabs } from "@mui/material"

import { Document } from "@/lib/google"

const desiredImageWidth = 80

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
    <Tabs
      value={value}
      TabIndicatorProps={{
        sx: {
          left: 0,
        },
      }}
      sx={{ backgroundColor: "lightgray" }}
      orientation="vertical"
      onChange={(event, newValue) => {
        pageChange(newValue)
      }}
    >
      {props.data.pages?.map((page, index) => {
        const imageData = `data:image/png;base64,${bufferToBase64(
          page.image?.content?.data
        )}`
        const labelNode = (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageData}
              style={{ width: `${desiredImageWidth}px` }}
              alt="page"
            />
            <br />
            {page.pageNumber}
          </div>
        )
        return <Tab key={index} label={labelNode} />
      })}
    </Tabs>
  )
}
