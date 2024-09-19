import { useState, ChangeEvent, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
import { ThemeMode, Gender, APP_DEFAULT_PATH } from 'config';
// project-imports
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// assets
import { Box, DocumentUpload } from 'iconsax-react';
import { Camera, CloseCircle, Trash } from 'iconsax-react';
import { Autocomplete, FormLabel } from '@mui/material';
import { updateComplaint } from 'apiServices/complaint';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { categories } from './categories';

// constant
const warrantyStatus = [
  {
    value: 'in warranty',
    label: 'In Warranty'
  },
  {
    value: 'out of warranty',
    label: 'Out of Warranty'
  }
];
interface ErrorData {
  response: any;
}
// ==============================|| ECOMMERCE - ADD PRODUCT ||============================== //

export default function AddNewProduct() {
  const history = useNavigate();
  const location = useLocation();
  const { complaintData } = location.state || {}; // Extract the passed data
  console.log('rowDataComplaint2', complaintData ?? complaintData);
  const theme = useTheme();
  const [customerName, setCustomerName] = useState(complaintData.name);
  const [description, setDescription] = useState(complaintData.description);
  const [warranty, setWarranty] = useState(complaintData.warranty == 'Yes' || 'yes' ? 'in warranty' : 'out of warranty');
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [selectedSubcategory, setSelectedSubcategory] = useState(complaintData.item || 'Select Item');
  const [itemImage, setItemImage] = useState<string | undefined>(undefined);
  const [itemFile, setItemFile] = useState<File | undefined>(undefined);
  const fileInputRefItem = useRef<HTMLInputElement | null>(null);
  const [billImage, setBillImage] = useState<string | undefined>(undefined);
  const [billFile, setBillFile] = useState<File | undefined>(undefined);
  const fileInputRefBill = useRef<HTMLInputElement | null>(null);
  const handleWarranty = (event: ChangeEvent<HTMLInputElement>) => {
    setWarranty(event.target.value);
  };
  const handleCancel = () => {
    history('/apps/complaint/complaint-list');
  };
  const handleCustomerNameChange = (event: ChangeEvent<HTMLInputElement>) => setCustomerName(event.target.value);
  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value);
  const handleSubcategoryChange = (newValue: string | null) => {
    if (newValue !== null) {
      setSelectedSubcategory(newValue); // Handle the new value if it's not null
    } else {
      setSelectedSubcategory(''); // Optionally, reset if null
    }
  };
  const handleButtonClickItem = () => {
    // Trigger the file input when the button is clicked
    fileInputRefItem.current?.click();
  };
  const handleItemChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setItemImage(imageUrl);
      setItemFile(file);
    }
  };
  const handleButtonClickBill = () => {
    // Trigger the file input when the button is clicked
    fileInputRefBill.current?.click();
  };
  const handleBillChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBillImage(imageUrl);
      setBillFile(file);
    }
  };
  const editComplaintAPI = async (event: { preventDefault: () => void }) => {
    event?.preventDefault();
    console.log('editComplaintAPIUpdate', complaintData.id);
    const editComplaintData = {
      complaintId: complaintData.id,
      customerName: customerName,
      description: description,
      item: selectedSubcategory,
      warranty: warranty,
      itemImage: itemImage,
      billImage: billImage,
      status: ''
    };
    try {
      const response = await updateComplaint(editComplaintData);
      console.log('editProductAPI', response);
      openSnackbar({
        open: true,
        message: 'Complaint updated successfully.',
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
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Edit Complaint' }];
  const allSubcategories = categories.flatMap((category) => category.subcategories);
  console.log(allSubcategories);
  return (
    <>
      <Breadcrumbs custom heading="Edit Complaint" links={breadcrumbLinks} />
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container spacing={1} direction="column">
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Customer Name</InputLabel>
                  <TextField placeholder="Enter customer name" value={customerName} fullWidth onChange={handleCustomerNameChange} />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}> Description</InputLabel>
                  <TextField placeholder="Enter description" value={description} fullWidth onChange={handleDescriptionChange} />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Item</InputLabel>
                  <Autocomplete
                    fullWidth
                    options={useMemo(() => {
                      // Get all subcategories from all categories and sort them alphabetically
                      return categories
                        .flatMap((cat) => cat.subcategories) // Flatten all subcategories into a single array
                        .sort((a, b) => a.localeCompare(b)); // Sort alphabetically
                    }, [categories])}
                    value={selectedSubcategory || ''}
                    onChange={(event, newValue) => handleSubcategoryChange(newValue)}
                    renderInput={(params) => <TextField {...params} label={!selectedSubcategory ? 'Select Item' : 'Select Item'} />}
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
                  <InputLabel sx={{ mb: 1 }}>Image of Item</InputLabel>
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
                          {itemImage && <img alt="Avatar" src={itemImage} style={{ width: 72, height: 72 }} />}
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
                          onChange={handleItemChange} // Handle file selection
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
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
                          {billImage && <img alt="Avatar" src={billImage} style={{ width: 72, height: 72 }} />}
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
                          onChange={handleBillChange} // Handle file selection
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 6 }}>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={editComplaintAPI}>
                      Update Complaint
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
