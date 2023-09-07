import { Paper, Typography } from "@mui/material"

function NoData() {
  return (
    <Paper sx={{ flexGrow: 1, padding: "20px" }}>
      <Typography variant="h4">No data.</Typography>

      <Typography variant="body1" component="p">
        Load a PDF document from your device to begin processing.
      </Typography>
    </Paper>
  )
}

export default NoData
