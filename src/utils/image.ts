type Dimensions = {
  width: number
  height: number
}

export function imageScale(view: Dimensions, image: Dimensions) {
  let width
  let height
  if (image.height > image.width) {
    height = view.height
    width = (image.width * height) / image.height
  } else {
    width = view.width
    height = (image.height * width) / image.width
  }
  const x = view.width / 2 - width / 2
  const y = 0
  return { width: width, height: height, x, y: y }
}
