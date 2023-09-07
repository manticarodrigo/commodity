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

export async function measureImage(imageData: string): Promise<Dimensions> {
  return new Promise((resolve) => {
    if (typeof document === "object") {
      const img = document.createElement("img")
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.src = `data:image/png;base64,${imageData}`
    } else {
      resolve({ width: 0, height: 0 })
    }
  })
}
