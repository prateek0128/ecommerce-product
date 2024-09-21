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
import { getTechnicianDetails } from 'apiServices/technician';
import { useEffect } from 'react';

// ==============================|| CUSTOMER - VIEW ||============================== //

export default function TechnicianView({ data }: any) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      try {
        const response = await getTechnicianDetails(data.id);
        console.log('getAllTechniciansAPI', response.data);
        //setAllTechniciansData(response.data || []);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };

    fetchTechnicianDetails();
  }, []);
  return (
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        {/* <Grid item xs={12} sm={5} md={4} lg={4} xl={3}>
          <MainCard>
            <Chip
              label={data.status}
              size="small"
              color="primary"
              sx={{ position: 'absolute', right: 10, top: 10, fontSize: '0.675rem' }}
            />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={2.5} alignItems="center">
                  <Avatar alt="Avatar 1" size="xl" src={getImageUrl(`avatar-${data.avatar}.png`, ImagePath.USERS)} />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">{data.fatherName}</Typography>
                    <Typography color="secondary">{data.role}</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-around" alignItems="center">
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">{data.age}</Typography>
                    <Typography color="secondary">Age</Typography>
                  </Stack>
                  <Divider orientation="vertical" flexItem />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">{data.progress}%</Typography>
                    <Typography color="secondary">Progress</Typography>
                  </Stack>
                  <Divider orientation="vertical" flexItem />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5">{data.visits}</Typography>
                    <Typography color="secondary">Visits</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <List aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                  <ListItem>
                    <ListItemIcon>
                      <Sms size={18} />
                    </ListItemIcon>
                    <ListItemSecondaryAction>
                      <Typography align="right">{data.email}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Mobile size={18} />
                    </ListItemIcon>
                    <ListItemSecondaryAction>
                      <Typography align="right">
                        <PatternFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={data.contact} />
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Location size={18} />
                    </ListItemIcon>
                    <ListItemSecondaryAction>
                      <Typography align="right">{data.country}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Link2 size={18} />
                    </ListItemIcon>
                    <ListItemSecondaryAction>
                      <Link align="right" href="https://google.com" target="_blank">
                        https://anshan.dh.url
                      </Link>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </MainCard>
        </Grid> */}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Stack spacing={2.5}>
            <MainCard title="Personal Details">
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
                        <Typography color="secondary">Technician Role</Typography>
                        <Typography>{data.techRole}</Typography>
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
                    {/* <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Country</Typography>
                        <Typography>{data.country}</Typography>
                      </Stack>
                    </Grid> */}
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Email</Typography>
                        <Typography>{data.email}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Contact</Typography>
                        <Typography>{data.contact}</Typography>
                      </Stack>
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Zip Code</Typography>
                        <Typography>
                          <PatternFormat displayType="text" format="### ###" mask="_" defaultValue={data.contact} />
                        </Typography>
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
                  <Stack spacing={0.5}>
                    <Typography color="secondary">Address</Typography>
                    <Typography>{data.location}</Typography>
                  </Stack>
                </ListItem>
              </List>
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
