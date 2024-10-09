import { useState, ChangeEvent, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Avatar from 'components/@extended/Avatar';
import { ThemeMode, Gender } from 'config';
// project-imports
import MainCard from 'components/MainCard';

// assets
import { Box, DocumentUpload } from 'iconsax-react';
import { Camera, CloseCircle, Trash } from 'iconsax-react';
import { Autocomplete, FormLabel } from '@mui/material';
import { raiseComplaint } from 'apiServices/complaint';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { APP_DEFAULT_PATH } from 'config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { getAllCustomers, deleteCustomer, getCustomerDetails } from 'apiServices/customer';
// constant
const warrantyStatus = [
  {
    value: 1,
    label: 'Yes'
  },
  {
    value: 0,
    label: 'No'
  }
];
const itemList = [
  'CCTV Camera HD',
  'CCTV Camera IP',
  'EPABX/INTERCOM',
  'Biometric Attendance Machine',
  'GPS',
  'Electric Fencing',
  'Desktop Computer',
  'Printers',
  'Servers',
  'Vedio Door Phone',
  'Electronic Locks',
  'Wifi/Networking',
  'LED Monitors'
];
interface ErrorData {
  response: any;
}
interface CustomersData {
  message: string;
  Customers: any;
}
interface CustomerData {
  message: string;
  Details: any;
}
// ==============================|| ECOMMERCE - ADD PRODUCT ||============================== //

export default function AddNewProduct() {
  const history = useNavigate();
  const theme = useTheme();
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [complaintAddress, setComplaintAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [warranty, setWarranty] = useState<number | null>(1);
  const [selectedItem, setSelectedItem] = useState('Select Category');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Select Item');
  const [itemImageUrl, setItemImageUrl] = useState<string | undefined>(undefined);
  const [itemFile, setItemFile] = useState<File | undefined>(undefined);
  const fileInputRefItem = useRef<HTMLInputElement | null>(null);
  const [billImageUrl, setBillImageUrl] = useState<string | undefined>(undefined);
  const [billFile, setBillFile] = useState<File | undefined>(undefined);
  const fileInputRefBill = useRef<HTMLInputElement | null>(null);
  const [allCustomersData, setAllCustomersData] = useState<any>([]);
  const allCustomers =
    allCustomersData &&
    allCustomersData.map((customer: any, index: any) => ({
      customerName: customer.First_Name + ' ' + customer.Last_Name,
      customerId: customer.Id
    }));
  const handleCancel = () => {
    history('/apps/complaint/complaints-list');
  };
  const handleCustomerNameChange = (event: React.SyntheticEvent, newValue: { customerName: string; customerId: number } | null) => {
    if (newValue) {
      // If newValue is not null, handle it
      setCustomerName(newValue.customerName); // Set customer name
      setCustomerId(newValue.customerId); // Set customer ID
      fetchCustomerDetails(newValue.customerId);
    } else {
      // Handle case when newValue is null (e.g., when clearing the selection)
      setCustomerName(''); // Clear customer name
      setCustomerId(null); // Clear customer ID
    }
  };
  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value);
  const handleItemChange = (newValue: any) => {
    if (newValue) {
      setSelectedItem(newValue);
    }
  };
  const handleWarranty = (event: ChangeEvent<HTMLInputElement>) => {
    setWarranty(Number(event.target.value));
  };
  const handleButtonClickItem = () => {
    // Trigger the file input when the button is clicked
    fileInputRefItem.current?.click();
  };
  const handleItemImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setItemImageUrl(imageUrl);
      setItemFile(file);
    }
  };
  const handleButtonClickBill = () => {
    // Trigger the file input when the button is clicked
    fileInputRefBill.current?.click();
  };
  const handleBillImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBillImageUrl(imageUrl);
      setBillFile(file);
    }
  };
  const getAllCustomersAPI = () => {
    getAllCustomers()
      .then((response) => {
        const customersData = response.data as CustomersData;
        setAllCustomersData(customersData.Customers || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchCustomerDetails = async (customerId: number) => {
    try {
      const response = await getCustomerDetails(customerId);
      const customerData = response.data as CustomerData;
      const customerDetails = customerData.Details[0];
      setComplaintAddress(customerDetails.Location);
      setContactNumber(customerDetails.Contact);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };
  useEffect(() => {
    getAllCustomersAPI();
  }, []);
  const raiseComplaintAPI = async (event: { preventDefault: () => void }) => {
    event?.preventDefault();
    const raiseComplaintData = {
      customerId: customerId,
      customerName: customerName,
      description: description,
      item: selectedSubcategory,
      warranty: warranty
    };
    if (!itemFile || (warranty === 1 && !billFile)) {
      console.log('Please select both images.');
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('itemImage', itemFile);
    // Append bill image only if warranty is 1
    if (warranty === 1 && billFile) {
      formData.append('billImage', billFile);
    }
    formData.append('data', JSON.stringify(raiseComplaintData));
    try {
      const response = await raiseComplaint(formData);
      openSnackbar({
        open: true,
        message: 'Complaint raised successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      } as SnackbarProps);
      // closeModal();
    } catch (error) {
      console.error('Error fetching complaints:', error);
      const errorData = error as ErrorData;
      openSnackbar({
        open: true,
        message: errorData.response.data.message,
        variant: 'alert',
        alert: {
          color: 'error'
        }
      } as SnackbarProps);
    }
  };
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Raise Complaint' }];
  return (
    <>
      <Breadcrumbs custom heading="Raise Complaint" links={breadcrumbLinks} />
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container spacing={1} direction="column">
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Customer Name</InputLabel>
                  {/* <TextField placeholder="Enter customer name" value={customerName} fullWidth onChange={handleCustomerNameChange} /> */}
                  <Autocomplete
                    fullWidth
                    id="customers"
                    options={allCustomers}
                    getOptionLabel={(option) => option.customerName} // Display customer name
                    value={
                      customerName
                        ? allCustomers.find((customer: { customerName: string }) => customer.customerName === customerName)
                        : null
                    } // Ensure value is an object
                    isOptionEqualToValue={(option, value) => option.customerId === value?.customerId} // Ensure proper matching
                    onChange={(event: React.SyntheticEvent, newValue: { customerName: string; customerId: number } | null) => {
                      handleCustomerNameChange(event, newValue); // Handle change
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Select customer name" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="complaintAddress" sx={{ mb: 1 }}>
                    Complaint Address{' '}
                  </InputLabel>
                  <TextField
                    fullWidth
                    id="complaintAddress"
                    value={complaintAddress}
                    placeholder={'Enter address'}
                    InputProps={{
                      readOnly: true // Set to read-only
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="contactNumber" sx={{ mb: 1 }}>
                    Registered Contact Number
                  </InputLabel>
                  <TextField
                    fullWidth
                    id="contactNumber"
                    value={contactNumber}
                    placeholder={'Enter contact number'}
                    InputProps={{
                      readOnly: true // Set to read-only
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Complaint Description</InputLabel>
                  <TextField placeholder="Enter description" value={description} fullWidth onChange={handleDescriptionChange} />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Item</InputLabel>
                  <Autocomplete
                    options={itemList ? itemList.sort() : []}
                    value={selectedItem ? itemList.find((category: any) => category === selectedItem) : null}
                    onChange={(event: React.SyntheticEvent, newValue) => {
                      if (newValue) {
                        handleItemChange(newValue);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Select Item" fullWidth />}
                    freeSolo
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option} value={option}>
                        {option}
                      </MenuItem>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Warranty</InputLabel>
                  <TextField placeholder="Select warranty status" fullWidth select value={warranty} onChange={handleWarranty}>
                    {warrantyStatus.map((option, index) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Faulty Image of Item</InputLabel>
                  <Typography color="error.main">
                    *{' '}
                    <Typography component="span" color="text.secondary">
                      Recommended resolution is 640*640 with file size
                    </Typography>
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      {' '}
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<DocumentUpload />}
                        sx={{ mt: 1, textTransform: 'none' }}
                        onClick={handleButtonClickItem} // Trigger file input click
                      >
                        Click to Upload
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* Image display section */}
                      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                        <FormLabel
                          htmlFor="change-avtar"
                          sx={{
                            position: 'relative',
                            // borderRadius: '20%',
                            overflow: 'hidden',
                            '&:hover .MuiBox-root': { opacity: 1 },
                            cursor: 'pointer'
                          }}
                        >
                          {itemImageUrl && <img alt="Avatar" src={itemImageUrl} style={{ width: 72, height: 72 }} />}
                          {/* <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      > */}
                          <Stack spacing={0.5} alignItems="center">
                            <Camera style={{ color: 'white', fontSize: '2rem' }} />
                            <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                          </Stack>
                          {/* </Box> */}
                        </FormLabel>

                        {/* Hidden file input */}
                        <TextField
                          type="file"
                          id="change-avtar"
                          inputRef={fileInputRefItem} // Reference to the file input
                          sx={{ display: 'none' }}
                          onChange={handleItemImageChange} // Handle file selection
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                {warranty == 1 && (
                  <Grid item xs={12}>
                    <InputLabel sx={{ mb: 1 }}>Image of Bill</InputLabel>
                    <Typography color="error.main">
                      *{' '}
                      <Typography component="span" color="text.secondary">
                        Recommended resolution is 640*640 with file size
                      </Typography>
                    </Typography>
                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        {' '}
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<DocumentUpload />}
                          sx={{ mt: 1, textTransform: 'none' }}
                          onClick={handleButtonClickBill} // Trigger file input click
                        >
                          Click to Upload
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {/* Image display section */}
                        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                          <FormLabel
                            htmlFor="change-avtar"
                            sx={{
                              position: 'relative',
                              // borderRadius: '20%',
                              overflow: 'hidden',
                              '&:hover .MuiBox-root': { opacity: 1 },
                              cursor: 'pointer'
                            }}
                          >
                            {billImageUrl && <img alt="Avatar" src={billImageUrl} style={{ width: 72, height: 72 }} />}
                            {/* <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      > */}
                            <Stack spacing={0.5} alignItems="center">
                              <Camera style={{ color: 'white', fontSize: '2rem' }} />
                              <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                            </Stack>
                            {/* </Box> */}
                          </FormLabel>

                          {/* Hidden file input */}
                          <TextField
                            type="file"
                            id="change-avtar"
                            inputRef={fileInputRefBill} // Reference to the file input
                            sx={{ display: 'none' }}
                            onChange={handleBillImageChange} // Handle file selection
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 6 }}>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={raiseComplaintAPI}>
                      Raise Complaint
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
}
