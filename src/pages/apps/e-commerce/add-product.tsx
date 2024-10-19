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
import { Autocomplete, FormLabel } from '@mui/material';

//api imoorts
import { addProduct, updateProduct } from 'apiServices/products';

import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { Description } from '@mui/icons-material';
import { categories } from './productCategories';
import { APP_DEFAULT_PATH } from 'config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import CategoryModal from '../../../sections/apps/repairParts/CategoryModal';
import SubcategoryModal from '../../../sections/apps/subcategory/SubcategoryModal';
import { getItemList, getRepairPartsList } from 'apiServices/repairParts';
import { number } from 'yup';
// constant
const stockStatusOptions = [
  {
    value: 'in stock',
    label: 'In Stock'
  },
  {
    value: 'out of stock',
    label: 'Out of Stock'
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
interface ErrorData {
  response: any;
}
interface CategoryData {
  data: any;
  message: any;
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
  const [selectedItem, seSelectedItem] = useState('Select Item');
  const [categoryId, setCategoryId] = useState(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState('Select Item');
  const [categoryForm, setCategoryForm] = useState('');
  const [productImage, setProductImage] = useState<string | undefined>(undefined);
  const [productFile, setProductFile] = useState<File | undefined>(undefined);
  const fileInputRefProduct = useRef<HTMLInputElement | null>(null);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openSubcategoryModal, setOpenSubcategoryModal] = useState(false);
  const [allItemsData, setAllItemsData] = useState<any>([]);
  const handleItemModal = () => {
    setOpenCategoryModal((prev) => !prev);
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
  const handleItemChange = (newValue: any) => {
    if (newValue) {
      seSelectedItem(newValue);
      setCategoryForm(newValue);
      //setCategoryId(newValue);
    }
    // Reset selected subcategory when category changes
    setSelectedSubcategory('');
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
  const allitems =
    allItemsData &&
    allItemsData.map((item: any, index: any) => ({
      itemName: item.Item_Name,
      itemId: item.Item_Id,
      isEnabled: item.IsEnabled
    }));
  const getAllItemsAPI = () => {
    getItemList()
      .then((response) => {
        const categoryData = response.data as CategoryData;
        setAllItemsData(categoryData.data.categories || []);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getAllItemsAPI();
  }, [categoryId]);
  const addProductAPI = async (event: { preventDefault: () => void }) => {
    event?.preventDefault();

    const newProductData = {
      productName: productName,
      productDescription: productDescription,
      category: selectedItem,
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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      openSnackbar({
        open: true,
        message: 'Product added successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      } as SnackbarProps);
      history(`/apps/e-commerce/product-list`);
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
                        if (newValue.itemId === 'new') {
                          handleItemModal();
                        } else {
                          handleItemChange(newValue);
                        }
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

                {/* <Grid item xs={12}>
                  <InputLabel sx={{ mb: 1 }}>Item</InputLabel>
                  <Autocomplete
                    value={selectedSubcategory || ''}
                    onChange={(event, newValue) => {
                      if (newValue === 'Add New Subcategory') {
                        handleSubcategoryModal();
                      } else {
                        handleSubcategoryChange(newValue);
                      }
                    }}
                    options={
                      selectedItem
                        ? ['Add New Subcategory', ...(categories.find((cat) => cat.name === selectedItem)?.subcategories || [])]
                        : []
                    } // Ensure "Add New Subcategory" is always an option
                    renderInput={(params) => <TextField {...params} placeholder="Select Item" fullWidth disabled={!selectedItem} />}
                    freeSolo
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option} value={option}>
                        {option}
                      </MenuItem>
                    )}
                  />
                </Grid> */}
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
                    {stockStatusOptions.map((option) => (
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
      {<CategoryModal open={openCategoryModal} modalToggler={setOpenCategoryModal} />}
      {categoryForm && <CategoryModal open={openSubcategoryModal} modalToggler={setOpenSubcategoryModal} selectedCategory={categoryForm} />}
    </>
  );
}
