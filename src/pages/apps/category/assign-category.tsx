import { useState, ChangeEvent, useEffect, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { width } from '@mui/system';

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
// constant
const technicians = [
  'Alex Johnson',
  'Brooke Simmons',
  'Cameron Lee',
  'Dylan Patel',
  'Evelyn Martinez',
  'Finn Thompson',
  'Grace Clark',
  'Harper Lewis',
  'Isaac White',
  'Jasmine Harris',
  'Kyle Walker',
  'Liam Robinson',
  'Mason Wright',
  'Nora Evans',
  'Oliver Hall',
  'Paige Young',
  'Quinn King',
  'Riley Green',
  'Sophie Turner',
  'Tyler Scott'
];
const technicianRoles = [
  'Mechanical Engineering Technician',
  'Electrical Engineering Technician',
  'Electronics Technician',
  'HVAC Technician (Heating, Ventilation, and Air Conditioning)',
  'Automotive Technician',
  'Aerospace Technician',
  'Civil Engineering Technician',
  'Industrial Engineering Technician',
  'Quality Control Technician',
  'Robotics Technician',
  'Maintenance Technician',
  'Instrumentation Technician',
  'CNC Technician (Computer Numerical Control)',
  'Telecommunications Technician',
  'Cable Technician',
  'Fiber Optic Technician',
  'RF Technician (Radio Frequency Technician)',
  'Satellite Technician',
  'Automotive Service Technician',
  'Diesel Technician',
  'Aviation Technician',
  'Marine Technician',
  'Motorcycle Technician',
  'Electrical Technician',
  'Wind Turbine Technician',
  'Solar Technician',
  'Power Plant Technician',
  'Gas Technician',
  'Water Treatment Technician',
  'Construction Technician',
  'Elevator Technician',
  'Building Maintenance Technician',
  'Plumbing Technician',
  'Carpentry Technician',
  'Audio/Visual Technician',
  'Broadcast Technician',
  'Sound Technician',
  'Lighting Technician',
  'Stage Technician',
  'Agricultural Technician',
  'Forestry Technician',
  'Environmental Field Technician',
  'Horticulture Technician',
  'Veterinary Technician',
  'Pest Control Technician',
  'Crime Scene Technician',
  'Nail Technician',
  'Esthetician Technician',
  'IT Support Technician',
  'Network Technician',
  'Help Desk Technician',
  'System Technician',
  'Hardware Technician',
  'Field Service Technician',
  'Data Center Technician',
  'Cybersecurity Technician'
];
const categories = [
  {
    id: 1,
    name: 'Electronics',
    subcategories: [
      'Mobile Phones',
      'Laptops',
      'Headphones',
      'Cameras',
      'Smartwatches',
      'Televisions',
      'Home Audio',
      'Wearable Technology',
      'Gaming Consoles',
      'Smart Home Devices',
      'Drones',
      'Portable Speakers'
    ]
  },
  {
    id: 2,
    name: 'Clothing',
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Kids' Clothing",
      'Accessories',
      'Footwear',
      'Activewear',
      'Outerwear',
      'Swimwear',
      'Sleepwear',
      'Plus Size',
      'Maternity',
      'Uniforms'
    ]
  },
  {
    id: 3,
    name: 'Home & Kitchen',
    subcategories: [
      'Furniture',
      'Cookware',
      'Decor',
      'Appliances',
      'Bedding',
      'Storage Solutions',
      'Outdoor Furniture',
      'Lighting',
      'Garden Tools',
      'Cleaning Supplies',
      'Kitchen Storage',
      'Small Kitchen Appliances',
      'Barware'
    ]
  },
  {
    id: 4,
    name: 'Books',
    subcategories: [
      'Fiction',
      'Non-Fiction',
      'Educational',
      "Children's Books",
      'Comics & Graphic Novels',
      'Cookbooks',
      'Self-Help',
      'Biographies',
      'Science Fiction & Fantasy',
      'History',
      'Romance',
      'Travel',
      'Cookery'
    ]
  },
  {
    id: 5,
    name: 'Health & Beauty',
    subcategories: [
      'Skincare',
      'Haircare',
      'Personal Care',
      'Vitamins & Supplements',
      'Makeup',
      'Fragrances',
      'Fitness Equipment',
      'Oral Care',
      "Men's Grooming",
      'Body Care',
      'Hair Tools',
      'Health Monitors',
      'Wellness'
    ]
  },
  {
    id: 6,
    name: 'Toys & Games',
    subcategories: [
      'Action Figures',
      'Board Games',
      'Educational Toys',
      'Dolls',
      'Outdoor Play',
      'Building Toys',
      'Puzzles',
      'Pretend Play',
      'Remote Control',
      'Ride-Ons',
      'Arts & Crafts',
      'Electronic Toys',
      'STEM Toys'
    ]
  },
  {
    id: 7,
    name: 'Sports & Outdoors',
    subcategories: [
      'Camping & Hiking',
      'Fitness & Exercise',
      'Sports Equipment',
      'Cycling',
      'Fishing',
      'Water Sports',
      'Winter Sports',
      'Running',
      'Outdoor Furniture',
      'Sports Apparel',
      'Yoga & Pilates',
      'Climbing Gear',
      'Golf'
    ]
  },
  {
    id: 8,
    name: 'Automotive',
    subcategories: [
      'Car Electronics',
      'Interior Accessories',
      'Exterior Accessories',
      'Tools & Equipment',
      'Car Care',
      'Replacement Parts',
      'Motorcycles & ATVs',
      'Car Safety',
      'Auto Detailing',
      'Truck Accessories',
      'Car Covers',
      'Towing Equipment',
      'Car Lighting'
    ]
  },
  {
    id: 9,
    name: 'Office Supplies',
    subcategories: [
      'Furniture',
      'Stationery',
      'Printer Supplies',
      'Office Electronics',
      'Organization',
      'Office Décor',
      'Desks & Chairs',
      'Mailing Supplies',
      'Breakroom Supplies',
      'Calendars & Planners',
      'Filing & Storage',
      'Whiteboards',
      'Presentation Supplies'
    ]
  },
  {
    id: 10,
    name: 'Pet Supplies',
    subcategories: [
      'Dog Supplies',
      'Cat Supplies',
      'Bird Supplies',
      'Fish Supplies',
      'Small Animal Supplies',
      'Pet Furniture',
      'Pet Health',
      'Grooming',
      'Training & Behavior',
      'Pet Travel',
      'Aquarium Supplies',
      'Reptile Supplies',
      'Pet Apparel'
    ]
  },
  {
    id: 11,
    name: 'Garden & Outdoor',
    subcategories: [
      'Plants',
      'Garden Tools',
      'Outdoor Furniture',
      'Grills & Outdoor Cooking',
      'Planters & Pots',
      'Outdoor Lighting',
      'Fencing',
      'Gardening Supplies',
      'Outdoor Decor',
      'Landscaping',
      'Water Features',
      'Outdoor Heating',
      'Patio Furniture'
    ]
  },
  {
    id: 12,
    name: 'Jewelry & Watches',
    subcategories: [
      'Necklaces & Pendants',
      'Earrings',
      'Bracelets',
      'Rings',
      'Watches',
      'Brooches & Pins',
      "Men's Jewelry",
      'Jewelry Sets',
      'Jewelry Care & Storage',
      'Engagement & Wedding',
      'Luxury Watches',
      'Fashion Jewelry',
      'Custom Jewelry'
    ]
  },
  {
    id: 13,
    name: 'Arts & Crafts',
    subcategories: [
      'Drawing & Painting',
      'Craft Supplies',
      'Sewing & Knitting',
      'Beading & Jewelry Making',
      'Scrapbooking',
      'Model Building',
      'Art Supplies',
      'Fabric & Textiles',
      'Craft Kits',
      'Painting Tools',
      'DIY Projects',
      'Art Storage',
      'Craft Tools'
    ]
  },
  {
    id: 14,
    name: 'Musical Instruments',
    subcategories: [
      'Guitars',
      'Pianos & Keyboards',
      'Drums',
      'Orchestral Instruments',
      'Wind Instruments',
      'Electronic Instruments',
      'Recording Equipment',
      'Accessories',
      'Sheet Music',
      'Amplifiers',
      'Instrument Care',
      'Microphones',
      'DJ Equipment'
    ]
  },
  {
    id: 15,
    name: 'Baby Products',
    subcategories: [
      'Clothing',
      'Diapers & Wipes',
      'Feeding',
      'Nursery Furniture',
      'Toys',
      'Baby Gear',
      'Health & Safety',
      'Bedding',
      'Travel Gear',
      'Bath',
      'Car Seats',
      'Baby Monitors',
      'Swings & Bouncers'
    ]
  },
  {
    id: 16,
    name: 'Food & Beverage',
    subcategories: [
      'Snacks',
      'Beverages',
      'Groceries',
      'Gourmet Foods',
      'Health Foods',
      'Specialty Foods',
      'Organic',
      'Packaged Meals',
      'Baking Ingredients',
      'Condiments & Sauces',
      'Canned & Jarred Foods',
      'Frozen Foods',
      'Organic Produce'
    ]
  },
  {
    id: 17,
    name: 'Industrial & Scientific',
    subcategories: [
      'Lab Equipment',
      'Industrial Tools',
      'Safety Equipment',
      'Scientific Instruments',
      'Cleaning Supplies',
      'Office Supplies',
      'Material Handling',
      'Measuring & Testing',
      'HVAC',
      'Workplace Safety',
      'Construction Supplies',
      'Industrial Lighting',
      'Pumps & Valves'
    ]
  },
  {
    id: 18,
    name: 'Travel',
    subcategories: [
      'Luggage',
      'Travel Accessories',
      'Travel Clothing',
      'Outdoor Gear',
      'Travel Guides',
      'Electronics',
      'Travel Bags',
      'Travel Toiletries',
      'Camping Equipment',
      'Travel Health',
      'Travel Organizers',
      'Travel Security',
      'Travel Pillows'
    ]
  },
  {
    id: 19,
    name: 'Furniture',
    subcategories: [
      'Living Room Furniture',
      'Bedroom Furniture',
      'Office Furniture',
      'Outdoor Furniture',
      'Storage & Organization',
      'Dining Room Furniture',
      "Kids' Furniture",
      'Furniture Sets',
      'Mattresses',
      'Accent Furniture',
      'Home Office Furniture',
      'Furniture Accessories'
    ]
  },
  {
    id: 20,
    name: 'Hobbies',
    subcategories: [
      'Model Trains',
      'RC Vehicles',
      'Drones',
      'Collectibles',
      'Puzzles',
      'Board Games',
      'Craft Kits',
      'Hobby Tools',
      'Kits & Supplies',
      'Gardening',
      'Bird Watching',
      'Fishing'
    ]
  }
];
// ==============================|| ECOMMERCE - ADD PRODUCT ||============================== //

