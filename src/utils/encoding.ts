export function bufferToBase64(data: number[]): string {
  return Buffer.from(data).toString("base64")
}
