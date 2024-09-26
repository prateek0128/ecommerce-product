import { useState, ChangeEvent, useRef } from 'react';
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
import { FormLabel } from '@mui/material';

//api imoorts
import { addProduct, updateProduct } from 'apiServices/products';

import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { Description } from '@mui/icons-material';
import { categories } from './productCategories';
import { APP_DEFAULT_PATH } from 'config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import CategoryModal from '../../../sections/apps/category/CategoryModal';
import SubcategoryModal from  '../../../sections/apps/subcategory/SubcategoryModal';
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
const statuss = [
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
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('100');
  const [stockStatus, setStockStatus] = useState('in stock');
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Select Item');
  const [productImage, setProductImage] = useState<string | undefined>(undefined);
  const [productFile, setProductFile] = useState<File | undefined>(undefined);
  const fileInputRefProduct = useRef<HTMLInputElement | null>(null);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openSubcategoryModal, setOpenSubcategoryModal] = useState(false);
  const handleCategoryModal = () => {
    setOpenCategoryModal((prev) => !prev);
  };
  const handleSubcategoryModal = () => {
    setOpenSubcategoryModal((prev) => !prev);
  };
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
      setProductFile(file);
    }
  };
  const addProductAPI = async (event: { preventDefault: () => void }) => {
    event?.preventDefault();

    const newProductData = {
      productName: productName,
      productDescription: productDescription,
      category: selectedCategory,
      item: selectedSubcategory,
      price: price,
      quantity: quantity,
      stock: stockStatus,
      productImage: productImage
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(newProductData));
    // Only append the file if it's selected
    if (productFile) {
      console.log('addCustomerImage', productFile);
      formData.append('file', productFile);
    } else {
      console.log('No image selected, proceeding without image');
    }
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await addProduct(formData);
      openSnackbar({
        open: true,
        message: 'Product added successfully.',
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
  let breadcrumbLinks = [{ title: 'Home', to: APP_DEFAULT_PATH }, { title: 'Add Product' }];
  return (
    <>
      <Breadcrumbs custom heading="Add Product" links={breadcrumbLinks} />
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
                    <MenuItem value="" onClick={handleCategoryModal}>
                      Add Category
                    </MenuItem>
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
                    <MenuItem value="Select Item" defaultValue={'Select Item'} disabled>
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
                    <MenuItem value="" onClick={handleSubcategoryModal}>
                      Add Subcategory
                    </MenuItem>
                  </TextField>
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
                  <InputLabel sx={{ mb: 1 }}>Qty</InputLabel>
                  <TextField placeholder="Select quantity" fullWidth select value={quantity} onChange={handleQuantity}>
                    {quantities.map((option) => (
                      <MenuItem key={option.id} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                  <TextField placeholder="Select status" fullWidth select value={stockStatus} onChange={handleStockStatus}>
                    {statuss.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
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
                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={addProductAPI}>
                      Add new Product
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
      <CategoryModal open={openCategoryModal} modalToggler={setOpenCategoryModal} />
      <SubcategoryModal open={openSubcategoryModal} modalToggler={setOpenSubcategoryModal} />
    </>
  );
}
