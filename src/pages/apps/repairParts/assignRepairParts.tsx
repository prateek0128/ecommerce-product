import { useState, ChangeEvent, useEffect, SetStateAction } from 'react';
// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Checkbox, FormControl, FormControlLabel, Select, SelectChangeEvent, Tab, Tabs } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { CloseCircle, DocumentUpload } from 'iconsax-react';
import { Autocomplete, Chip } from '@mui/material';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';
import repairParts2 from './repairParts';
import { assignRepairparts, techDetailsComplaint } from 'apiServices/repairParts';
import { getAllTechnicians } from 'apiServices/technician';
import { categories, technicianRoles, technicians, itemList, repairParts } from './assignRepairPartsData';
import { SnackbarProps } from 'types/snackbar';
import { openSnackbar } from 'api/snackbar';
import { getAllComplaints } from 'apiServices/complaint';
import { useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import AssignedRepairPartsList from './assignedRepairPartsList';
import { getItemList, getRepairPartsList } from 'apiServices/repairParts';

interface ErrorData {
  response: any;
}
interface TechniciansData {
  message: string;
  data: any;
}
interface ComplaintsData {
  message: string;
  Complaints: any;
}
interface TechData {
  message: string;
  assignedDetails: any;
}
interface ItemsData {
  data: any;
  message: any;
}
interface RepairPartsData {
  data: any;
  message: any;
}
// ==============================|| ECOMMERCE - ADD PRODUCT ||============================== //

export default function AssignRepairParts() {
  const history = useNavigate();
  const location = useLocation();
  const { complaintIdView } = location.state || 0;
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Assign Repair Parts' }];
  const [technicianId, setTechnicianId] = useState<number | null>(null);
  const [technicianName, setTechnicianName] = useState<string>('');
  const [technicianContact, setTechnicianContact] = useState<string>('');
  const [complaintId, setComplaintId] = useState<number>();
  const [selectedRepairParts, setSelectedRepairParts] = useState<{ part: string; quantity: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [allComplaintsData, setAllComplaintsData] = useState<any>([]);
  const [allItemsData, setAllItemsData] = useState<any>([]);
  const [allRepairPartsData, setAllRepairPartsData] = useState<any>([]);
  const [selectedItem, seSelectedItem] = useState('Select Item');
  const [selectedItemId, seSelectedItemId] = useState(0);
  const handleCancel = () => {
    history(`/apps/e-commerce/product-list`);
  };
  const handleItemChange = (newValue: any) => {
    if (newValue) {
      seSelectedItem(newValue.itemName);
      seSelectedItemId(newValue.itemId);
    }
  };
  const handleRepairPartsChange = (event: ChangeEvent<HTMLInputElement>, partName: string) => {
    const { checked } = event.target;
    // Update selectedRepairParts based on checkbox state
    setSelectedRepairParts((prevParts) => {
      if (checked) {
        // Add part with default quantity of 1
        return [...prevParts, { part: partName, quantity: 1 }];
      } else {
        // Remove part
        return prevParts.filter((part) => part.part !== partName);
      }
    });
  };
  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, partName: string) => {
    const quantity = parseInt(event.target.value, 10) || 1; // Default to 1 if invalid

    // Update quantity for the selected part
    setSelectedRepairParts((prevParts) => prevParts.map((part) => (part.part === partName ? { ...part, quantity } : part)));
  };
  const allComplaints =
    allComplaintsData &&
    allComplaintsData
      .filter((complaint: any) => complaint.Status === 'InProgress') // Filter only the pending complaints
      .map((complaint: any) => complaint.Complaint_Id);
  const allitems =
    allItemsData &&
    allItemsData.map((item: any, index: any) => ({
      itemName: item.Item_Name,
      itemId: item.Item_Id,
      isEnabled: item.IsEnabled
    }));

  const allRepairParts =
    allRepairPartsData &&
    allRepairPartsData.map((part: any, index: any) => {
      return part.Repair_Part_Name;
    });
  const getAllComplaintsAPI = () => {
    setLoading(true);
    getAllComplaints()
      .then((response) => {
        setLoading(false);
        const complaintsData = response.data as ComplaintsData;
        setAllComplaintsData(complaintsData.Complaints || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getTechDetailsAPI = (complaintId: number) => {
    setLoading(true);
    techDetailsComplaint(complaintId)
      .then((response) => {
        setLoading(false);
        const techData = response.data as TechData;
        setTechnicianId(techData.assignedDetails.Technician_Id);
        setTechnicianName(techData.assignedDetails.Technician_Name);
        setTechnicianContact(techData.assignedDetails.Contact);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getAllItemsAPI = () => {
    getItemList()
      .then((response) => {
        const itemsData = response.data as ItemsData;
        setAllItemsData(itemsData.data.categories || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getAllRepairPartsAPI = (selectedItemId: number) => {
    getRepairPartsList(selectedItemId)
      .then((response) => {
        const repairPartsData = response.data as RepairPartsData;
        setAllRepairPartsData(repairPartsData.data.subcategories || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAllItemsAPI();
    getAllRepairPartsAPI(selectedItemId);
  }, [selectedItemId]);
  useEffect(() => {
    getAllComplaintsAPI();
    if (complaintIdView && complaintIdView > 0) {
      getTechDetailsAPI(complaintIdView);
    }
  }, [complaintIdView]);
  const assignCategoryAPI = () => {
    const assignCategoryData = {
      complaintId: complaintIdView || complaintId,
      technicianId: technicianId,
      technicianName: technicianName,
      category: selectedItem,
      repairParts: selectedRepairParts
    };
    assignRepairparts(assignCategoryData)
      .then((response) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        openSnackbar({
          open: true,
          message: 'Item assigned successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        } as SnackbarProps);
        history(`/apps/e-commerce/product-list`);
      })
      .catch((error) => {
        console.error('Error assigning items:', error);
        const errorData = error as ErrorData;
        openSnackbar({
          open: true,
          message: errorData.response.data.message,
          variant: 'alert',
          alert: {
            color: 'error'
          }
        } as SnackbarProps);
      });
  };

  return (
    <>
      <Breadcrumbs custom heading="Assign Repair Parts" links={breadcrumbLinks} />
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container spacing={1} direction="column">
                <Grid item xs={12}>
                  <InputLabel htmlFor="complaintId" sx={{ mb: 1 }}>
                    Complaint Id
                  </InputLabel>
                  {complaintIdView ? (
                    <TextField
                      fullWidth
                      id="technicianName"
                      value={complaintIdView} // Display the technician name
                      placeholder="Technician name"
                      InputProps={{
                        readOnly: true // Set to read-only
                      }}
                    />
                  ) : (
                    <Autocomplete
                      fullWidth
                      id="complaintId"
                      options={allComplaints}
                      value={complaintId}
                      onChange={(event: React.SyntheticEvent, newValue: number | null) => {
                        setComplaintId(Number(newValue)); // This should work now
                        if (newValue) {
                          getTechDetailsAPI(Number(newValue)); // Call the API only if there's a valid new value
                        }
                      }}
                      renderInput={(params) => <TextField {...params} placeholder="Select complaint id" />}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="technicianName" sx={{ mb: 1 }}>
                    Technician Name
                  </InputLabel>
                  <TextField
                    fullWidth
                    id="technicianName"
                    value={
                      (complaintId || complaintIdView) && `${technicianName || ''} ${technicianContact && '-'} ${technicianContact || ''}`
                    } // Display the technician name
                    placeholder={complaintId || complaintIdView == null ? 'Technician name' : 'Technician Details'}
                    InputProps={{
                      readOnly: true // Set to read-only
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Item</InputLabel>
                  <Autocomplete
                    options={[
                      { itemName: 'Add New Item', itemId: 'new' },
                      ...(allitems ? allitems.sort((a: any, b: any) => a.itemName.localeCompare(b.itemName)) : []),
                      { itemName: 'Others', itemId: 'others' }
                    ]}
                    getOptionLabel={(option: any) => (typeof option === 'string' ? option : option.itemName)}
                    value={selectedItem ? allitems.find((item: any) => item.itemName === selectedItem) : null}
                    onChange={(event: React.SyntheticEvent, newValue: any) => {
                      if (newValue) {
                        handleItemChange(newValue);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Select Item" fullWidth />}
                    freeSolo
                    renderOption={(props, option: any) => (
                      <MenuItem {...props} key={option.itemId} value={option.itemId}>
                        {option.itemName}
                      </MenuItem>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 6 }}>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={assignCategoryAPI}>
                      Assign Item
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container direction={'column'} spacing={2} sx={{ width: '100%', minHeight: '340px', overflow: 'auto' }}>
                <Grid item xs={12}>
                  {selectedItem ? (
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs={12}>
                        <InputLabel sx={{ mb: 1 }}>Repair Parts</InputLabel>
                        <FormControl component="fieldset">
                          {allRepairParts.length > 0 ? (
                            allRepairParts.map((part: any) => {
                              const selectedPart = selectedRepairParts.find((p) => p.part === part);
                              const quantity = selectedPart ? selectedPart.quantity : 1; // Get the quantity or default to 1
                              return (
                                <Grid container key={part} sx={{ display: 'flex', alignItems: 'center', width: '100%' }} spacing={2}>
                                  <Grid item xs={selectedPart ? 9 : 12}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={!!selectedPart} // Check if the part is selected
                                          onChange={(e) => handleRepairPartsChange(e, part)}
                                          value={part}
                                        />
                                      }
                                      label={part}
                                    />
                                  </Grid>
                                  <Grid item xs={3}>
                                    {selectedPart && ( // Show quantity input if part is selected
                                      <TextField
                                        type="number"
                                        label="Quantity"
                                        inputProps={{ min: 1 }}
                                        value={quantity} // Use the quantity from selectedRepairParts
                                        sx={{
                                          '& .MuiInputBase-root': {
                                            height: '30px',
                                            padding: '4px'
                                          },
                                          '& .MuiInputLabel-root': {
                                            fontSize: '0.875rem'
                                          }
                                        }}
                                        onChange={(e) => handleQuantityChange(e, part)}
                                      />
                                    )}
                                  </Grid>
                                </Grid>
                              );
                            })
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No repair parts available for this subcategory.
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem', textAlign: 'center' }}>
                      No item is selected.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
}
