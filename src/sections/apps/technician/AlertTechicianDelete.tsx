// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

import { deleteCustomer } from 'api/customer';
import { openSnackbar } from 'api/snackbar';

// assets
import { Trash } from 'iconsax-react';

// types
import { SnackbarProps } from 'types/snackbar';
import { TechnicianList } from 'types/technician';

import { deleteTechnician } from 'apiServices/technician';

interface Props {
  id: number;
  title: string;
  open: boolean;
  handleClose: () => void;
}
interface ErrorData {
  response: any;
}
// ==============================|| CUSTOMER - DELETE ||============================== //

export default function AlertTechnicianDelete({ id, title, open, handleClose }: Props) {
  const deletehandler = async () => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    await deleteTechnician(id)
      .then(() => {
        openSnackbar({
          open: true,
          message: 'Technician deleted successfully',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: {
            color: 'success'
          }
        } as SnackbarProps);
        handleClose();
      })
      .catch((error) => {
        console.error('Error fetching technicians:', error);
        const errorData = error as ErrorData;
        openSnackbar({
          open: true,
          message: errorData.response.data.message,
          variant: 'alert',
          alert: {
            color: 'error'
          }
        } as SnackbarProps);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            <Typography align="center">
              By deleting
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              user, all task assigned to that user will also be deleted.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
