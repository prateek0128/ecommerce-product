import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { Camera, DocumentUpload } from 'iconsax-react';
import { FormLabel, Select, SelectChangeEvent } from '@mui/material';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

//api imoorts
import { addProduct, updateProduct } from 'apiServices/products';

import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { Description } from '@mui/icons-material';
import { APP_DEFAULT_PATH } from 'config';

// constant
const prices = [
  {
    id: '1',
    label: '100'
  },
  {
    id: '2',
    label: '200'
  },
  {
    id: '3',
    label: '300'
  },
  {
    id: '4',
    label: '400'
  }
];

const quantities = [
  {
    id: '1',
    label: '1'
  },
  {
    id: '2',
    label: '2'
  },
  {
    id: '3',
    label: '3'
  }
];

const stockList = [
  {
    value: 'in stock',
    label: 'In Stock'
  },
  {
    value: 'out of stock',
    label: 'Out of Stock'
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

// ==============================|| ECOMMERCE - ADD PRODUCT ||============================== //

export default function AddNewProduct() {
  const history = useNavigate();
  const location = useLocation();
  const { productData } = location.state || {}; // Extract the passed data
  console.log('rowDataProduct2', productData ?? productData);
  console.log('rowDataProduct3', productData.category);
  const [productName, setProductName] = useState(productData.name);
  const [productDescription, setProductDescription] = useState(productData.description);
  const [quantity, setQuantity] = useState(productData?.quantity?.toString() || '');
  const [price, setPrice] = useState(productData.price);
  const [stockStatus, setStockStatus] = useState(productData.stock == 'In Stock' || 'instock' || 'in stock' ? 'in stock' : 'out of stock');
  const [selectedCategory, setSelectedCategory] = useState(productData.category || 'Select Category');
  const [selectedSubcategory, setSelectedSubcategory] = useState(productData.item || 'Select Item');
  const [productImage, setProductImage] = useState<string | undefined>(undefined);
  const fileInputRefProduct = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    console.log('rowDataProduct4', quantity);
    if (productData?.quantity) {
      setQuantity(productData.quantity); // Update state when productData is available
    }
    console.log('rowDataProduct5', selectedCategory);
    if (productData?.category) {
      setSelectedCategory(productData.category); // Update state when productData is available
    }
  }, [productData]);
  const handleProductName = (event: ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
  };
  const handleProductDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setProductDescription(event.target.value);
  };
  const handlePrice = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };
  const handleQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };
  // const handleQuantity = (event: SelectChangeEvent<any>) => {
  //   setQuantity(event.target.value as string);
  // };

  const handleStockStatus = (event: ChangeEvent<HTMLInputElement>) => {
    setStockStatus(event.target.value);
  };
  const handleCancel = () => {
    history(`/apps/e-commerce/product-list`);
  };
  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const categoryName = event.target.value;
    setSelectedCategory(categoryName);
    // Reset selected subcategory when category changes
    setSelectedSubcategory('');
  };
  const handleSubcategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedSubcategory(event.target.value);
  };
  const handleButtonClickProduct = () => {
    // Trigger the file input when the button is clicked
    fileInputRefProduct.current?.click();
  };

  const handleProductChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProductImage(imageUrl);
    }
  };
  const editProductAPI = async (event: { preventDefault: () => void }) => {
    event?.preventDefault();

    const editProductData = {
      id: productData.id,
      productName: productName,
      productDescription: productDescription,
      category: selectedCategory,
      item: selectedSubcategory,
      price: price,
      quantity: quantity,
      stock: stockStatus,
      productImage: productImage
    };
    try {
      const response = await updateProduct(editProductData);
      console.log('editProductAPI', response);
      openSnackbar({
        open: true,
        message: 'Product updated successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      } as SnackbarProps);
      // closeModal();
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Edit Product' }];
  console.log('stockList', stockList);

  return (
    <>
      <Breadcrumbs custom heading="Edit Product" links={breadcrumbLinks} />
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container spacing={1} direction="column">
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Product Name</InputLabel>
                  <TextField placeholder="Enter product name" fullWidth value={productName} onChange={handleProductName} />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Product Description</InputLabel>
                  <TextField
                    placeholder="Enter product description"
                    fullWidth
                    value={productDescription}
                    onChange={handleProductDescription}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Category</InputLabel>
                  <TextField placeholder="Category" fullWidth select value={selectedCategory || ''} onChange={handleCategoryChange}>
                    <MenuItem value="Select Category" disabled>
                      Select Category
                    </MenuItem>
                    {/* Placeholder */}
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Item</InputLabel>
                  <TextField
                    select
                    fullWidth
                    value={selectedSubcategory || ''}
                    onChange={handleSubcategoryChange}
                    disabled={!selectedCategory} // Disable if no category is selected
                  >
                    <MenuItem value="Select Item" disabled>
                      {!selectedSubcategory ? 'Select Item' : 'Select Item'}
                    </MenuItem>
                    {/* Placeholder */}
                    {selectedCategory
                      ? categories
                          .find((cat) => cat.name === selectedCategory) // Convert selectedCategory to number
                          ?.subcategories.map((sub) => (
                            <MenuItem key={sub} value={sub}>
                              {sub}
                            </MenuItem>
                          ))
                      : null}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Price (in Rupees)</InputLabel>
                  <TextField placeholder="Select Price" fullWidth select value={price} onChange={handlePrice}>
                    <MenuItem value={productData.price}>{productData.price}</MenuItem>
                    {prices.map((option) => (
                      <MenuItem key={option.id} value={option.label}>
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
                  <InputLabel sx={{ mb: 1 }}>Quantity</InputLabel>
                  <TextField placeholder="Select quantity" fullWidth select value={quantity} onChange={handleQuantity}>
                    {/* <Select value={quantity} onChange={handleQuantity} fullWidth placeholder="Select quantity"> */}
                    <MenuItem value={productData.quantity}>{productData.quantity}</MenuItem>
                    {quantities
                      .filter((option) => option.label != productData.quantity)
                      .map((option) => (
                        <MenuItem key={option.id} value={option.label}>
                          {option.label}
                        </MenuItem>
                      ))}
                    {/* </Select> */}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                  <TextField placeholder="Select status" fullWidth select value={stockStatus} onChange={handleStockStatus}>
                    {stockList.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Product Image</InputLabel>
                  <Typography color="error.main">
                    *{' '}
                    <Typography component="span" color="text.secondary">
                      Recommended resolution is 640*640 with file size
                    </Typography>
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<DocumentUpload />}
                        sx={{ mt: 1, textTransform: 'none' }}
                        onClick={handleButtonClickProduct} // Trigger file input click
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
                          {productImage && <img alt="Avatar" src={productImage} style={{ width: 72, height: 72 }} />}
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
                          inputRef={fileInputRefProduct} // Reference to the file input
                          sx={{ display: 'none' }}
                          onChange={handleProductChange} // Handle file selection
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 6 }}>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={editProductAPI}>
                      Update Product
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
