import { useRef } from "react"

import { Block } from "@/lib/google"

interface Props {
  imageSize: {
    width: number
    height: number
    x: number
    y: number
  }
  block: Block
}

export function DocumentBlock(props: Props) {
  const polygon = useRef<SVGPolygonElement>(null)

  let points = ""
  props.block.layout.boundingPoly.normalizedVertices.forEach((point) => {
    if (points.length !== 0) {
      points += " "
    }
    points += `${point.x * props.imageSize.width + props.imageSize.x},${
      point.y * props.imageSize.height + props.imageSize.y
    }`
  })

  return (
    <polygon
      ref={polygon}
      points={points}
      fillOpacity="0.1"
      className="cursor-pointer fill-green-500 stroke-green-500"
    />
  )
}
