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
import repairParts from './repairParts';
import { assignCategory, techDetailsComplaint } from 'apiServices/category';
import { getAllTechnicians } from 'apiServices/technician';
import { categories, technicianRoles, technicians } from './assignCategoryData';
import { SnackbarProps } from 'types/snackbar';
import { openSnackbar } from 'api/snackbar';
import { getAllComplaints } from 'apiServices/complaint';
import { useLoaderData, useNavigate, useLocation } from 'react-router-dom';

// Define categories and subcategories explicitly
type Category =
  | 'Electronics'
  | 'Clothing'
  | 'Home & Kitchen'
  | 'Books'
  | 'Automotive'
  | 'Office Supplies'
  | 'Pet Supplies'
  | 'Health & Beauty'
  | 'Toys & Games'
  | 'Sports & Outdoors'
  | 'Garden & Outdoor'
  | 'Jewelry & Watches'
  | 'Arts & Crafts'
  | 'Musical Instruments'
  | 'Baby Products'
  | 'Food & Beverage'
  | 'Industrial & Scientific'
  | 'Travel'
  | 'Furniture'
  | 'Hobbies';
type Subcategory =
  | 'MobilePhones'
  | 'Laptops'
  | 'Headphones'
  | 'Cameras'
  | 'Smartwatches'
  | 'Televisions'
  | 'HomeAudio'
  | 'WearableTechnology'
  | 'GamingConsoles'
  | 'SmartHomeDevices'
  | 'Drones'
  | 'PortableSpeakers'
  | 'MensClothing'
  | 'WomensClothing'
  | 'KidsClothing'
  | 'Accessories'
  | 'Footwear'
  | 'Activewear'
  | 'Outerwear'
  | 'Swimwear'
  | 'Sleepwear'
  | 'PlusSize'
  | 'Maternity'
  | 'Uniforms'
  | 'Furniture'
  | 'Cookware'
  | 'Decor'
  | 'Appliances'
  | 'Bedding'
  | 'StorageSolutions'
  | 'OutdoorFurniture'
  | 'Lighting'
  | 'GardenTools'
  | 'CleaningSupplies'
  | 'KitchenStorage'
  | 'SmallKitchenAppliances'
  | 'Barware'
  | 'Fiction'
  | 'NonFiction'
  | 'Educational'
  | 'ChildrensBooks'
  | 'ComicsGraphicNovels'
  | 'Cookbooks'
  | 'SelfHelp'
  | 'Biographies'
  | 'ScienceFictionFantasy'
  | 'History'
  | 'Romance'
  | 'Travel'
  | 'Cookery'
  | 'Skincare'
  | 'Haircare'
  | 'PersonalCare'
  | 'VitaminsSupplements'
  | 'Makeup'
  | 'Fragrances'
  | 'FitnessEquipment'
  | 'OralCare'
  | 'MensGrooming'
  | 'BodyCare'
  | 'HairTools'
  | 'HealthMonitors'
  | 'Wellness'
  | 'ActionFigures'
  | 'BoardGames'
  | 'EducationalToys'
  | 'Dolls'
  | 'OutdoorPlay'
  | 'BuildingToys'
  | 'Puzzles'
  | 'PretendPlay'
  | 'RemoteControl'
  | 'RideOns'
  | 'ArtsCrafts'
  | 'ElectronicToys'
  | 'STEMToys'
  | 'CampingHiking'
  | 'FitnessExercise'
  | 'SportsEquipment'
  | 'Cycling'
  | 'Fishing'
  | 'WaterSports'
  | 'WinterSports'
  | 'Running'
  | 'OutdoorFurniture'
  | 'SportsApparel'
  | 'YogaPilates'
  | 'ClimbingGear'
  | 'Golf'
  | 'CarElectronics'
  | 'InteriorAccessories'
  | 'ExteriorAccessories'
  | 'ToolsEquipment'
  | 'CarCare'
  | 'ReplacementParts'
  | 'MotorcyclesATVs'
  | 'CarSafety'
  | 'AutoDetailing'
  | 'TruckAccessories'
  | 'CarCovers'
  | 'TowingEquipment'
  | 'CarLighting'
  | 'Furniture'
  | 'Stationery'
  | 'PrinterSupplies'
  | 'OfficeElectronics'
  | 'Organization'
  | 'OfficeDecor'
  | 'DesksChairs'
  | 'MailingSupplies'
  | 'BreakroomSupplies'
  | 'CalendarsPlanners'
  | 'FilingStorage'
  | 'Whiteboards'
  | 'PresentationSupplies'
  | 'DogSupplies'
  | 'CatSupplies'
  | 'BirdSupplies'
  | 'FishSupplies'
  | 'SmallAnimalSupplies'
  | 'PetFurniture'
  | 'PetHealth'
  | 'Grooming'
  | 'TrainingBehavior'
  | 'PetTravel'
  | 'AquariumSupplies'
  | 'ReptileSupplies'
  | 'PetApparel'
  | 'Plants'
  | 'GardenTools'
  | 'OutdoorFurniture'
  | 'GrillsOutdoorCooking'
  | 'PlantersPots'
  | 'OutdoorLighting'
  | 'Fencing'
  | 'GardeningSupplies'
  | 'OutdoorDecor'
  | 'Landscaping'
  | 'WaterFeatures'
  | 'OutdoorHeating'
  | 'PatioFurniture'
  | 'NecklacesPendants'
  | 'Earrings'
  | 'Bracelets'
  | 'Rings'
  | 'Watches'
  | 'BroochesPins'
  | 'MensJewelry'
  | 'JewelrySets'
  | 'JewelryCareStorage'
  | 'EngagementWedding'
  | 'LuxuryWatches'
  | 'FashionJewelry'
  | 'CustomJewelry'
  | 'DrawingPainting'
  | 'CraftSupplies'
  | 'SewingKnitting'
  | 'BeadingJewelryMaking'
  | 'Scrapbooking'
  | 'ModelBuilding'
  | 'ArtSupplies'
  | 'FabricTextiles'
  | 'CraftKits'
  | 'PaintingTools'
  | 'DIYProjects'
  | 'ArtStorage'
  | 'CraftTools'
  | 'Guitars'
  | 'PianosKeyboards'
  | 'Drums'
  | 'OrchestralInstruments'
  | 'WindInstruments'
  | 'ElectronicInstruments'
  | 'RecordingEquipment'
  | 'Accessories'
  | 'SheetMusic'
  | 'Amplifiers'
  | 'InstrumentCare'
  | 'Microphones'
  | 'DJEquipment'
  | 'Clothing'
  | 'DiapersWipes'
  | 'Feeding'
  | 'NurseryFurniture'
  | 'Toys'
  | 'BabyGear'
  | 'HealthSafety'
  | 'Bedding'
  | 'TravelGear'
  | 'Bath'
  | 'CarSeats'
  | 'BabyMonitors'
  | 'SwingsBouncers'
  | 'Snacks'
  | 'Beverages'
  | 'Groceries'
  | 'GourmetFoods'
  | 'HealthFoods'
  | 'SpecialtyFoods'
  | 'Organic'
  | 'AlcoholicBeverages'
  | 'CookingIngredients'
  | 'SaucesCondiments'
  | 'BakingSupplies'
  | 'MealKits'
  | 'CoffeeTea'
  | 'LabEquipment'
  | 'IndustrialTools'
  | 'SafetyEquipment'
  | 'ScientificInstruments'
  | 'CleaningSupplies'
  | 'OfficeSupplies'
  | 'MaterialHandling'
  | 'MeasuringTesting'
  | 'HVAC'
  | 'WorkplaceSafety'
  | 'ConstructionSupplies'
  | 'IndustrialLighting'
  | 'PumpsValves'
  | 'Luggage'
  | 'TravelAccessories'
  | 'TravelClothing'
  | 'OutdoorGear'
  | 'TravelGuides'
  | 'Electronics'
  | 'TravelBags'
  | 'TravelToiletries'
  | 'CampingEquipment'
  | 'TravelHealth'
  | 'TravelOrganizers'
  | 'TravelSecurity'
  | 'TravelPillows'
  | 'LivingRoomFurniture'
  | 'BedroomFurniture'
  | 'OfficeFurniture'
  | 'OutdoorFurniture'
  | 'StorageOrganization'
  | 'DiningRoomFurniture'
  | 'KidsFurniture'
  | 'FurnitureSets'
  | 'Mattresses'
  | 'AccentFurniture'
  | 'HomeOfficeFurniture'
  | 'FurnitureAccessories'
  | 'ModelTrains'
  | 'RCVehicles'
  | 'Drones'
  | 'Collectibles'
  | 'Puzzles'
  | 'BoardGames'
  | 'CraftKits'
  | 'HobbyTools'
  | 'KitsSupplies'
  | 'Gardening'
  | 'BirdWatching'
  | 'Fishing';

