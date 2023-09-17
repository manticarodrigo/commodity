import { useEffect, useRef, useState } from "react"
import { imageScale } from "@/utils/image"
import {
  POSITION_NONE,
  ReactSVGPanZoom,
  Tool,
  TOOL_NONE,
  Value,
} from "react-svg-pan-zoom"
import { useDebouncedCallback } from "use-debounce"

interface Props {
  imageData: string
  imageSize: { width: number; height: number }
  children: (props: {
    imageSize: { width: number; height: number; x: number; y: number }
  }) => React.ReactNode
}

const minSize = { width: 10, height: 10 }

const INITIAL_VALUE: Value = {
  version: 2,
  mode: "idle",
  focus: false,
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
  viewerWidth: 0,
  viewerHeight: 0,
  SVGWidth: 0,
  SVGHeight: 0,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  miniatureOpen: false,
}

export function ViewerDoc(props: Props) {
  const viewerRef = useRef<ReactSVGPanZoom>(null)
  const ref1 = useRef<HTMLDivElement>(null)
  const [tool, setTool] = useState<Tool>(TOOL_NONE)
  const [value, setValue] = useState(INITIAL_VALUE)
  const [svgContainerSize, setSvgContainerSize] = useState(minSize)

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.fitToViewer()
    }
  }, [])

  useEffect(() => {
    if (ref1.current) {
      const w = ref1.current.offsetWidth
      const h = ref1.current.offsetHeight
      if (w !== svgContainerSize.width || h !== svgContainerSize.height) {
        setSvgContainerSize({ width: w, height: h })
      }
    }
  }, [svgContainerSize.width, svgContainerSize.height])

  const debouncedHandleResize = useDebouncedCallback(function handleResize() {
    const width = ref1.current?.offsetWidth ?? minSize.width
    const height = ref1.current?.offsetHeight ?? minSize.height
    setSvgContainerSize({ width, height })
  }, 1000)

  useEffect(() => {
    debouncedHandleResize()
    window.addEventListener("resize", debouncedHandleResize)
    return () => {
      window.removeEventListener("resize", debouncedHandleResize)
    }
  }, [])

  const imageSize = imageScale(svgContainerSize, props.imageSize)
  const imageSizeSmaller = {
    width: Math.max(imageSize.width - 10, 0),
    height: Math.max(imageSize.height - 10, 0),
    x: imageSize.x + 5,
    y: imageSize.y + 5,
  }
  return (
    <div
      ref={ref1}
      className="h-full w-full shrink grow overflow-hidden bg-secondary"
    >
      <ReactSVGPanZoom
        ref={viewerRef}
        miniatureProps={{
          position: POSITION_NONE,
          background: "none",
          width: 0,
          height: 0,
        }}
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
          {props.children({ imageSize: imageSizeSmaller })}
        </svg>
      </ReactSVGPanZoom>
    </div>
  )
}
