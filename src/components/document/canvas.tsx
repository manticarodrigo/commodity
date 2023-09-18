import React, { useEffect, useRef, useState } from "react"
import { imageScale } from "@/utils/image"
import { Maximize, ZoomIn, ZoomOut } from "lucide-react"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { useDebouncedCallback } from "use-debounce"

import { Button } from "@/components/ui/button"

interface Props {
  imageData: string
  imageSize: { width: number; height: number }
  children: (props: {
    imageSize: { width: number; height: number; x: number; y: number }
  }) => React.ReactNode
}

const minSize = { width: 0, height: 0 }

export function DocumentCanvas(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgContainerSize, setSvgContainerSize] = useState(minSize)

  const debouncedHandleResize = useDebouncedCallback(
    () => {
      const width = containerRef.current?.offsetWidth ?? minSize.width
      const height = containerRef.current?.offsetHeight ?? minSize.height
      setSvgContainerSize({ width, height })
    },
    1000,
    {
      leading: true,
      trailing: true,
      maxWait: 1000,
    }
  )

  useEffect(() => {
    debouncedHandleResize()
    window.addEventListener("resize", debouncedHandleResize)
    return () => {
      window.removeEventListener("resize", debouncedHandleResize)
    }
  }, [])

  const imageSize = imageScale(svgContainerSize, props.imageSize)

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full shrink grow items-center justify-center bg-foreground/50"
    >
      {!!(svgContainerSize.width && svgContainerSize.height) && (
        <TransformWrapper limitToBounds={false}>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <React.Fragment>
              <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
                <Button variant="outline" size="icon" onClick={() => zoomIn()}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => zoomOut()}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => resetTransform()}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
              <TransformComponent>
                <div
                  className="flex cursor-move items-center justify-center"
                  style={{
                    width: svgContainerSize.width,
                    height: svgContainerSize.height,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={imageSize.width}
                    height={imageSize.height}
                  >
                    <image
                      width={imageSize.width}
                      height={imageSize.height}
                      href={`data:image/png;base64,${props.imageData}`}
                    />
                    {props.children({
                      imageSize: { ...imageSize, x: 0, y: 0 },
                    })}
                  </svg>
                </div>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      )}
    </div>
  )
}
