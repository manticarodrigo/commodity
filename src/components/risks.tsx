import { useState } from "react"
import { useParams } from "next/navigation"
import { AlertTriangle, Check, Loader } from "lucide-react"

import { useEffectOnce } from "@/hooks/use-effect-once"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const delay = 5000
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function DocumentRisks() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffectOnce(() => {
    setIsLoading(true)
    sleep(delay).then(() => {
      setIsLoading(false)
    })
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 pr-2">
        <Loader className="h-4 w-4 animate-spin rounded-full text-blue-600" />
        <div className="text-sm text-gray-500">Analyzing document...</div>
      </div>
    )
  }

  if (params.processorId === "13ba0a2985996da3") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-800 dark:hover:bg-amber-700"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Review risks
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Risks identified</DialogTitle>
            <DialogDescription>
              While reviewing this contract, several potential risks emerge,
              most notably around payment, delivery, and dispute resolution
              terms. Here is an assessment of the identified risks:
            </DialogDescription>
          </DialogHeader>
          <ul className="prose prose-sm overflow-y-auto dark:prose-invert sm:max-h-[70vh]">
            <li>
              <strong>Payment Risk:</strong>
              <p>
                Clause 8 states that 10% pre-payment is required at the time of
                nomination, with the remaining 90% to be paid against scanned
                copy of the original shipment documents within 2 working days.
                This poses a risk if the goods are not as per the required
                specifications or are damaged, as you will have already paid 90%
                of the price.
              </p>
            </li>
            <li>
              <strong>Delivery and Shipment Risk:</strong>
              <p>
                The shipment dates, mentioned in Clause 5, are very specific.
                Any delay in shipment from the mentioned dates can lead to
                complications, and it’s not clear who bears the responsibility
                for delays.
              </p>
              <p>
                The use of the term “FOB” in Clause 6 implies the buyer assumes
                responsibility for loss or damage of goods once they are on the
                shipping vessel, as stated in Clause 14 and 15, potentially
                leading to disputes over damaged goods.
              </p>
            </li>
            <li>
              <strong>Quality and Quantity Risk:</strong>
              <p>
                Clause 2 and 4 mention the quality and packing specifications,
                but there are no clear remedies listed for any discrepancies
                found in quality and quantity.
              </p>
              <p>
                Clause 18 states that the weight, quality, quantity, and packing
                are all final at the time of loading at origin as per
                manufacturer’s factories’ or their appointed agents’
                certificates, meaning any discrepancies discovered later may not
                be actionable.
              </p>
            </li>
          </ul>
          <DialogFooter>
            <Button type="submit">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex h-full items-center justify-center gap-2 pr-2">
      <Check className="h-4 w-4 rounded-full text-green-600" />
      <div className="text-sm text-muted-foreground">No risks found</div>
    </div>
  )
}
