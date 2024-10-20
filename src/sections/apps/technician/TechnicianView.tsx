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

// assets
import { Link2, Location, Mobile, Sms } from 'iconsax-react';
import { getTechnicianDetails } from 'apiServices/technician';
import { useEffect, useState } from 'react';
import AssignedComplaintsModal from './AssingedComplaintsModal';
interface TechnicianData {
  message: string;
  Details: any;
}
// ==============================|| CUSTOMER - VIEW ||============================== //

export default function TechnicianView({ data }: any) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const [technicianProfile, setTechnicianProfile] = useState('');
  const [assignedComplaintsModal, setAssignedComplaintsModal] = useState<boolean>(false);
  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      try {
        const response = await getTechnicianDetails(data.id);
        const technicianData = response.data as TechnicianData;
        const technicianDetails = technicianData.Details[0];
        setTechnicianProfile(technicianDetails.Profile_Picture);
      } catch (error) {
        console.error('Error fetching technician details:', error);
      }
    };

    fetchTechnicianDetails();
  }, []);
  const handleModalToggler = () => {
    setAssignedComplaintsModal((prev) => !prev);
  };
  return (
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Stack spacing={2.5}>
            <MainCard title="Technician Details">
              <Grid container spacing={2.5} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2.5} alignItems="center">
                    <Avatar
                      alt="Avatar 1"
                      sx={{ height: 150, width: 150 }}
                      src={technicianProfile ? technicianProfile : getImageUrl(`avatar-${data.avatar}.png`, ImagePath.USERS)}
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
                            <Typography color="secondary">Technician Role</Typography>
                            <Typography>{data.techRole}</Typography>
                          </Stack>
                        </Grid>
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
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Typography color="secondary">Address</Typography>
                            <Typography>{data.location}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={0.5}>
                            <Button variant="contained" onClick={handleModalToggler} size="large">
                              Assigned Complaints
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
            {assignedComplaintsModal && (
              <AssignedComplaintsModal open={assignedComplaintsModal} modalToggler={handleModalToggler} complaintId={data.id} />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Transitions>
  );
}
