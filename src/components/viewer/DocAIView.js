import { useEffect, useState } from "react"
import { bufferToBase64 } from "@/utils/encoding"
import { measureImage } from "@/utils/image"
import { Box } from "@mui/material"

import DrawDocument from "./DrawDocument"
import EntityInfoDialog from "./EntityInfoDialog"
import EntityList from "./EntityList"
import NoData from "./NoData"
import PageSelector from "./PageSelector"

function DocAIView(props) {
  const [hilight, setHilight] = useState(null)
  const [entityInfoDialogOpen, setEntityInfoDialogOpen] = useState(false)
  const [entityInfoDialogEntity, setEntityInfoDialogEntity] = useState(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  function entityOnClick(entity) {
    setHilight(entity)
  }

  function onInfoClick(entity) {
    setEntityInfoDialogOpen(true)
    setEntityInfoDialogEntity(entity)
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
      <EntityList
        data={props.data}
        onInfoClick={onInfoClick}
        entityOnClick={entityOnClick}
        hilight={hilight}
      />
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
      <EntityInfoDialog
        open={entityInfoDialogOpen}
        close={() => setEntityInfoDialogOpen(false)}
        entity={entityInfoDialogEntity}
      ></EntityInfoDialog>
    </Box>
  )
}

export default DocAIView
