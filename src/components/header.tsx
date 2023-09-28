import Image from "next/image"
import Link from "next/link"
import { FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DocumentSelect } from "@/components/document-select"
import { ModeToggle } from "@/components/mode-toggle"

export function Header({
  sheet,
  actions,
}: {
  sheet?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <header className="flex items-center gap-2 border-b px-4 py-2">
      <div className="flex grow items-center gap-2">
        {sheet && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 lg:hidden"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-[500px] max-w-full overflow-y-auto px-4 pt-12 sm:max-w-full lg:hidden"
              side="left"
            >
              {sheet}
            </SheetContent>
          </Sheet>
        )}
        <Link
          href="/"
          className="sr-only flex items-center gap-2 lg:not-sr-only"
        >
          <Image src="/logo.png" alt="" width={120} height={40} />
          {/* <h1 className="font-mono font-bold">Pantaleon</h1> */}
        </Link>
        <span className="hidden lg:block">
          <span className="px-4">/</span>
        </span>
        <DocumentSelect />
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <ModeToggle />
      </div>
    </header>
  )
}
