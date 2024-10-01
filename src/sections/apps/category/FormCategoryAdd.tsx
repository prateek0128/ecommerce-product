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
import AlertCategoryDelete from './AlertCategoryDelete';
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
//api imoorts
import { updateCustomer } from 'apiServices/customer';
import { addCategory, getAllCategories } from 'apiServices/category';
// CONSTANT
const getInitialValues = (category: CategoryList | null) => {
  const newCategory = {
    subcategoryName: '',
    categoryName: '',
    subcategoryId: 0,
    categoryId: 0,
    id: 0
    //isActive: 1
  };

  if (category) {
    return _.merge({}, newCategory, category);
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

export default function FormCategoryAdd({
  category,
  closeModal,
  selectedCategory
}: {
  category: CategoryList | null;
  closeModal: () => void;
  selectedCategory: any;
}) {
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  console.log('categoryForm2', selectedCategory);
  // const [avatar, setAvatar] = useState<string | undefined>(
  //   getImageUrl(`avatar-${category && category !== null && category?.profilePicture ? category.profilePicture : 1}.png`, ImagePath.USERS)
  // );
  useEffect(() => {
    if (selectedImage) {
      // setAvatar(URL.createObjectURL(selectedImage));
      setSelectedFile(selectedImage);
    }
  }, [selectedImage]);
  // UseEffect to autofill the categoryName when selectedCategory is updated
  useEffect(() => {
    console.log('categoryName3', selectedCategory);
    if (selectedCategory) {
      formik.setFieldValue('categoryName4', selectedCategory);
    }
  }, [selectedCategory]);
  const CustomerSchema = Yup.object().shape({
    categoryName: Yup.string().max(255).required('Category Name is required')
  });
  const [openAlert, setOpenAlert] = useState(false);
  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };
  const formik = useFormik({
    initialValues: getInitialValues(category!),
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newCategory: CategoryList = values;
        //newCustomer.name = newCustomer.firstName + ' ' + newCustomer.lastName;
        if (category) {
          // updateCustomer(newCustomer.id!, newCustomer).then(() => {
          updateCustomer(newCategory).then(() => {
            openSnackbar({
              open: true,
              message: 'Category update successfully.',
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
            categoryName: values.categoryName
          };
          // await insertCustomer(newCustomer).then(() => {
          await addCategory(newCategory).then(() => {
            openSnackbar({
              open: true,
              message: 'Category added successfully.',
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
  const addCategoryAPI = async () => {
    const { values } = formik;
    const newCategoryData = {
      categoryName: values.categoryName,
      subcategories: values.subcategoryName
    };
    try {
      const response = await addCategory(newCategoryData);
      openSnackbar({
        open: true,
        message: selectedCategory ? 'Category added successfully.' : 'Subcategory added successfully.',
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
  const newCategory = values.categoryName;
  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form
            autoComplete="on"
            noValidate
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   customer ? updateCustomerAPI() : addCustomerAPI();
            // }}
          >
            <DialogTitle>{category ? 'Edit Customer' : 'Add New Category'}</DialogTitle>
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
                        <Autocomplete
                          multiple
                          freeSolo // Allows free text input
                          fullWidth
                          id="customer-subcategoryName"
                          options={[]} // Empty options since no predefined values are required
                          //value={values.subcategoryName || []} // This should be bound to the form state (Formik in this case)
                          onChange={(event, newValue) => {
                            // Ensure that only strings are stored, in case the Autocomplete sends objects
                            const subcategoryArray = newValue.map((value) => value);
                            setFieldValue('subcategoryName', newValue); // Update the form field with the new values
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="skills"
                              placeholder="Add Skills"
                              error={Boolean(touched.subcategoryName && errors.subcategoryName)}
                              helperText={touched.subcategoryName && errors.subcategoryName}
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                {...getTagProps({ index })}
                                variant="combined"
                                key={index}
                                label={option}
                                deleteIcon={<CloseCircle style={{ fontSize: '0.75rem' }} />}
                                sx={{ color: 'text.primary' }}
                              />
                            ))
                          }
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {category && (
                    <Tooltip title="Delete Category" placement="top">
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
                      type="button"
                      variant="contained"
                      //disabled={isSubmitting}
                      onClick={(e) => {
                        addCategoryAPI();
                      }}
                    >
                      {category ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {category && <AlertCategoryDelete id={category.categoryId!} title={newCategory} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}
