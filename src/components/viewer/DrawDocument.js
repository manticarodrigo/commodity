import { useEffect, useRef, useState } from "react"
import { imageScale } from "@/utils/image"
import { Box } from "@mui/material"
import PropTypes from "prop-types"
import {
  INITIAL_VALUE,
  POSITION_NONE,
  ReactSVGPanZoom,
  TOOL_NONE,
} from "react-svg-pan-zoom"

import EntityHilight from "./EntityHilight"

let timer
function debounce(fn, ms) {
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}

function DrawDocument(props) {
  const minSize = { width: 10, height: 10 }
  const viewerRef = useRef(null)
  const ref1 = useRef(null)
  const [tool, setTool] = useState(TOOL_NONE)
  const [value, setValue] = useState(INITIAL_VALUE)
  const [svgContainerSize, setSvgContainerSize] = useState(minSize)

  // When the Dom has rendered, fit the SVG to viewer.
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.fitToViewer()
    }
  }, [])

  // Handle a calculation of the container size.
  useEffect(() => {
    if (ref1.current) {
      const br = ref1.current.getBoundingClientRect()
      const w = ref1.current.offsetWidth
      const h = ref1.current.offsetHeight
      console.log(
        `useEffect: NewSize:: ${w}x${h}, currentSize: ${
          svgContainerSize.width
        }x${svgContainerSize.height} ${JSON.stringify(br)}`
      )
      if (w !== svgContainerSize.width || h !== svgContainerSize.height) {
        setSvgContainerSize({ width: w, height: h })
      }
    }
  }, [svgContainerSize.width, svgContainerSize.height])

  // Handle a window resize.
  useEffect(() => {
    //console.log("Resize handler added!")

    const debouncedHandleResize = debounce(function handleResize() {
      /*
      if (ref1.current) {
        const w = ref1.current.offsetWidth
        const h = ref1.current.offsetHeight
        //console.log(`Resize:: ${w}x${h}`)
      }
      */
      //setRefreshState(refreshState+1)

      //console.log(`Setting the size to ${minSize.width}x${minSize.height}`)
      setSvgContainerSize(minSize) // The window has resized.  Set the Svg size to something small that will force a resize.
    }, 1000)

    //console.log("Adding window resize handler")
    window.addEventListener("resize", debouncedHandleResize)

    return () => {
      //console.log("Removing window resize handler")
      window.removeEventListener("resize", debouncedHandleResize)
    }
  }, [minSize])

  /**
   * Invoked when an entity on the SVG is cliecked.
   * @param {*} entity The entity that was clicked.
   * @param {*} evt
   */
  function entityClick(entity) {
    if (props.entityOnClick) {
      props.entityOnClick(entity)
    }
  }
  // Determine the optimal size of the image

  /**
   * Image an image that is 600x800 (imageWidth x imageHeight)
   * Image a viewport that is 100x100 (viewWidth x viewHeight)
   * What should the image size be?
   * Well, the height of the image should be 100 as that would maximize the image height
   * But what of the width?  It should be 600 x whatever we scaled the height.  The height scalled from 800->100.
   * This is a multiplier of (viewHeight/imageHeight)
   */
  const imageSize = imageScale(svgContainerSize, props.imageSize)
  const imageSizeSmaller = {
    width: Math.max(imageSize.width - 10, 0),
    height: Math.max(imageSize.height - 10, 0),
    x: imageSize.x + 5,
    y: imageSize.y + 5,
  }
  return (
    <Box
      ref={ref1}
      style={{
        flexGrow: 1,
        flexShrink: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "purple",
        overflow: "hidden",
      }}
    >
      <ReactSVGPanZoom
        ref={viewerRef}
        miniatureProps={{ position: POSITION_NONE }}
        SVGBackground="none"
        detectAutoPan={false}
        width={svgContainerSize.width}
        height={svgContainerSize.height}
        tool={tool}
        onChangeTool={setTool}
        value={value}
        onChangeValue={setValue}
        onClick={(event) =>
          console.log("click", event.x, event.y, event.originalEvent)
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={imageSize.width}
          height={imageSize.height}
          style={{
            borderColor: "lightgrey",
            borderStyle: "solid",
            borderWidth: "1px",
          }}
        >
          <image
            width={imageSizeSmaller.width}
            height={imageSizeSmaller.height}
            x={imageSizeSmaller.x}
            y={imageSizeSmaller.y}
            href={`data:image/png;base64,${props.imageData}`}
          />
          {
            // Draw an entity (an SVG Polygon) hilighter for each of the entities that we find.
            props.entities.map((entity) => {
              return (
                <EntityHilight
                  key={entity.id}
                  imageSize={imageSizeSmaller}
                  entity={entity}
                  onClick={entityClick}
                  hilight={props.hilight}
                />
              )
            })
          }
        </svg>
      </ReactSVGPanZoom>
    </Box>
  )
} // DrawDocument

DrawDocument.propTypes = {
  imageData: PropTypes.string.isRequired,
  imageSize: PropTypes.object.isRequired,
  entityOnClick: PropTypes.func,
  hilight: PropTypes.object,
  entities: PropTypes.array,
}

export default DrawDocument
