type Dimensions = {
  width: number
  height: number
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
