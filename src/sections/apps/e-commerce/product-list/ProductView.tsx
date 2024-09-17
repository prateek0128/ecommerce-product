// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import { useEffect, useState } from 'react';
import { getProductDetails } from 'apiServices/products';
import capitalize from '@mui/utils/capitalize';

// ==============================|| PRODUCT - VIEW ||============================== //
interface ProductData {
  Picture: any;
}
// Function to convert byte array to Base64 string
const arrayBufferToBase64 = (buffer: any) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
export default function ProductView({ data }: any) {
  const theme = useTheme();
  const [productImage, setProductImage] = useState<string | undefined>(undefined);
  console.log('ProductViewData', data);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProductDetails(data.id);
        console.log('fetchProductDetails', response.data);
        const productData = response.data as ProductData[];
        console.log('fetchProductDetails2', productData);
        // Convert the byte array to Base64 and set the product image
        const base64String = arrayBufferToBase64(productData[0].Picture);
        setProductImage(`data:image/jpeg;base64,${base64String}`);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };
    fetchProductDetails();
  }, []);
  console.log('ProductViewData2', productImage);
  return (
    <Grid container spacing={2.5} sx={{ pl: { xs: 0, sm: 5, md: 6, lg: 10, xl: 12 } }}>
      <Grid item xs={6} sm={5} md={4} lg={3}>
        <Box sx={{ position: 'relative' }}>
          <img
            // src={data.image && getImageUrl(`${data.image}`, ImagePath.ECOMMERCE)}
            src={productImage}
            alt="product"
            style={{ background: theme.palette.secondary[200], width: '100%' }}
          />
          <Chip
            label={data.stock ? 'In Stock' : 'Out of Stock'}
            color={data.stock ? 'success' : 'error'}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} md={8} lg={9}>
        <Stack spacing={1} sx={{ px: 2 }}>
          <Typography variant="h5">{data?.name}</Typography>
          <Typography color="text.secondary">{data?.description}</Typography>
          <Rating name="read-only" value={data.rating} readOnly />
          <Box sx={{ width: '80%', pt: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={4} md={3}>
                <Typography color="text.secondary">Categories</Typography>
              </Grid>
              <Grid item xs={8} md={9}>
                <Stack direction="row" spacing={0.25}>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {capitalize(data.category)} {'-'} {data.item}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={4} md={3}>
                <Typography color="text.secondary">Qty</Typography>
              </Grid>
              <Grid item xs={8} md={9}>
                <Typography variant="h6">{data?.quantity}</Typography>
              </Grid>
              <Grid item xs={4} md={3}>
                <Typography color="text.secondary">Price</Typography>
              </Grid>
              <Grid item xs={8} md={9}>
                <Typography variant="h5">{data?.price}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
