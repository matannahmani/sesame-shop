import { Alert, Dialog, DialogTitle, Button, Collapse } from '@mui/material';
import { Box } from '@mui/system';

export interface ActionDialogProps {
  open: boolean;
  title: string;
  onClose: (success: boolean) => void;
}

export const ActionDialog = (props: ActionDialogProps) => {
  const { onClose, title, open } = props;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Collapse in={open}>
        <DialogTitle>
          <Alert variant="filled" severity="error">
            {title}
          </Alert>
        </DialogTitle>
        <Box
          p={2}
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Button
            onClick={() => onClose(false)}
            variant="contained"
            color="error"
          >
            Decline
          </Button>
          <Button
            onClick={() => onClose(true)}
            variant="contained"
            color="success"
          >
            Accept
          </Button>
        </Box>
      </Collapse>
    </Dialog>
  );
};

export default ActionDialog;
