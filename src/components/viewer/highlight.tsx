import { useEffect, useRef } from "react"

import { Entity } from "@/lib/google"

interface Props {
  imageSize: {
    width: number
    height: number
    x: number
    y: number
  }
  onClick?: (entity: Entity) => void
  onMouseOver?: (entity: Entity) => void
  highlight: Entity | null
  entity: Entity
}

export function ViewerEntityHighlight(props: Props) {
  let onMouseOverCallback: (event: MouseEvent) => void
  let onClickCallback: (event: MouseEvent) => void
  if (props.onClick) {
    onClickCallback = props.onClick.bind(null, props.entity)
  }
  if (props.onMouseOver) {
    onMouseOverCallback = props.onMouseOver.bind(null, props.entity)
  }

  const polygon = useRef<SVGPolygonElement>(null)

  useEffect(() => {
    const polygonCopy = polygon.current
    if (onClickCallback) {
      polygon.current?.addEventListener("click", onClickCallback)
    }
    if (onMouseOverCallback) {
      polygon.current?.addEventListener("click", onMouseOverCallback)
    }
    return () => {
      if (onClickCallback) {
        polygonCopy?.removeEventListener("click", onClickCallback)
      }
      if (onMouseOverCallback) {
        polygonCopy?.removeEventListener("click", onMouseOverCallback)
      }
    }
  })

  let highlight = false
  if (props.highlight) {
    if (
      typeof props.highlight === "string" &&
      props.highlight === props.entity.id
    ) {
      highlight = true
    } else if (typeof props.highlight === "boolean") {
      highlight = props.highlight
    } else {
      highlight = props.entity.id === props.highlight.id
    }
  }
  let points = ""
  props.entity.pageAnchor.pageRefs[0].boundingPoly?.normalizedVertices.forEach(
    (point) => {
      if (points.length !== 0) {
        points += " "
      }
      points += `${point.x * props.imageSize.width + props.imageSize.x},${
        point.y * props.imageSize.height + props.imageSize.y
      }`
    }
  )
  let fillColor = "yellow"
  if (highlight) {
    fillColor = "blue"
  }
  return (
    <polygon
      ref={polygon}
      points={points}
      fillOpacity="0.1"
      stroke="blue"
      fill={fillColor}
    />
  )
}
