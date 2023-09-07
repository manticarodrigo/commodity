"use client"

import { useState } from "react"
import { fileToString } from "@/utils/file"
import { AppBar, Button, Divider, Toolbar, Typography } from "@mui/material"

import { Document } from "@/lib/google"
import { trpc } from "@/lib/trpc"
import fixture from "@/fixtures/output.json"
import DocAIView from "@/components/viewer/DocAIView"

export default function RootPage() {
  const [data, setData] = useState<Document | null>(fixture.document)

  const mutation = trpc.processDocument.useMutation()

  async function loadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target
    if (files && files[0]) {
      const content = await fileToString(files[0])

      mutation.mutate(content, {
        onSuccess: (result) => {
          if (result.document) {
            setData(result.document)
          } else {
            setData(null)
          }
        },
      })
    } else {
      setData(null)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CommodityAI
          </Typography>
          <label>
            <input
              className="hidden"
              accept=".json"
              type="file"
              onChange={loadFile}
            />
            <Button color="inherit" component="span">
              Load Document
            </Button>
          </label>
        </Toolbar>
      </AppBar>
      <Divider />
      <div className="flex shrink grow flex-col overflow-hidden">
        {mutation.isLoading ? (
          <div className="p-4">
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Loading...
            </Typography>
          </div>
        ) : (
          <DocAIView data={data} />
        )}
      </div>
    </div>
  )
}