export default function AssignCategory() {
  const history = useNavigate();
  const [roles, setRoles] = useState<string[]>([]);
  const [technicianName, setTechnicianName] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleCancel = () => {
    history(`/apps/e-commerce/product-list`);
  };
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Assign Category' }];
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | ''>('');
  const [selectedRepairParts, setSelectedRepairParts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tabs, setTabs] = useState<{ category: string; subcategory: string; parts: string[] }[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
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
      setSelectedRepairParts([]); // Reset repair parts when category changes
      setTabs((prevTabs) => [...prevTabs, { category: newCategory, subcategory: '', parts: [] }]); // Add new tab for the category
      setActiveTab(tabs.length); // Set the new tab as active
    }
  };

  const handleSubcategoryChange = (event: SelectChangeEvent) => {
    const newSubcategory = event.target.value;
    setSelectedSubcategory(newSubcategory);
    setSelectedRepairParts([]); // Reset repair parts when subcategory changes
    setTabs((prevTabs) => prevTabs.map((tab, index) => (index === activeTab ? { ...tab, subcategory: newSubcategory, parts: [] } : tab))); // Update the subcategory in the active tab
  };

  const handleRepairPartsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setTabs((prevTabs) =>
      prevTabs.map((tab, index) =>
        index === activeTab
          ? {
              ...tab,
              parts: checked ? [...tab.parts, value] : tab.parts.filter((part) => part !== value)
            }
          : tab
      )
    ); // Update repair parts in the active tab
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const selectedTab = tabs[newValue];
    setSelectedCategory(selectedTab.category);
    setSelectedSubcategory(selectedTab.subcategory);
    setSelectedRepairParts(selectedTab.parts);
  };
  const categoryNames = categories.map((category) => category.name);
  console.log('categoryNames', categoryNames);
  return (
    <>
      <Breadcrumbs custom heading="Assign Category" links={breadcrumbLinks} />
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container spacing={1} direction="column">
                <Grid item xs={12}>
                  <InputLabel htmlFor="techinicians" sx={{ mb: 1 }}>
                    Technician Name
                  </InputLabel>
                  <Autocomplete
                    fullWidth
                    id="techinicians"
                    options={technicians}
                    value={technicianName}
                    onChange={(event: React.SyntheticEvent, newValue: string | null) => {
                      setTechnicianName(newValue); // This should work now
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Select technician name" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="techinician-role" sx={{ mb: 1 }}>
                    Technician Role
                  </InputLabel>
                  <Autocomplete
                    multiple
                    fullWidth
                    id="techinician-role"
                    options={technicianRoles}
                    value={roles}
                    onChange={(event, newValue) => {
                      setRoles(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Add Technicians" />}
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
                </Grid>
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
                    <Button variant="contained" sx={{ textTransform: 'none' }}>
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
                                          <FormControlLabel
                                            key={part}
                                            control={
                                              <Checkbox
                                                checked={tab.parts.includes(part)}
                                                onChange={handleRepairPartsChange}
                                                value={part}
                                              />
                                            }
                                            label={part}
                                          />
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
