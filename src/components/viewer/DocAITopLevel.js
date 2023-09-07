import { useState } from "react"
import { fileToString } from "@/utils/file"
import HelpIcon from "@mui/icons-material/Help"
import {
  AppBar,
  Button,
  Box as Card,
  Divider,
  IconButton,
  Input,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material"
import fixture from "public/output.json"

import { trpc } from "@/lib/trpc"

import AboutDialog from "./About"
import Details from "./Details"
import DocAIView from "./DocAIView"
import JSONPage from "./JSONPage"

export function DocAITopLevel() {
  const [tabValue, setTabValue] = useState(0)
  const [data, setData] = useState(fixture.document)
  const [aboutOpen, setAboutOpen] = useState(false)

  const mutation = trpc.processDocument.useMutation()

  function tabChange(event, newValue) {
    setTabValue(newValue)
  }

  async function loadJson(event) {
    if (event.target.files.length === 0) {
      setData(null)
      return
    }

    const content = await fileToString(event.target.files[0])

    mutation.mutate(content, {
      onSuccess: (result) => {
        if ("document" in result) {
          setData(result.document)
        } else {
          setData(result)
        }
      },
    })
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CommodityAI
          </Typography>
          <label htmlFor="contained-button-file">
            <Input
              style={{ display: "none" }}
              accept=".json"
              id="contained-button-file"
              multiple
              type="file"
              onChange={loadJson}
            />
            <Button color="inherit" component="span">
              Load Document
            </Button>
          </label>
          <IconButton color="inherit" onClick={() => setAboutOpen(true)}>
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Tabs value={tabValue} onChange={tabChange}>
        <Tab label="Document" />
        <Tab label="JSON" />
        <Tab label="Details" />
      </Tabs>
      <Divider />
      <Card
        variant="outlined"
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {mutation.isLoading ? (
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Loading...
          </Typography>
        ) : (
          <>
            {tabValue === 0 && <DocAIView data={data} />}
            {tabValue === 1 && <JSONPage data={data} />}
            {tabValue === 2 && <Details data={data} />}
          </>
        )}
      </Card>
      <AboutDialog open={aboutOpen} close={() => setAboutOpen(false)} />
    </Card>
  )
}
