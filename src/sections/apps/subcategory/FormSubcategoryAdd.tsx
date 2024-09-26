import { useEffect, useState, ChangeEvent } from 'react';

// material ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertSubcategoryDelete from './AlertSubcategoryDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { ThemeMode, Gender } from 'config';
import { openSnackbar } from 'api/snackbar';
//import { insertCustomer, updateCustomer } from 'api/customer';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Camera, CloseCircle, Trash } from 'iconsax-react';

// types
import { SnackbarProps } from 'types/snackbar';
import { CustomerList } from 'types/customer';
import { CategoryList } from 'types/category';
import { SubcategoryList } from 'types/subcategory';
//api imoorts
import { addCustomer, updateCustomer } from 'apiServices/customer';
// CONSTANT
const getInitialValues = (subcategory: SubcategoryList | null) => {
  const newCategory = {
    subcategoryName: '',
    categoryName: '',
    subcategoryId: 0,
    categoryId: 0,
    isActive: 1
  };

  if (subcategory) {
    return _.merge({}, newCategory, subcategory);
  }

  return newCategory;
};

interface UsersData {
  message: any;
}
interface ErrorData {
  response: any;
}
// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormSubcategoryAdd({ subcategory, closeModal }: { subcategory: SubcategoryList | null; closeModal: () => void }) {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  // const [avatar, setAvatar] = useState<string | undefined>(
  //   getImageUrl(`avatar-${category && category !== null && category?.profilePicture ? category.profilePicture : 1}.png`, ImagePath.USERS)
  // );

  useEffect(() => {
    if (selectedImage) {
      // setAvatar(URL.createObjectURL(selectedImage));
      setSelectedFile(selectedImage);
    }
  }, [selectedImage]);

  // useEffect(() => {
  //   setLoading(false);
  // }, []);

  const CustomerSchema = Yup.object().shape({
    categoryName: Yup.string().max(255).required('Category Name is required')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(subcategory!),
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newSubcategory: SubcategoryList = values;
        //newCustomer.name = newCustomer.firstName + ' ' + newCustomer.lastName;
        if (subcategory) {
          // updateCustomer(newCustomer.id!, newCustomer).then(() => {
          updateCustomer(newSubcategory).then(() => {
            openSnackbar({
              open: true,
              message: 'Customer update successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            } as SnackbarProps);
            setSubmitting(false);
            closeModal();
          });
        } else {
          const newCustomerData = {
            categoryName: values.categoryName,
            isActive: values.isActive
          };
          if (!selectedFile) {
            console.log('Please select image.');
            return;
          } else {
            console.log('addCustomerImage', selectedFile);
          }

          // Create a FormData object
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('data', JSON.stringify(newCustomerData));
          // await insertCustomer(newCustomer).then(() => {
          await addCustomer(newSubcategory).then(() => {
            openSnackbar({
              open: true,
              message: 'Customer added successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            } as SnackbarProps);
            setSubmitting(false);
            closeModal();
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  const addCustomerAPI = async () => {
    const { values } = formik;
    const newSubcategoryData = {
      categoryName: values.categoryName,
      isActive: values.isActive
    };
    // Create a FormData object
    const formData = new FormData();
    formData.append('data', JSON.stringify(newSubcategoryData));
    // Only append the file if it's selected
    if (selectedFile) {
      console.log('addCustomerImage', selectedFile);
      formData.append('file', selectedFile);
    } else {
      console.log('No image selected, proceeding without image');
    }
    try {
      const response = await addCustomer(formData);
      openSnackbar({
        open: true,
        message: 'Customer added successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      } as SnackbarProps);
      closeModal();
    } catch (error) {
      console.error('Error fetching customers:', error);
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
  const updateCustomerAPI = async () => {
    const { values } = formik;
    const updateSubcategoryData = {
      // id: values.id,
      categoryName: values.categoryName,
      isActive: values.isActive
    };
    // Create a FormData object
    // const formData = new FormData();
    // formData.append('data', JSON.stringify(updateCustomerData));
    // // Only append the file if it's selected
    // if (selectedFile) {
    //   console.log('addCustomerImage', selectedFile);
    //   formData.append('file', selectedFile);
    // } else {
    //   console.log('No image selected, proceeding without image');
    // }
    try {
      const response = await updateCustomer(updateSubcategoryData);
      openSnackbar({
        open: true,
        message: 'Customer updated successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      } as SnackbarProps);
      closeModal();
    } catch (error) {
      console.error('Error fetching customers:', error);
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
  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
  const newSubcategory = values.categoryName;
  // if (loading)
  //   return (
  //     <Box sx={{ p: 5 }}>
  //       <Stack direction="row" justifyContent="center">
  //         <CircularWithPath />
  //       </Stack>
  //     </Box>
  //   );

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form
            autoComplete="off"
            noValidate
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   customer ? updateCustomerAPI() : addCustomerAPI();
            // }}
          >
            <DialogTitle>{subcategory ? 'Edit Customer' : 'Add New Category'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-categoryName">Category Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-categoryName"
                          placeholder="Enter Category Name"
                          {...getFieldProps('categoryName')}
                          error={Boolean(touched.categoryName && errors.categoryName)}
                          helperText={touched.categoryName && errors.categoryName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-subcategoryName">Subcategory Name</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-subcategoryName"
                          placeholder="Enter Subcategory Name"
                          {...getFieldProps('subcategoryName')}
                          error={Boolean(touched.subcategoryName && errors.subcategoryName)}
                          helperText={touched.subcategoryName && errors.subcategoryName}
                        />
                      </Stack>
                    </Grid>
                    {/* <Grid item xs={12} sm={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-isActive">Is Active</InputLabel>
                        <RadioGroup row aria-label="payment-card" {...getFieldProps('isActive')}>
                          <FormControlLabel control={<Radio value={1} />} label={'Active'} />
                          <FormControlLabel control={<Radio value={0} />} label={'Inactive'} />
                        </RadioGroup>
                      </Stack>
                    </Grid> */}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {subcategory && (
                    <Tooltip title="Delete Subcategory" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <Trash variant="Bold" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      //disabled={isSubmitting}
                      onClick={(e) => {
                        subcategory ? updateCustomerAPI() : addCustomerAPI();
                      }}
                    >
                      {subcategory ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {subcategory && (
        <AlertSubcategoryDelete id={subcategory.subcategoryId!} title={newSubcategory} open={openAlert} handleClose={handleAlertClose} />
      )}
    </>
  );
}
