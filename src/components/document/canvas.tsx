import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Maximize, ZoomIn, ZoomOut } from "lucide-react"
import {
  ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch"

import { Button } from "@/components/ui/button"

interface Props {
  imageData: string
  imageSize: { width: number; height: number }
  children: (props: {
    imageSize: { width: number; height: number; x: number; y: number }
  }) => React.ReactNode
}

const zoomFactor = 8
export function DocumentCanvas(props: Props) {
  const transformRef = useRef<ReactZoomPanPinchContentRef | null>(null)

  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [containerHeight, setContainerHeight] = useState<number>(0)

  const imageScale = useMemo(() => {
    if (
      containerWidth === 0 ||
      containerHeight === 0 ||
      props.imageSize.width === 0 ||
      props.imageSize.height === 0
    ) {
      return 0
    }
    return Math.min(
      containerWidth / props.imageSize.width,
      containerHeight / props.imageSize.height
    )
  }, [containerWidth, containerHeight, props.imageSize])

  const handleResize = useCallback(() => {
    if (container !== null) {
      const rect = container.getBoundingClientRect()
      setContainerWidth(rect.width)
      setContainerHeight(rect.height)
    } else {
      setContainerWidth(0)
      setContainerHeight(0)
    }

    setTimeout(() => {
      transformRef.current?.centerView()
      setTimeout(() => {
        transformRef.current?.zoomOut(zoomFactor)
      }, 500)
    }, 500)
  }, [container])

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [handleResize])

  return (
    <div ref={setContainer} className="h-full w-full bg-foreground/50">
      {imageScale > 0 && (
        <TransformWrapper
          ref={transformRef}
          initialScale={imageScale}
          minScale={imageScale}
          maxScale={imageScale * zoomFactor}
          centerOnInit={true}
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, centerView }) => (
            <React.Fragment>
              <div className="absolute right-4 top-4 z-10 flex flex-col divide-y overflow-hidden rounded-lg bg-background shadow">
                {[
                  {
                    key: "zoomIn",
                    label: "Zoom in",
                    onClick: () => zoomIn(),
                    icon: ZoomIn,
                  },
                  {
                    key: "zoomOut",
                    label: "Zoom out",
                    onClick: () => zoomOut(),
                    icon: ZoomOut,
                  },
                  {
                    key: "resetTransform",
                    label: "Reset transform",
                    onClick: () => {
                      centerView()
                      setTimeout(() => {
                        zoomOut(zoomFactor)
                      }, 500)
                    },
                    icon: Maximize,
                  },
                ].map(({ key, label, onClick, icon: Icon }) => (
                  <div key={key}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none"
                      aria-label={label}
                      onClick={onClick}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                }}
                wrapperClass="cursor-move"
              >
                <svg xmlns="http://www.w3.org/2000/svg" {...props.imageSize}>
                  <image
                    {...props.imageSize}
                    href={`data:image/png;base64,${props.imageData}`}
                  />
                  {props.children({
                    imageSize: { ...props.imageSize, x: 0, y: 0 },
                  })}
                </svg>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      )}
    </div>
  )
}
