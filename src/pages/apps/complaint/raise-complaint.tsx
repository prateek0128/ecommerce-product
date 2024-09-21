import { useState, ChangeEvent, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Avatar from 'components/@extended/Avatar';
import { ThemeMode, Gender } from 'config';
// project-imports
import MainCard from 'components/MainCard';

// assets
import { Box, DocumentUpload } from 'iconsax-react';
import { Camera, CloseCircle, Trash } from 'iconsax-react';
import { Autocomplete, FormLabel } from '@mui/material';
import { raiseComplaint } from 'apiServices/complaint';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { APP_DEFAULT_PATH } from 'config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
// constant
const warrantyStatus = [
  {
    value: 'in warranty',
    label: 'In Warranty'
  },
  {
    value: 'out of warranty',
    label: 'Out of Warranty'
  }
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
interface ErrorData {
  response: any;
}
// ==============================|| ECOMMERCE - ADD PRODUCT ||============================== //

export default function AddNewProduct() {
  const history = useNavigate();
  const theme = useTheme();
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [warranty, setWarranty] = useState('in warranty');
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Select Item');
  const [itemImageUrl, setItemImageUrl] = useState<string | undefined>(undefined);
  const [itemFile, setItemFile] = useState<File | undefined>(undefined);
  const fileInputRefItem = useRef<HTMLInputElement | null>(null);
  const [billImageUrl, setBillImageUrl] = useState<string | undefined>(undefined);
  const [billFile, setBillFile] = useState<File | undefined>(undefined);
  const fileInputRefBill = useRef<HTMLInputElement | null>(null);

  const handleCancel = () => {
    history('/apps/complaint/complaints-list');
  };
  const handleCustomerNameChange = (event: ChangeEvent<HTMLInputElement>) => setCustomerName(event.target.value);
  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value);
  const handleSubcategoryChange = (newValue: string | null) => {
    if (newValue !== null) {
      setSelectedSubcategory(newValue); // Handle the new value if it's not null
    } else {
      setSelectedSubcategory(''); // Optionally, reset if null
    }
  };
  const handleWarranty = (event: ChangeEvent<HTMLInputElement>) => {
    setWarranty(event.target.value);
  };
  const handleButtonClickItem = () => {
    // Trigger the file input when the button is clicked
    fileInputRefItem.current?.click();
  };
  const handleItemImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setItemImageUrl(imageUrl);
      setItemFile(file);
    }
  };
  const handleButtonClickBill = () => {
    // Trigger the file input when the button is clicked
    fileInputRefBill.current?.click();
  };
  const handleBillImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBillImageUrl(imageUrl);
      setBillFile(file);
    }
  };
  const raiseComplaintAPI = async (event: { preventDefault: () => void }) => {
    event?.preventDefault();
    const raiseComplaintData = {
      customerName: customerName,
      description: description,
      item: selectedSubcategory,
      warranty: warranty
    };
    if (!itemFile || !billFile) {
      alert('Please select both images.');
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('file1', itemFile);
    formData.append('file2', billFile);
    formData.append('data', JSON.stringify(raiseComplaintData));
    // Only append the file1 if it's selected
    // if (itemFile) {
    //   console.log('addCustomerImage', itemFile);
    //   formData.append('file1', itemFile);
    // } else {
    //   console.log('No image selected, proceeding without image');
    // }
    // Only append the file2 if it's selected
    // if (billFile) {
    //   console.log('addCustomerImage', billFile);
    //   formData.append('file2', billFile);
    // } else {
    //   console.log('No image selected, proceeding without image');
    // }
    try {
      const response = await raiseComplaint(formData);
      openSnackbar({
        open: true,
        message: 'Complaint raised successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      } as SnackbarProps);
      // closeModal();
    } catch (error) {
      console.error('Error fetching complaints:', error);
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
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Add Complaint' }];
  return (
    <>
      <Breadcrumbs custom heading="Add Complaint" links={breadcrumbLinks} />
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container spacing={1} direction="column">
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Customer Name</InputLabel>
                  <TextField placeholder="Enter customer name" value={customerName} fullWidth onChange={handleCustomerNameChange} />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}> Description</InputLabel>
                  <TextField placeholder="Enter description" value={description} fullWidth onChange={handleDescriptionChange} />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Item</InputLabel>
                  <Autocomplete
                    fullWidth
                    options={useMemo(() => {
                      // Get all subcategories from all categories and sort them alphabetically
                      return categories
                        .flatMap((cat) => cat.subcategories) // Flatten all subcategories into a single array
                        .sort((a, b) => a.localeCompare(b)); // Sort alphabetically
                    }, [categories])}
                    value={selectedSubcategory || ''}
                    onChange={(event, newValue) => handleSubcategoryChange(newValue)}
                    renderInput={(params) => <TextField {...params} label={!selectedSubcategory ? 'Select Item' : 'Select Item'} />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Warranty</InputLabel>
                  <TextField placeholder="Select warranty status" fullWidth select value={warranty} onChange={handleWarranty}>
                    {warrantyStatus.map((option, index) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Image of Item</InputLabel>
                  <Typography color="error.main">
                    *{' '}
                    <Typography component="span" color="text.secondary">
                      Recommended resolution is 640*640 with file size
                    </Typography>
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      {' '}
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<DocumentUpload />}
                        sx={{ mt: 1, textTransform: 'none' }}
                        onClick={handleButtonClickItem} // Trigger file input click
                      >
                        Click to Upload
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* Image display section */}
                      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                        <FormLabel
                          htmlFor="change-avtar"
                          sx={{
                            position: 'relative',
                            // borderRadius: '20%',
                            overflow: 'hidden',
                            '&:hover .MuiBox-root': { opacity: 1 },
                            cursor: 'pointer'
                          }}
                        >
                          {itemImageUrl && <img alt="Avatar" src={itemImageUrl} style={{ width: 72, height: 72 }} />}
                          {/* <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      > */}
                          <Stack spacing={0.5} alignItems="center">
                            <Camera style={{ color: 'white', fontSize: '2rem' }} />
                            <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                          </Stack>
                          {/* </Box> */}
                        </FormLabel>

                        {/* Hidden file input */}
                        <TextField
                          type="file"
                          id="change-avtar"
                          inputRef={fileInputRefItem} // Reference to the file input
                          sx={{ display: 'none' }}
                          onChange={handleItemImageChange} // Handle file selection
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                {warranty == 'in warranty' && (
                  <Grid item xs={12}>
                    <InputLabel sx={{ mb: 1 }}>Image of Bill</InputLabel>
                    <Typography color="error.main">
                      *{' '}
                      <Typography component="span" color="text.secondary">
                        Recommended resolution is 640*640 with file size
                      </Typography>
                    </Typography>
                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        {' '}
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<DocumentUpload />}
                          sx={{ mt: 1, textTransform: 'none' }}
                          onClick={handleButtonClickBill} // Trigger file input click
                        >
                          Click to Upload
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {/* Image display section */}
                        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                          <FormLabel
                            htmlFor="change-avtar"
                            sx={{
                              position: 'relative',
                              // borderRadius: '20%',
                              overflow: 'hidden',
                              '&:hover .MuiBox-root': { opacity: 1 },
                              cursor: 'pointer'
                            }}
                          >
                            {billImageUrl && <img alt="Avatar" src={billImageUrl} style={{ width: 72, height: 72 }} />}
                            {/* <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: 'rgba(0,0,0,.65)',
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      > */}
                            <Stack spacing={0.5} alignItems="center">
                              <Camera style={{ color: 'white', fontSize: '2rem' }} />
                              <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                            </Stack>
                            {/* </Box> */}
                          </FormLabel>

                          {/* Hidden file input */}
                          <TextField
                            type="file"
                            id="change-avtar"
                            inputRef={fileInputRefBill} // Reference to the file input
                            sx={{ display: 'none' }}
                            onChange={handleBillImageChange} // Handle file selection
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 6 }}>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={raiseComplaintAPI}>
                      Raise Complaint
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
}
