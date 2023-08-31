"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { UploadFileInput, UploadFileSchema } from "@/schema/ocr"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function RootPage() {
  const mutation = trpc.uploadFile.useMutation()

  const form = useForm<UploadFileInput>({
    resolver: zodResolver(UploadFileSchema),
  })

  return (
    <main className="flex flex-col items-center container p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            const { file } = values
            const reader = new FileReader()
            reader.onloadend = () => {
              mutation.mutate({
                name: file.name,
                base64: reader.result?.toString() ?? "",
              })
            }
            reader.readAsDataURL(file)
          })}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    value={field.value?.fileName}
                    onChange={(event) => {
                      const files = event.target.files
                      if (files?.length) {
                        field.onChange(files[0])
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Upload a file to process.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  )
}
