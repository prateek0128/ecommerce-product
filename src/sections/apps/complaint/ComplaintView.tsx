import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';
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
import { getComplaintDetails } from 'apiServices/complaint';
import { useLoaderData, useNavigate, useLocation } from 'react-router-dom';
// ==============================|| CUSTOMER - VIEW ||============================== //

interface Props {
  modalToggler: () => void;
}

interface ComplaintData {
  message: string;
  ComplaintDetails: any;
  // Add other properties that exist in the response data
}
interface CustomerDetails {
  Contact: number;
  Email: string;
  First_Name: string;
  Gender: string;
  Last_Name: string;
  Location: string;
  Profile_Picture: any;
  age: any;
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
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const [assignTechnicianModal, setAssignTechnicianModal] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false); // state for preview modal
  const [previewImage, setPreviewImage] = useState<string>(''); // state for image URL
  const [complaintId, setComplaintId] = useState<number>();
  const [customerId, setCustomerId] = useState<number>();
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerConatct, setCustomerContact] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [complaintDescription, setComplaintDescription] = useState<string>('');
  const [billImage, setBillImage] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [item, setItem] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [warranty, setWarranty] = useState<string>('');
  const history = useNavigate();
  const handleModalToggler = () => {
    setAssignTechnicianModal((prev) => !prev);
  };
  const handleAssignCategory = () => {
    history(`/apps/category/assign-category`, { state: { complaintIdView: complaintId } });
  };
  const openPreview = (imageSrc: string) => {
    setPreviewImage(imageSrc);
    setPreviewOpen(true);
  };
  const closePreview = () => {
    setPreviewOpen(false);
  };
  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await getComplaintDetails(data.id);
        const complaintData = response.data as ComplaintData; // Cast to expected type
        const complaintDetails = complaintData.ComplaintDetails[0];
        const customerDetails = complaintData.ComplaintDetails[0].Customer_Details[0];
        setComplaintId(complaintDetails.Complaint_Id);
        setCustomerName(customerDetails.First_Name + ' ' + customerDetails.Last_Name);
        setCustomerId(customerDetails.Id);
        setCustomerContact(customerDetails.Contact);
        setCustomerEmail(customerDetails.Email);
        setCustomerAddress(customerDetails.Location);
        setComplaintDescription(complaintDetails.Description || '');
        setItem(complaintDetails.Item || '');
        setStatus(complaintDetails.Status || '');
        setWarranty(complaintDetails.Warranty || '');
        setBillImage(complaintDetails.Bill_Image || '');
        setItemImage(complaintDetails.Item_Image || '');
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };
    fetchComplaintDetails();
  }, []);
  return (
    <Transitions type="slide" direction="down" in={true}>
      <MainCard sx={{ ml: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid container xs={12} sm={12} md={12} lg={12} xl={12}>
          <Grid item xs={6} sm={9} md={9} lg={8} xl={8}>
            <Stack spacing={2.5}>
              <List sx={{ py: 0 }}>
                <ListItem divider={!matchDownMD}>
                  <Grid container spacing={3}>
                    <Grid item xs={4} md={3}>
                      <Stack spacing={1}>
                        <Typography color="secondary">Full Name</Typography>
                        {/* <Typography>{data.firstName}</Typography> */}
                        <Typography>{customerName}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <Stack spacing={1}>
                        <Typography color="secondary">Email</Typography>
                        <Typography>{customerEmail}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4} md={3}>
                      <Stack spacing={1}>
                        <Typography color="secondary">Contact</Typography>
                        <Typography>
                          {/* <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={data.contact} /> */}
                          <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={customerConatct} />
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!matchDownMD}>
                  <Stack spacing={1}>
                    <Typography color="secondary">Address</Typography>
                    {/* <Typography>{data.address}</Typography> */}
                    <Typography>{customerAddress}</Typography>
                  </Stack>
                </ListItem>
                <ListItem>
                  <Stack spacing={1}>
                    <Typography color="secondary">Description</Typography>
                    <Typography>{complaintDescription}</Typography>
                  </Stack>
                </ListItem>
              </List>
            </Stack>
          </Grid>
          <Grid container xs={6} sm={3} md={3} lg={4} xl={4} justifyContent="flex-end" sx={{ display: 'flex' }}>
            <Stack spacing={2.5} sx={{ width: '100%', alignItems: 'flex-end' }}>
              <Grid item xs={6} sm={4} md={4} lg={6}>
                <Box sx={{}} onClick={() => openPreview(itemImage)}>
                  <img src={itemImage} alt="product" style={{ background: theme.palette.secondary[200], width: '100%' }} />
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={4} lg={5}>
                <Box
                  sx={{
                    border: '2px solid',
                    borderColor: theme.palette.divider
                  }}
                  onClick={() => openPreview(billImage)}
                >
                  <img src={billImage} alt="product" style={{ background: theme.palette.secondary[200], width: '100%' }} />
                </Box>
              </Grid>
            </Stack>
          </Grid>
          <Grid container item xs={12} justifyContent="flex-end" sx={{ mt: 2 }} spacing={2}>
            {status == 'InProgress' && (
              <Grid item>
                <Button variant="contained" onClick={handleAssignCategory} size="large">
                  Assign Category
                </Button>
              </Grid>
            )}
            {status == 'pending' && (
              <Grid item>
                <Button variant="contained" onClick={handleModalToggler} size="large">
                  Assign Technician
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
        {assignTechnicianModal && (
          <AssignTechnicianModal
            open={assignTechnicianModal}
            modalToggler={handleModalToggler}
            complaintId={data.id}
            customerId={Number(customerId)}
          />
        )}
        {/* Image Preview Modal */}
        <PreviewModal open={previewOpen} onClose={closePreview} imgSrc={previewImage} imgAlt="Preview Image" />
      </MainCard>
    </Transitions>
  );
}
