import { useMemo, useState, Fragment, MouseEvent } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Transitions from 'components/@extended/Transitions';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import laptop from 'assets/images/complaint/laptop.jpg';
import invoice from 'assets/images/complaint/invoice.webp';

// assets
import { Add, Link2, Location, Mobile, Sms } from 'iconsax-react';
import CustomerModal from '../customer/CustomerModal';
import AssignTechnicianModal from './AssignTechnicianModal';
import { Dialog, DialogTitle, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// ==============================|| CUSTOMER - VIEW ||============================== //

interface Props {
  modalToggler: () => void;
}

// Preview Modal Component
const PreviewModal = ({ open, onClose, imgSrc, imgAlt }: { open: boolean; onClose: () => void; imgSrc: string; imgAlt: string }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <img src={imgSrc} alt={imgAlt} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
    </Box>
  </Dialog>
);

export default function ComplaintView({ data }: any, { modalToggler }: Props) {
  console.log('ComplaintData', data);
  console.log('ComplaintDataId', data.id);
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const [assignTechnicianModal, setAssignTechnicianModal] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false); // state for preview modal
  const [previewImage, setPreviewImage] = useState<string>(''); // state for image URL
  const handleModalToggler = () => {
    setAssignTechnicianModal((prev) => !prev);
  };

  const openPreview = (imageSrc: string) => {
    setPreviewImage(imageSrc);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };
  return (
    <Transitions type="slide" direction="down" in={true}>
      <MainCard sx={{ ml: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid container xs={12} sm={12} md={12} lg={12} xl={12}>
          <Grid item xs={6} sm={8} md={5} lg={7} xl={8}>
            <Stack spacing={2.5}>
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={4} md={3}>
                      <Stack spacing={1}>
                        <Typography color="secondary">Full Name</Typography>
                        {/* <Typography>{data.firstName}</Typography> */}
                        <Typography>Aaron Carter</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <Stack spacing={1}>
                        <Typography color="secondary">Email</Typography>
                        <Typography>{data.email}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4} md={3}>
                      <Stack spacing={1}>
                        <Typography color="secondary">Contact</Typography>
                        <Typography>
                          {/* <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={data.contact} /> */}
                          <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={'+1 (987) 654-3210'} />
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Stack spacing={1}>
                    <Typography color="secondary">Address</Typography>
                    {/* <Typography>{data.address}</Typography> */}
                    <Typography>
                      {'Flat No. 202, A-Block Green Valley Apartments MG Road, Near City Mall Bengaluru, Karnataka 560001'}
                    </Typography>
                  </Stack>
                </ListItem>
                <ListItem>
                  <Stack spacing={1}>
                    <Typography color="secondary">Description</Typography>
                    <Typography>{data.address}</Typography>
                    <Typography>
                      {`I recently purchased a laptop from your store, and within two weeks, 
                        it began to malfunction. The screen often freezes, the battery drains quickly, and the device
                         overheats even with minimal use. I am requesting a replacement or a full refund due to these defects.`}
                    </Typography>
                  </Stack>
                </ListItem>
              </List>
            </Stack>
          </Grid>
          <Grid container xs={6} sm={4} md={5} lg={5} xl={4} justifyContent="flex-end" sx={{ display: 'flex' }}>
            <Stack spacing={2.5} sx={{ width: '100%', alignItems: 'flex-end' }}>
              <Grid item xs={6} sm={4} md={4} lg={6}>
                <Box sx={{}} onClick={() => openPreview(laptop)}>
                  <img src={laptop} alt="product" style={{ background: theme.palette.secondary[200], width: '100%' }} />
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={4} lg={5}>
                <Box
                  sx={{
                    border: '2px solid',
                    borderColor: theme.palette.divider
                  }}
                  onClick={() => openPreview(invoice)}
                >
                  <img src={invoice} alt="product" style={{ background: theme.palette.secondary[200], width: '100%' }} />
                </Box>
              </Grid>
            </Stack>
          </Grid>
          <Grid container item xs={12} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleModalToggler} size="large">
              Assign Technician
            </Button>
          </Grid>
        </Grid>
        {assignTechnicianModal && <AssignTechnicianModal open={assignTechnicianModal} modalToggler={handleModalToggler} />}
        {/* Image Preview Modal */}
        <PreviewModal open={previewOpen} onClose={closePreview} imgSrc={previewImage} imgAlt="Preview Image" />
      </MainCard>
    </Transitions>
  );
}
