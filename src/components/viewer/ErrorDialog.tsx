import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

interface Props {
  open: boolean
  error: Error | null
  onClose: () => void
}

function ErrorDialog(props: Props) {
  return (
    <Dialog open={props.open}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <DialogContentText>
          An error has been detected
          <br />
          {props.error?.message ? props.error.message : "No Message"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={props.onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog
