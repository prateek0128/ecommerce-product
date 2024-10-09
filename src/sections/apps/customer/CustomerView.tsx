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
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Transitions from 'components/@extended/Transitions';

import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Link2, Location, Mobile, Sms } from 'iconsax-react';
import { getCustomerDetails } from 'apiServices/customer';
import { useEffect, useState } from 'react';

interface CustomerData {
  message: string;
  Details: any;
}
// ==============================|| CUSTOMER - VIEW ||============================== //

export default function CustomerView({ data }: any) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const [customerProfile, setCustomerProfile] = useState('');
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await getCustomerDetails(data.id);
        const customerData = response.data as CustomerData;
        const customerDetails = customerData.Details[0];
        setCustomerProfile(customerDetails.Profile_Picture);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    fetchCustomerDetails();
  }, []);
  return (
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Stack spacing={2.5}>
            <MainCard title="Customer Details">
              <Grid container spacing={2.5} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar
                      alt="Avatar 1"
                      sx={{ height: 150, width: 150 }}
                      src={customerProfile ? customerProfile : getImageUrl(`avatar-${data.avatar}.png`, ImagePath.USERS)}
                    />
                    <Stack spacing={0.5} alignItems="center">
                      <Typography variant="h5">{data.fatherName}</Typography>
                      <Typography color="secondary">{data.role}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <List sx={{ py: 0 }}>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Full Name</Typography>
                            <Typography>
                              Mr. {data.firstName} {data.lastName}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Email</Typography>
                            <Typography>{data.email}</Typography>
                          </Stack>
                        </Grid>
                        {/* <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Father Name</Typography>
                        <Typography>{data.fatherName}</Typography>
                      </Stack>
                    </Grid> */}
                      </Grid>
                    </ListItem>
                    <ListItem divider={!matchDownMD}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Gender</Typography>
                            <Typography>{data.gender}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Age</Typography>
                            <Typography>{data.age}</Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                      {/* <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Father Name</Typography>
                        <Typography>{data.fatherName}</Typography>
                      </Stack>
                    </Grid> */}
                    </ListItem>
                    <ListItem>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Contact</Typography>
                            <Typography>{data.contact}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Address</Typography>
                            <Typography>{data.location}</Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
            {/* <MainCard title="About me">
              <Typography color="secondary">
                Hello, I’m {data.fatherName} {data.role} based in international company, {data.about}
              </Typography>
            </MainCard> */}
          </Stack>
        </Grid>
      </Grid>
    </Transitions>
  );
}
