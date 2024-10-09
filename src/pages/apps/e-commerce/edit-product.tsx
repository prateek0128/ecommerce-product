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
import { Autocomplete, FormLabel, Select, SelectChangeEvent } from '@mui/material';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

//api imoorts
import { addProduct, updateProduct } from 'apiServices/products';

import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { Description } from '@mui/icons-material';
import { APP_DEFAULT_PATH } from 'config';
import { categories } from './productCategories';
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
const itemList = [
  'CCTV Camera HD',
  'CCTV Camera IP',
  'EPABX/INTERCOM',
  'Biometric Attendance Machine',
  'GPS',
  'Electric Fencing',
  'Desktop Computer',
  'Printers',
  'Servers',
  'Vedio Door Phone',
  'Electronic Locks',
  'Wifi/Networking',
  'LED Monitors'
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
interface ErrorData {
  response: any;
}
// ==============================|| ECOMMERCE - ADD PRODUCT ||============================== //

export default function AddNewProduct() {
  const history = useNavigate();
  const location = useLocation();
  const { productData } = location.state || {}; // Extract the passed data
  console.log('productData', productData);
  const [productName, setProductName] = useState(productData.name);
  const [productDescription, setProductDescription] = useState(productData.description);
  const [quantity, setQuantity] = useState(productData?.quantity?.toString() || '');
  const [price, setPrice] = useState(productData.price);
  const [stockStatus, setStockStatus] = useState(productData.stock == 'In Stock' || 'instock' || 'in stock' ? 'in stock' : 'out of stock');
  const [selectedItem, setSelectedItem] = useState(productData.item || 'Select Item');
  const [categoryForm, setCategoryForm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(productData.item || 'Select Item');
  const [productImage, setProductImage] = useState<string | undefined>(undefined);
  const fileInputRefProduct = useRef<HTMLInputElement | null>(null);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  useEffect(() => {
    if (productData?.quantity) {
      setQuantity(productData.quantity); // Update state when productData is available
    }
    if (productData?.category) {
      setSelectedItem(productData.category); // Update state when productData is available
    }
  }, [productData]);
  const handleItemModal = () => {
    setOpenCategoryModal((prev) => !prev);
  };
  const handleProductName = (event: ChangeEvent<HTMLInputElement>) => {
    setProductName(event.target.value);
  };
  const handleProductDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setProductDescription(event.target.value);
  };
  const handleItemChange = (newValue: any) => {
    if (newValue) {
      setSelectedItem(newValue);
      setCategoryForm(newValue);
      //setCategoryId(newValue);
    }
    // Reset selected subcategory when category changes
    setSelectedSubcategory('');
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
    setSelectedItem(categoryName);
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
      category: selectedItem,
      item: selectedSubcategory,
      price: price,
      quantity: quantity,
      stock: stockStatus,
      productImage: productImage
    };
    try {
      const response = await updateProduct(editProductData);
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
      console.error('Error fetching products:', error);
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
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Edit Product' }];

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
                  <InputLabel sx={{ mb: 1 }}>Item</InputLabel>
                  <Autocomplete
                    options={['Add New Item', ...(itemList ? itemList.sort() : []), 'Others']}
                    value={selectedItem ? itemList.find((category: any) => category === selectedItem) : null}
                    onChange={(event: React.SyntheticEvent, newValue) => {
                      if (newValue) {
                        if (typeof newValue === 'string' && newValue === 'Add New Category') {
                          handleItemModal();
                        } else if (typeof newValue !== 'string') {
                          handleItemChange(newValue);
                        }
                      }
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Select Item" fullWidth />}
                    freeSolo
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option} value={option}>
                        {option}
                      </MenuItem>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Price (in Rupees)</InputLabel>
                  <TextField placeholder="Enter Price" fullWidth type="number" value={price} onChange={handlePrice} />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MainCard>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Quantity</InputLabel>
                  <TextField
                    placeholder="Enter quantity"
                    fullWidth
                    value={quantity} // Assuming 'quantity' is a state variable
                    onChange={handleQuantity} // Adjust handler to capture input value
                    type="number" // Set input type to 'number' for quantity
                  />
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
