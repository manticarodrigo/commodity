import { useEffect, useState } from "react"
import { bufferToBase64 } from "@/utils/encoding"
import { measureImage } from "@/utils/image"
import { Box } from "@mui/material"

import { Document, Entity } from "@/lib/google"

import DrawDocument from "./DrawDocument"
import EntityList from "./EntityList"
import NoData from "./NoData"
import PageSelector from "./PageSelector"

interface Props {
  data: Document | null
}

function DocAIView(props: Props) {
  const [hilight, setHilight] = useState<Entity | null>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  function entityOnClick(entity: Entity) {
    setHilight(entity)
  }

  useEffect(() => {
    setImageSize({ width: 0, height: 0 })
  }, [props.data])

  if (!props.data) {
    return <NoData />
  }

  const imageData = bufferToBase64(props.data.pages[0].image.content.data)

  if (imageSize.width === 0 && imageSize.height === 0) {
    measureImage(imageData).then((size) => {
      setImageSize(size)
    })
    return <NoData />
  }

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <EntityList data={props.data} />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "row" }}>
        <Box sx={{ flexGrow: 1 }}>
          <DrawDocument
            imageData={imageData}
            imageSize={imageSize}
            entities={props.data.entities}
            hilight={hilight}
            entityOnClick={entityOnClick}
          />
        </Box>
        <Box>
          <PageSelector data={props.data}></PageSelector>
        </Box>
      </Box>
    </Box>
  )
}

export default DocAIView
