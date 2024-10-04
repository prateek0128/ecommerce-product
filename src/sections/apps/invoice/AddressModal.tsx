import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import { getAllCustomers, deleteCustomer } from 'apiServices/customer';
// third-party
import { Add, SearchNormal1 } from 'iconsax-react';
import CircularProgress from '@mui/material/CircularProgress';

type AddressModalType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handlerAddress: (a: any) => void;
};
interface CustomersData {
  message: string;
  Customers: any;
}
// ==============================|| INVOICE - SELECT ADDRESS ||============================== //

export default function AddressModal({ open, setOpen, handlerAddress }: AddressModalType) {
  function closeAddressModal() {
    setOpen(false);
  }

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={closeAddressModal}
      sx={{ '& .MuiDialog-paper': { p: 0 }, '& .MuiBackdrop-root': { opacity: '0.5 !important' } }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Select Address</Typography>
          <Button startIcon={<Add />} onClick={closeAddressModal} color="primary">
            Add New
          </Button>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <FormControl sx={{ width: '100%', pb: 2 }}>
          <TextField
            autoFocus
            id="name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchNormal1 size={18} />
                </InputAdornment>
              )
            }}
            placeholder="Search"
            fullWidth
          />
        </FormControl>
        <Stack spacing={2}>
          <Address handlerAddress={handlerAddress} />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button color="error" onClick={closeAddressModal}>
          Cancel
        </Button>
        <Button onClick={closeAddressModal} color="primary" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type AddressProps = {
  handlerAddress: (e: any) => void;
};

function Address({ handlerAddress }: AddressProps) {
  const theme = useTheme();
  const [allCustomersData, setAllCustomersData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const allCustomers =
    allCustomersData &&
    allCustomersData.map((customer: any, index: any) => {
      const fullName = customer.First_Name + ' ' + customer.Last_Name;
      return {
        id: customer.Id,
        name: fullName,
        address: customer.Location,
        contact: customer.Contact,
        email: customer.Email,
        firstName: customer.First_Name,
        lastName: customer.Last_Name
      };
    });
  const getAllCustomersAPI = () => {
    setLoading(true);
    getAllCustomers()
      .then((response) => {
        setLoading(false);
        const customersData = response.data as CustomersData;
        setAllCustomersData(customersData.Customers || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAllCustomersAPI();
  }, []);
  const addressData = [
    {
      name: 'Ian Carpenter',
      address: '1754 Ureate, RhodSA5 5BO',
      phone: '+91 1234567890',
      email: 'iacrpt65@gmail.com'
    },
    { name: 'Belle J. Richter', address: '1300 Mine RoadQuemado, NM 87829', phone: '305-829-7809', email: 'belljrc23@gmail.com' },
    { name: 'Ritika Yohannan', address: '3488 Arbutus DriveMiami, FL', phone: '+91 1234567890', email: 'rtyhn65@gmail.com' },
    { name: 'Jesse G. Hassen', address: '3488 Arbutus DriveMiami, FL 33012', phone: '+91 1234567890', email: 'jessghs78@gmail.com' },
    {
      name: 'Christopher P. Iacovelli',
      address: '4388 House DriveWesrville, OH',
      phone: '+91 1234567890',
      email: 'crpthl643@gmail.com'
    },
    { name: 'Thomas D. Johnson', address: '4388 House DriveWestville, OH +91', phone: '1234567890', email: 'thomshj56@gmail.com' }
  ];

  return (
    <>
      {loading == false ? (
        allCustomers.map((customer: any) => (
          <Box
            onClick={() => handlerAddress(customer)}
            key={customer.Email}
            sx={{
              width: '100%',
              border: '1px solid',
              borderColor: 'secondary.200',
              borderRadius: 1,
              p: 1.25,
              '&:hover': { bgcolor: theme.palette.primary.lighter, borderColor: theme.palette.primary.lighter }
            }}
          >
            <Typography variant="subtitle1">{customer.name}</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Typography variant="body2" color="secondary">
                {customer.address}
              </Typography>
              <Typography variant="body2" color="secondary">
                {customer.contact}
              </Typography>
              <Typography variant="body2" color="secondary">
                {customer.email}
              </Typography>
            </Stack>
          </Box>
        ))
      ) : (
        <>
          {/* <Divider /> */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%', // Take full viewport height
              p: 2
            }}
          >
            <CircularProgress size={40} />
          </Box>
        </>
      )}
    </>
  );
}
