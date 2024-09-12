import { useEffect, useState, ChangeEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Autocomplete, TextFieldProps } from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

import { ThemeMode, facebookColor, linkedInColor } from 'config';
import defaultImages from 'assets/images/users/default.png';

// assets
import { Apple, Camera, Facebook, Google } from 'iconsax-react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { isValid, subYears } from 'date-fns';
import countries from 'data/countries';
// styles & constant
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

// ==============================|| ACCOUNT PROFILE - PERSONAL ||============================== //

export default function TabPersonal() {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(defaultImages);
  const [firstName, setFirstName] = useState('Anshuman');
  const [lastName, setLastName] = useState('Sarthak');
  const [username, setUsername] = useState('Anshu_Sarthak_16');
  const [email, setEmail] = useState('anshu.sarthak@gmail.com');
  const [month, setMonth] = useState<number>(11); // Default to December
  const [day, setDay] = useState<number>(28); // Default to 28th
  const [selectedYear, setSelectedYear] = useState<number>(2000); // Default to 2000
  const [countryCode, setCountryCode] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [address, setAddress] = useState('Street 110-B Kalidas Baag, Bhopal');
  const [zipcode, setZipcode] = useState('956754');
  const [state, setState] = useState<string>('Madhya Pradesh');
  const [selectedCountry, setSelectedCountry] = useState<string | null>('IN');

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value);
  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value);
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  // Handle month change
  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setMonth(Number(event.target.value));
    // Adjust day if needed when changing the month
    if (day > 28 && month === 1) setDay(28);
  };

  // Handle day change
  const handleDayChange = (event: SelectChangeEvent<string>) => {
    setDay(Number(event.target.value));
  };
  // Function to handle year change
  const handleYearChange = (newValue: Date | null) => {
    if (newValue) {
      setSelectedYear(newValue.getFullYear()); // Update selectedYear state
    }
  };
  // Calculate eighteen years ago for maxDate
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  // Generate the number of days in a month
  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  // Handle country code change
  const handleCountryCodeChange = (event: SelectChangeEvent<string>) => {
    setCountryCode(event.target.value as string);
  };

  // Handle phone number change
  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => setAddress(event.target.value);
  const handleZipcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => setZipcode(event.target.value);
  // Handle state change
  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  };
  // Handle country change
  const handleCountryChange = (event: any, newValue: any) => {
    setSelectedCountry(newValue ? newValue.code : null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <MainCard title="Personal Information">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={2.5} alignItems="center" sx={{ m: 3 }}>
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
                  <Avatar alt="Avatar 1" src={avatar} sx={{ width: 76, height: 76 }} />
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
                      <Camera style={{ color: theme.palette.secondary.lighter, fontSize: '1.5rem' }} />
                      <Typography sx={{ color: 'secondary.lighter' }} variant="caption">
                        Upload
                      </Typography>
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
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-first-name">First Name</InputLabel>
                <TextField
                  fullWidth
                  defaultValue="Anshan"
                  value={firstName}
                  id="personal-first-name"
                  placeholder="First Name"
                  autoFocus
                  onChange={handleFirstNameChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-first-name">Last Name</InputLabel>
                <TextField
                  fullWidth
                  defaultValue="Handgun"
                  value={lastName}
                  id="personal-first-name"
                  placeholder="Last Name"
                  onChange={handleLastNameChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="my-account-username">Username</InputLabel>
                <TextField
                  fullWidth
                  defaultValue="Asoka_Tana_16"
                  value={username}
                  id="my-account-username"
                  placeholder="Username"
                  autoFocus
                  onChange={handleUsernameChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-email">Email Address</InputLabel>
                <TextField
                  type="email"
                  fullWidth
                  defaultValue="stebin.ben@gmail.com"
                  value={email}
                  id="personal-email"
                  placeholder="Email Address"
                  onChange={handleEmailChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="dob-month">Date of Birth (+18)</InputLabel>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Select fullWidth value={month.toString()} onChange={handleMonthChange} name="dob-month">
                    <MenuItem value="0">January</MenuItem>
                    <MenuItem value="1">February</MenuItem>
                    <MenuItem value="2">March</MenuItem>
                    <MenuItem value="3">April</MenuItem>
                    <MenuItem value="4">May</MenuItem>
                    <MenuItem value="5">June</MenuItem>
                    <MenuItem value="6">July</MenuItem>
                    <MenuItem value="7">August</MenuItem>
                    <MenuItem value="8">September</MenuItem>
                    <MenuItem value="9">October</MenuItem>
                    <MenuItem value="10">November</MenuItem>
                    <MenuItem value="11">December</MenuItem>
                  </Select>
                  <Select fullWidth value={day.toString()} onChange={handleDayChange} name="dob-date">
                    {[...Array(daysInMonth(month, selectedYear)).keys()].map((i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={['year']} // Only show year
                      value={selectedYear ? new Date(selectedYear, 0, 1) : null} // Ensure selected year is shown
                      maxDate={eighteenYearsAgo} // Maximum date constraint (18 years ago)
                      onChange={handleYearChange} // Handle year change
                      label="Year of Birth" // Optional label
                      sx={{ width: 1 }}
                    />
                  </LocalizationProvider>
                </Stack>
              </Stack>
            </Grid>
            {/* <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-location">Bio</InputLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  defaultValue="Hello, I’m Anshan Handgun Creative Graphic Designer & User Experience Designer based in Website, I create digital Products a more Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus at."
                  id="personal-location"
                  placeholder="Location"
                />
              </Stack>
            </Grid> */}
            {/* <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="personal-experience">Experiance</InputLabel>
                <Select fullWidth id="personal-experience" value={experience} onChange={handleChange} MenuProps={MenuProps}>
                  <MenuItem value="0">Start Up</MenuItem>
                  <MenuItem value="0.5">6 Months</MenuItem>
                  <MenuItem value="1">1 Year</MenuItem>
                  <MenuItem value="2">2 Years</MenuItem>
                  <MenuItem value="3">3 Years</MenuItem>
                  <MenuItem value="4">4 Years</MenuItem>
                  <MenuItem value="5">5 Years</MenuItem>
                  <MenuItem value="6">6 Years</MenuItem>
                  <MenuItem value="10">10+ Years</MenuItem>
                </Select>
              </Stack>
            </Grid> */}
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12}>
            <MainCard title="Social Network">
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    size="small"
                    startIcon={<Google variant="Bold" style={{ color: theme.palette.error.main }} />}
                    sx={{ color: theme.palette.error.main, '&:hover': { bgcolor: 'transparent' } }}
                  >
                    Google
                  </Button>
                  <Button color="error">Connect</Button>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    size="small"
                    startIcon={<Facebook variant="Bold" style={{ color: facebookColor }} />}
                    sx={{ color: facebookColor, '&:hover': { bgcolor: 'transparent' } }}
                  >
                    Facebook
                  </Button>
                  <Typography variant="subtitle1" sx={{ color: facebookColor }}>
                    Anshan Handgun
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    size="small"
                    startIcon={<Apple variant="Bold" style={{ color: linkedInColor }} />}
                    sx={{ color: linkedInColor, '&:hover': { bgcolor: 'transparent' } }}
                  >
                    Apple
                  </Button>
                  <Button color="error">Connect</Button>
                </Stack>
              </Stack>
            </MainCard>
          </Grid> */}
          <Grid item xs={12}>
            <MainCard title="Contact Information">
              <Grid container spacing={3}>
                {/* <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-email">Portfolio URL</InputLabel>
                    <TextField fullWidth defaultValue="https://anshan.dh.url" id="personal-url" placeholder="Portfolio URL" />
                  </Stack>
                </Grid> */}
                <Grid item xs={12} md={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-phone">Phone Number</InputLabel>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Select defaultValue="91" value={countryCode} onChange={handleCountryCodeChange}>
                        <MenuItem value="91">+91</MenuItem>
                        <MenuItem value="1-671">1-671</MenuItem>
                        <MenuItem value="36">+36</MenuItem>
                        <MenuItem value="225">(255)</MenuItem>
                        <MenuItem value="39">+39</MenuItem>
                        <MenuItem value="1-876">1-876</MenuItem>
                        <MenuItem value="7">+7</MenuItem>
                        <MenuItem value="254">(254)</MenuItem>
                        <MenuItem value="373">(373)</MenuItem>
                        <MenuItem value="1-664">1-664</MenuItem>
                        <MenuItem value="95">+95</MenuItem>
                        <MenuItem value="264">(264)</MenuItem>
                      </Select>
                      <PatternFormat
                        format="### ###-####"
                        mask="_"
                        fullWidth
                        customInput={TextField}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                      />
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-address">Address</InputLabel>
                    <TextField
                      fullWidth
                      defaultValue="Street 110-B Kalidas Baag, Bhopal"
                      value={address}
                      id="personal-address"
                      placeholder="Address"
                      onChange={handleAddressChange}
                    />
                  </Stack>
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-location">Country</InputLabel>
                    <TextField fullWidth defaultValue="New York" id="personal-location" placeholder="Location" />
                  </Stack>
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-zipcode">Zipcode</InputLabel>
                    <TextField
                      fullWidth
                      defaultValue="956754"
                      value={zipcode}
                      id="personal-zipcode"
                      placeholder="Zipcode"
                      onChange={handleZipcodeChange}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-state">State</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-state"
                      value={state} // Bind to state
                      onChange={handleStateChange} // Handle state changes
                      placeholder="State"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-country">Country</InputLabel>
                    <Autocomplete
                      id="personal-country"
                      fullWidth
                      value={countries.find((item) => item.code === selectedCountry) || null}
                      onChange={handleCountryChange} // Handle country selection
                      options={countries}
                      autoHighlight
                      isOptionEqualToValue={(option, value) => option.code === value?.code}
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          {option.code && (
                            <img
                              loading="lazy"
                              width="20"
                              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                              alt=""
                            />
                          )}
                          {/* {option.label} ({option.code}) {option.phone} */}
                          {option.label} ({option.code})
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Choose a country"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password' // Disable autocomplete
                          }}
                          sx={{
                            '.MuiInputBase-root': {
                              height: '49px' // Adjust height here
                            }
                          }}
                        />
                      )}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained">Update Profile</Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
