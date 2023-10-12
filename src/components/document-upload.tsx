"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DocumentUpload() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          {uploading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="sr-only">Upload documents</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload documents</DialogTitle>
          <DialogDescription>
            Select pdf files to be processed by the system
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (event) => {
            event.preventDefault()

            const formData = new FormData(event.target as HTMLFormElement)

            const files = formData.getAll("files") as File[]
            const type = formData.get("type") as string

            if (!files) {
              throw new Error("No files selected")
            }

            setUploading(true)

            await Promise.all(
              Array.from(files).map(async (file) => {
                await fetch(
                  `/api/upload?filename=${encodeURIComponent(
                    file.name
                  )}&type=${encodeURIComponent(type)}`,
                  {
                    method: "POST",
                    body: file,
                  }
                )
              })
            )

            setUploading(false)

            router.refresh()
          }}
        >
          <Label>
            <div className="mb-2">Document type</div>
            <Select required name="type">
              <SelectTrigger>
                <SelectValue placeholder="Select a document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Types</SelectLabel>
                  <SelectItem value="BILL_OF_LADING">Bill of lading</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                  <SelectItem value="INVOICE">Invoice</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
          <Label>
            <div className="mb-2">Files</div>
            <Input name="files" multiple type="file" accept=".pdf" />
          </Label>
          <Button type="submit">
            {uploading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload documents
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
