export async function fileToString(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = async () => {
      const content = reader.result?.toString().split(",")[1]
      resolve(content ?? "")
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
