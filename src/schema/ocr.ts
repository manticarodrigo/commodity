import { z } from "zod"

const BYTES_IN_MEGABYTE = 1024 * 1024
const MAX_FILE_BYTES = 5 * BYTES_IN_MEGABYTE // 5MB

const ACCEPTED_IMAGE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
  "image/heic",
]

export const UploadFileSchema = z.object({
  file: z
    .any()
    .refine((file) => Boolean(file), "File is required.")
    .refine(
      (file) => file.size <= MAX_FILE_BYTES,
      `Max file size is ${MAX_FILE_BYTES / BYTES_IN_MEGABYTE}MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `${ACCEPTED_IMAGE_TYPES.map((type) => type.split("/")[1]).join(
        ", "
      )} files are accepted.`
    ),
})

export type UploadFileInput = z.infer<typeof UploadFileSchema>