type RepairParts = {
  [key in Category]: {
    [key in Subcategory]?: string[]; // Optional subcategories
  };
};
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
// ==============================|| ECOMMERCE - ADD PRODUCT ||============================== //

export default function AssignCategory() {
  const history = useNavigate();
  const location = useLocation();
  const { complaintIdView } = location.state || 0;
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Assign Category' }];
  const [technicianId, setTechnicianId] = useState<number | null>(null);
  const [technicianName, setTechnicianName] = useState<string>('');
  const [technicianContact, setTechnicianContact] = useState<string>('');
  const [complaintId, setComplaintId] = useState<number>();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | ''>('');
  const [selectedRepairParts, setSelectedRepairParts] = useState<{ part: string; quantity: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  // const [tabs, setTabs] = useState<{ category: string; subcategory: string; parts: string[] }[]>([]);
  const [tabs, setTabs] = useState<{ category: string; subcategory: string; parts: { part: string; quantity: number }[] }[]>([]); // Update parts to include quantity
  const [activeTab, setActiveTab] = useState<number>(0);
  const [allTechniciansData, setAllTechniciansData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [allComplaintsData, setAllComplaintsData] = useState<any>([]);
  const handleCancel = () => {
    history(`/apps/e-commerce/product-list`);
  };
  const allComplaints =
    allComplaintsData &&
    allComplaintsData
      .filter((complaint: any) => complaint.Status === 'InProgress') // Filter only the pending complaints
      .map((complaint: any) => complaint.Complaint_Id);
  const allTechnicians =
    allTechniciansData &&
    allTechniciansData.map((technician: any, index: any) => {
      return `${technician.First_Name} ${technician.Last_Name} ${'-'} (${technician.Contact})`;
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
  useEffect(() => {
    getAllComplaintsAPI();
    if (complaintIdView && complaintIdView > 0) {
      getTechDetailsAPI(complaintIdView);
    }
  }, [complaintIdView]);
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await getAllTechnicians();
        const techniciansData = response.data as TechniciansData;
        setAllTechniciansData(techniciansData.data.Technicians || []);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };

    fetchTechnicians();
  }, []);
  const handleCategoryChange = (event: SelectChangeEvent) => {
    const newCategory = event.target.value;

    // Check if the category already exists in tabs
    const existingTabIndex = tabs.findIndex((tab) => tab.category === newCategory);

    if (existingTabIndex !== -1) {
      // If it exists, activate that tab
      setSelectedCategory(newCategory);
      setActiveTab(existingTabIndex);
    } else {
      // If it doesn't exist, create a new tab
      setSelectedCategory(newCategory);
      setSelectedSubcategory(''); // Reset subcategory when category changes
      //setSelectedRepairParts([]); // Reset repair parts when category changes
      setTabs((prevTabs) => [...prevTabs, { category: newCategory, subcategory: '', parts: [] }]); // Add new tab for the category
      setActiveTab(tabs.length); // Set the new tab as active
    }
  };
  const handleSubcategoryChange = (event: SelectChangeEvent) => {
    const newSubcategory = event.target.value;
    setSelectedSubcategory(newSubcategory);
    //setSelectedRepairParts([]); // Reset repair parts when subcategory changes
    setTabs((prevTabs) => prevTabs.map((tab, index) => (index === activeTab ? { ...tab, subcategory: newSubcategory, parts: [] } : tab))); // Update the subcategory in the active tab
  };
  const handleRepairPartsChange = (event: ChangeEvent<HTMLInputElement>, partName: string) => {
    const { value, checked } = event.target;
    const part = event.target.value;
    // if (event.target.checked) {
    //   setSelectedRepairParts((prevParts) => [...prevParts, part]); // Add the part to the selected list
    // } else {
    //   setSelectedRepairParts((prevParts) => prevParts.filter((p) => p !== part)); // Remove the part if unchecked
    // }
    // setTabs((prevTabs) =>
    //   prevTabs.map((tab, index) =>
    //     index === activeTab
    //       ? {
    //           ...tab,
    //           parts: checked ? [...tab.parts, value] : tab.parts.filter((part) => part !== value)
    //         }
    //       : tab
    //   )
    // ); // Update repair parts in the active tab
    setTabs((prevTabs) => {
      // Create the updated tabs array
      const updatedTabs = prevTabs.map((tab, index) =>
        index === activeTab
          ? {
              ...tab,
              parts: checked
                ? [...tab.parts, { part: partName, quantity: 1 }] // Set default quantity as 1 when checked
                : tab.parts.filter((part) => part.part !== partName) // Remove part when unchecked
            }
          : tab
      );

      // Immediately update selectedRepairParts based on the current active tab
      const currentParts = updatedTabs[activeTab]?.parts || [];
      setSelectedRepairParts(currentParts); // This can now be safely set here

      return updatedTabs; // Return the updated tabs
    });
  };
  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, partName: string) => {
    const quantity = parseInt(event.target.value, 10);
    setTabs((prevTabs) =>
      prevTabs.map((tab, index) =>
        index === activeTab
          ? {
              ...tab,
              parts: tab.parts.map((part) => (part.part === partName ? { ...part, quantity: quantity } : part))
            }
          : tab
      )
    );
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const selectedTab = tabs[newValue];
    setSelectedCategory(selectedTab.category);
    setSelectedSubcategory(selectedTab.subcategory);
    setSelectedRepairParts(selectedTab.parts);
  };
  const assignCategoryAPI = () => {
    const assignCategoryData = {
      complaintId: complaintId,
      technicianId: technicianId,
      technicianName: technicianName,
      // technicianContact: technicianContact,
      //technicianRole: roles,
      category: selectedCategory,
      subCategory: selectedSubcategory,
      repairParts: selectedRepairParts
    };
    assignCategory(assignCategoryData)
      .then((response) => {
        openSnackbar({
          open: true,
          message: 'Item assigned successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        } as SnackbarProps);
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
      <Breadcrumbs custom heading="Assign Category" links={breadcrumbLinks} />
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

                {/* <Grid item xs={12}>
                  <InputLabel htmlFor="techinician-role" sx={{ mb: 1 }}>
                    Technician Role
                  </InputLabel>
                  <Autocomplete
                    fullWidth
                    id="techinicians"
                    options={technicianRoles}
                    value={roles}
                    onChange={(event: React.SyntheticEvent, newValue: string | null) => {
                      setRoles(newValue); // This should work now
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Select technician name" />}
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Category</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      displayEmpty
                      renderValue={(selected) => selected || 'Select a category'}
                    >
                      <MenuItem value="">Select a category</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  {selectedCategory ? (
                    <>
                      <Tabs value={activeTab} onChange={handleTabChange}>
                        {tabs.map((tab, index) => (
                          <Tab key={index} label={tab.category} />
                        ))}
                      </Tabs>
                      {tabs.map((tab, index) => (
                        <div role="tabpanel" hidden={activeTab !== index} key={index}>
                          {activeTab === index && (
                            <Grid container direction="column" spacing={2}>
                              <Grid item xs={12}>
                                <InputLabel sx={{ mb: 1 }}>Subcategory</InputLabel>
                                <FormControl fullWidth>
                                  <Select
                                    value={tab.subcategory}
                                    onChange={handleSubcategoryChange}
                                    displayEmpty
                                    renderValue={(selected) => selected || 'Select a subcategory to assign repair parts'}
                                  >
                                    <MenuItem value="">Select a subcategory</MenuItem>
                                    {categories
                                      .find((category) => category.name === tab.category)
                                      ?.subcategories.map((subcategory) => (
                                        <MenuItem key={subcategory} value={subcategory}>
                                          {subcategory}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12}>
                                {tab.category && tab.subcategory && (
                                  <>
                                    <InputLabel sx={{ mb: 1 }}>Repair Parts</InputLabel>
                                    <FormControl component="fieldset">
                                      {(repairParts[tab.category as Category][tab.subcategory as Subcategory] ?? []).length > 0 ? (
                                        (repairParts[tab.category as Category][tab.subcategory as Subcategory] ?? []).map((part) => (
                                          <Grid
                                            container
                                            key={part}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            spacing={2}
                                          >
                                            <Grid item xs={6}>
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={tab.parts.some((p) => p.part === part)}
                                                    onChange={(e) => handleRepairPartsChange(e, part)}
                                                    value={part}
                                                  />
                                                }
                                                label={part}
                                              />
                                            </Grid>
                                            <Grid item xs={6}>
                                              {tab.parts.some((p) => p.part === part) && (
                                                <TextField
                                                  type="number"
                                                  label="Quantity"
                                                  inputProps={{ min: 1 }}
                                                  value={tab.parts.find((p) => p.part === part)?.quantity || 1}
                                                  sx={{
                                                    '& .MuiInputBase-root': {
                                                      height: '30px', // Adjust input height
                                                      padding: '4px' // Reduce padding for smaller height
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                      fontSize: '0.875rem' // Adjust label font size to better fit
                                                    }
                                                  }}
                                                  onChange={(e) => handleQuantityChange(e, part)}
                                                />
                                              )}
                                            </Grid>
                                          </Grid>
                                        ))
                                      ) : (
                                        <Typography variant="body2" color="textSecondary">
                                          No repair parts available for this subcategory.
                                        </Typography>
                                      )}
                                    </FormControl>
                                  </>
                                )}
                              </Grid>
                            </Grid>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem', textAlign: 'center' }}>
                      No category is selected.
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
