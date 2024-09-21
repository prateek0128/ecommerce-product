import { useEffect, useState, ChangeEvent, MouseEvent } from 'react';

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
import AlertCustomerDelete from './AlertTechicianDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { ThemeMode, Gender } from 'config';
import { openSnackbar } from 'api/snackbar';
import { insertCustomer, updateCustomer } from 'api/technician';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Camera, CloseCircle, Trash } from 'iconsax-react';

// types
import { SnackbarProps } from 'types/snackbar';
import { TechnicianList } from 'types/technician';

//api imoorts
import { addTechnician, updateTechnician } from 'apiServices/technician';
import { roles } from './technicianRoles';
interface StatusProps {
  value: number;
  label: string;
}
interface ErrorData {
  response: any;
}
// CONSTANT
const getInitialValues = (technician: TechnicianList | null) => {
  const newCustomer = {
    firstName: '',
    lastName: '',
    //name: '',
    id: 0,
    email: '',
    age: 18,
    profilePicture: '',
    gender: Gender.FEMALE,
    techRole: '',
    contact: '',
    location: ''
  };

  if (technician) {
    return _.merge({}, newCustomer, technician);
  }

  return newCustomer;
};

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormTechnicianAdd({ technician, closeModal }: { technician: TechnicianList | null; closeModal: () => void }) {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(
    getImageUrl(
      `avatar-${technician && technician !== null && technician?.profilePicture ? technician.profilePicture : 1}.png`,
      ImagePath.USERS
    )
  );
  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
      setSelectedFile(selectedImage);
    }
  }, [selectedImage]);
  const CustomerSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required('First Name is required'),
    lastName: Yup.string().max(255).required('Last Name is required'),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    status: Yup.string(),
    location: Yup.string().max(500),
    about: Yup.string().max(500)
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(technician!),
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      try {
        let newCustomer: TechnicianList = values;
        // newCustomer.name = newCustomer.firstName + ' ' + newCustomer.lastName;
        if (technician) {
          // updateCustomer(newCustomer.id!, newCustomer).then(() => {
          updateTechnician(newCustomer).then(() => {
            openSnackbar({
              open: true,
              message: 'Technician update successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            } as SnackbarProps);
            setSubmitting(false);
            closeModal();
          });
        } else {
          //  await insertCustomer(newCustomer).then(() => {
          addTechnician(newCustomer).then((response) => {
            openSnackbar({
              open: true,
              message: 'Technician added successfully.',
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
  const addTechnicianAPI = async () => {
    const { values } = formik;
    const newTechnicianData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      age: values.age,
      techRole: values.techRole,
      gender: values.gender,
      contact: values.contact,
      location: values.location
    };
    // Create a FormData object
    const formData = new FormData();
    formData.append('data', JSON.stringify(newTechnicianData));
    // Only append the file if it's selected
    if (selectedFile) {
      console.log('addCustomerImage', selectedFile);
      formData.append('file', selectedFile);
    } else {
      console.log('No image selected, proceeding without image');
    }
    try {
      const response = await addTechnician(formData);
      console;
      openSnackbar({
        open: true,
        message: 'Technician added successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      } as SnackbarProps);
      closeModal();
    } catch (error) {
      //console.error('Error fetching technicians:', error);
      const errorData = error as ErrorData;
      console.error('Error fetching technicians:', errorData.response.data.message);
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
  const updateTechnicianAPI = async () => {
    const { values } = formik;
    const updateTechnicianData = {
      id: values.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      age: values.age,
      techRole: values.techRole,
      gender: values.gender,
      contact: values.contact,
      location: values.location
    };
    // Create a FormData object
    // const formData = new FormData();
    // formData.append('data', JSON.stringify(updateTechnicianData));
    // // Only append the file if it's selected
    // if (selectedFile) {
    //   console.log('addCustomerImage', selectedFile);
    //   formData.append('file', selectedFile);
    // } else {
    //   console.log('No image selected, proceeding without image');
    // }
    try {
      const response = await updateTechnician(updateTechnicianData);
      openSnackbar({
        open: true,
        message: 'Technician updated successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      } as SnackbarProps);
      closeModal();
    } catch (error) {
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
    }
  };
  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
  const newTechnician = values.firstName + ' ' + values.lastName;

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form
            autoComplete="off"
            noValidate
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   technician ? updateTechnicianAPI(e, technician) : addTechnicianAPI(e);
            // }}
          >
            <DialogTitle>{technician ? 'Edit Technicain' : 'New Technician'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                    <FormLabel
                      htmlFor="change-avtar"
                      sx={{
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        '&:hover .MuiBox-root': { opacity: 1 },
                        cursor: 'pointer'
                      }}
                    >
                      <Avatar alt="Avatar 1" src={avatar} sx={{ width: 72, height: 72, border: '1px dashed' }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: theme.palette.mode === ThemeMode.DARK ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <Camera style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                          <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                        </Stack>
                      </Box>
                    </FormLabel>
                    <TextField
                      type="file"
                      id="change-avtar"
                      placeholder="Outlined"
                      variant="outlined"
                      sx={{ display: 'none' }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedImage(e.target.files?.[0])}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="technician-firstName">First Name</InputLabel>
                        <TextField
                          fullWidth
                          id="technician-firstName"
                          placeholder="Enter First Name"
                          {...getFieldProps('firstName')}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="technician-lastName">Last Name</InputLabel>
                        <TextField
                          fullWidth
                          id="technician-lastName"
                          placeholder="Enter Last Name"
                          {...getFieldProps('lastName')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={9}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="technician-email">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="technician-email"
                          placeholder="Enter Customer Email"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="technician-age">Age</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="technician-age"
                          placeholder="Enter Age"
                          {...getFieldProps('age')}
                          error={Boolean(touched.age && errors.age)}
                          helperText={touched.age && errors.age}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="technician-skills">Technician Role</InputLabel>
                        {/* <Autocomplete
                          multiple
                          fullWidth
                          id="technician-skills"
                          options={roles}
                          {...getFieldProps('skills')}
                          getOptionLabel={(label) => label}
                          onChange={(event, newValue) => {
                            setFieldValue('skills', newValue);
                          }}
                          renderInput={(params) => <TextField {...params} name="skill" placeholder="Add Skills" />}
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
                        /> */}
                        <FormControl fullWidth>
                          <Select
                            id="technician-skills"
                            // value={selectedCategory}
                            {...getFieldProps('techRole')}
                            onChange={(event) => {
                              // Use event.target.value to get the selected value
                              setFieldValue('techRole', event.target.value);
                            }}
                            displayEmpty
                            renderValue={(selected) => selected || 'Select a role'}
                          >
                            <MenuItem value="">Select a role</MenuItem>
                            {roles.map((role, index) => (
                              <MenuItem key={index} value={role}>
                                {role}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="technician-gender">Gender</InputLabel>
                        <RadioGroup row aria-label="payment-card" {...getFieldProps('gender')}>
                          <FormControlLabel control={<Radio value={Gender.FEMALE} />} label={Gender.FEMALE} />
                          <FormControlLabel control={<Radio value={Gender.MALE} />} label={Gender.MALE} />
                        </RadioGroup>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="technician-contact">Contact</InputLabel>
                        <TextField
                          fullWidth
                          id="technician-contact"
                          placeholder="Enter Contact"
                          {...getFieldProps('contact')}
                          error={Boolean(touched.contact && errors.contact)}
                          helperText={touched.contact && errors.contact}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="technician-location">Location</InputLabel>
                        <TextField
                          fullWidth
                          id="technician-location"
                          multiline
                          rows={2}
                          placeholder="Enter Location"
                          {...getFieldProps('location')}
                          error={Boolean(touched.location && errors.location)}
                          helperText={touched.location && errors.location}
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
                  {technician && (
                    <Tooltip title="Delete Customer" placement="top">
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
                      // disabled={isSubmitting}
                      onClick={(e) => {
                        //e.preventDefault(); // Prevent form submission
                        technician ? updateTechnicianAPI() : addTechnicianAPI();
                      }}
                    >
                      {technician ? 'Edit' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {technician && <AlertCustomerDelete id={technician.id!} title={newTechnician} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}
