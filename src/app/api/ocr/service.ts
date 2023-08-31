import * as mindee from "mindee"

const mindeeClient = new mindee.Client({ apiKey: process.env.MINDEE_API_KEY })

export async function processFile(name: string, base64: string) {
  const inputSource = mindeeClient.docFromBase64(base64, name)

  console.log("inputSource", inputSource)
  const apiResponse = await mindeeClient
    .parse(mindee.product.InvoiceV4, inputSource)
    .then((res) => {
      console.log("res", res)
      return res
    })
    .catch((err) => {
      console.log("err", err)
      throw err
    })
  return apiResponse.document.toString()
}
