import { useLocation, useNavigate } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TableContainer from '@mui/material/TableContainer';
import FormHelperText from '@mui/material/FormHelperText';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import * as yup from 'yup';
import { v4 as UIDV4 } from 'uuid';
import { format } from 'date-fns';
import { FieldArray, Form, Formik } from 'formik';

// project-imports
import MainCard from 'components/MainCard';
import CircularLoader from 'components/CircularLoader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import InvoiceItem from 'sections/apps/invoice/InvoiceItem';
import AddressModal from 'sections/apps/invoice/AddressModal';
import InvoiceModal from 'sections/apps/invoice/InvoiceModal';

import incrementer from 'utils/incrementer';
import { openSnackbar } from 'api/snackbar';
import {
  handlerCustomerTo,
  handlerCustomerFrom,
  handlerPreview,
  insertInvoice,
  selectCountry,
  useGetInvoice,
  useGetInvoiceMaster
} from 'api/invoice';
import { APP_DEFAULT_PATH } from 'config';

// assets
import { Add, Edit } from 'iconsax-react';

// types
import { SnackbarProps } from 'types/snackbar';
import { CountryType, InvoiceList, InvoiceProps } from 'types/invoice';
import { ChangeEvent, useEffect, useState } from 'react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import ExportPDFView from 'sections/apps/invoice/export-pdf';
import LoadingButton from 'components/@extended/LoadingButton';
import { sendInvoice, invoicePreData, createInvoice } from 'apiServices/invoice';
import { getComplaintDetails } from 'apiServices/complaint';
import useAuth from 'hooks/useAuth';
import CircularProgress from '@mui/material/CircularProgress';
const validationSchema = yup.object({
  date: yup.date().required('Invoice date is required'),
  due_date: yup
    .date()
    .when('date', (date, schema) => date && schema.min(date, "Due date can't be before invoice date"))
    .nullable()
    .required('Due date is required'),
  customerInfo: yup
    .object({
      name: yup.string().required('Invoice receiver information is required')
    })
    .required('Invoice receiver information is required'),
  status: yup.string().required('Status selection is required'),
  invoice_detail: yup
    .array()
    .required('Invoice details is required')
    .of(
      yup.object().shape({
        name: yup.string().required('Product name is required')
      })
    )
    .min(1, 'Invoice must have at least 1 items')
});

interface FormProps {
  lists: InvoiceList[];
  invoiceMaster: InvoiceProps;
}
interface ComplaintData {
  message: string;
  ComplaintDetails: any;
  // Add other properties that exist in the response data
}
interface ComplaintResolvedData {
  PreData: any;
  message: any;
}
// Define the type for repair part
interface RepairPart {
  part: string;
  quantity: number;
}
interface InvoiceResponse {
  message: string;
  invoiceId: string;
  error: string;
}
interface ErrorData {
  response: any;
}
// ==============================|| INVOICE - CREATE ||============================== //

function CreateForm({ lists, invoiceMaster }: FormProps) {
  const theme = useTheme();
  const navigation = useNavigate();
  const notesLimit: number = 500;
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const handlerCreate = (values: any) => {
    const newList: InvoiceList = {
      id: Number(incrementer(lists.length)),
      invoice_id: values.invoice_id,
      customer_name: values.cashierInfo?.name,
      email: values.cashierInfo?.email,
      avatar: Number(Math.round(Math.random() * 10)),
      discount: Number(values.discount),
      serviceCharge: Number(values.serviceCharge),
      balance: Number(values.balance),
      gst: Number(values.gst),
      date: format(new Date(values.date), 'MM/dd/yyyy'),
      due_date: format(new Date(values.due_date), 'MM/dd/yyyy'),
      quantity: Number(
        values.invoice_detail?.reduce((sum: any, i: any) => {
          return sum + i.qty;
        }, 0)
      ),
      status: values.status,
      cashierInfo: values.cashierInfo,
      customerInfo: values.customerInfo,
      invoice_detail: values.invoice_detail,
      notes: values.notes
    };

    insertInvoice(newList);
    openSnackbar({
      open: true,
      message: 'Invoice Added successfully',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      variant: 'alert',
      alert: {
        color: 'success'
      }
    } as SnackbarProps);
    navigation('/apps/invoice/list');
  };
  // Function to generate a random sequential number
  const generateRandomNumber = () => {
    // Generate a random number between 1 and 9999, padded to 4 digits
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a number from 1000 to 9999
    return randomNumber.toString();
  };
  // Function to generate sequential number
  const generateSequentialNumber = () => {
    const lastNumber = localStorage.getItem('lastInvoiceNumber');
    let newNumber = lastNumber ? parseInt(lastNumber, 10) + 1 : 1; // Start from 0001 if no previous number
    localStorage.setItem('lastInvoiceNumber', newNumber.toString().padStart(4, '0')); // Save the new number
    return newNumber.toString().padStart(4, '0'); // Ensure the number is 4 digits, e.g., 0001
  };
  // Function to generate sequential invoice ID
  const generateInvoiceId = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2 digits for the month
    const day = currentDate.getDate().toString().padStart(2, '0');
    const datePart = `${year}${month}${day}`; // YYYYMM format

    // Generate a new random sequential number
    //const sequentialNumber = generateRandomNumber();
    const sequentialNumber = generateSequentialNumber();
    // Construct the invoice ID
    return `INV-${datePart}-${sequentialNumber}`;
  };
  // Generate the invoice ID when the component mounts
  useEffect(() => {
    // Check if an invoice ID is already stored
    const storedInvoiceId = localStorage.getItem('currentInvoiceId');

    if (!storedInvoiceId) {
      // If no invoice ID exists, generate a new one and store it
      const newInvoiceId = generateInvoiceId();
      setInvoiceId(newInvoiceId);
      localStorage.setItem('currentInvoiceId', newInvoiceId);
    } else {
      // If an invoice ID exists, use it
      setInvoiceId(storedInvoiceId);
    }
  }, []);

  return (
    <>
      {/* {loading ? (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%', // Take full viewport height
              p: 2
            }}
          >
            <CircularProgress size={40} />
          </Box>
        </>
      ) : ( */}
      <Formik
        initialValues={{
          id: 120,
          invoice_id: invoiceId,
          status: '',
          date: new Date(),
          due_date: null,
          cashierInfo: {
            name: 'Maheshwari Infotech Mathura',
            address: 'Shop No.5 Usha Kiran Plaza, Dampier Nagar, Mathura',
            contact: '07409548907, 09897808544',
            email: 'maheshwariinfotechmtr@gmail.com',
            gstIn: '09BEWPM4982E1ZR'
          },
          customerInfo: {
            id: 0,
            address: '',
            email: '',
            name: '',
            contact: ''
          },
          invoice_detail: [
            {
              id: UIDV4(),
              name: '',
              // description: '',
              qty: 0,
              price: '0.00'
            }
          ],
          paidAmount: 0,
          serviceCharge: 0,
          discount: 0,
          gst: 0,
          notes: ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          // handlerCreate(values);
        }}
      >
        {({ handleBlur, errors, handleChange, handleSubmit, values, isValid, setFieldValue, touched }) => {
          const subtotal = values?.invoice_detail.reduce((prev, curr: any) => {
            // Ensure curr.name is defined before calling .trim()
            if (curr?.name && curr.name.length > 0) {
              return prev + Number(curr.price * Math.floor(curr.qty));
            } else {
              return prev;
            }
          }, 0);
          const taxRate = (values.gst * subtotal) / 100;
          const discountRate = (values.discount * subtotal) / 100;
          const total = subtotal - discountRate + taxRate + values.serviceCharge;
          const balance = total - values.paidAmount;
          const [complaintId, setComplaintId] = useState<number>();
          const [customerId, setCustomerId] = useState<number>();
          const [customerEmail, setCustomerEmail] = useState<string>('');
          const [customerAddress, setCustomerAddress] = useState<string>('');
          const [customerName, setCustomerName] = useState('');
          const [repairParts, setRepairParts] = useState<RepairPart[]>([]);
          const [priceNew, setPrice] = useState(0);
          const { isLoggedIn, login } = useAuth();
          const query = new URLSearchParams(useLocation().search);
          const myToken = query.get('token');
          const location = useLocation();
          const history = useNavigate();
          // Set invoice_id in Formik after invoiceId is generated
          useEffect(() => {
            if (invoiceId) {
              setFieldValue('invoice_id', invoiceId);
            }
          }, [invoiceId, setFieldValue]); // Trigger only when invoiceId is set
          const handleEmailPDF = async () => {
            setLoading(true);
            // Remove the currentInvoiceId from localStorage
            localStorage.removeItem('currentInvoiceId');
            // Generate the PDF blob
            const doc = <ExportPDFView list={values} />;
            const pdfBlob = await pdf(doc).toBlob(); // Convert document to blob
            // If you want to trigger download manually
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = `${values?.invoice_id}-${values?.customerInfo.name}.pdf`;
            link.click();
            //setIsLoader(false);
            const date = new Date(values?.date);
            const formattedDate = date.toISOString().split('T')[0];
            const emailBody = `
          Dear ${values?.customerInfo.name || customerName},
      
          We hope this message finds you well. Please find attached the invoice for the services provided in the month of  ${formattedDate}.
      
          If you have any questions regarding this invoice, please feel free to reach out.
      
          Thank you for using our services.
      
          Best regards,
          Maheshwari Infotech
        `;
            const formData = new FormData();
            formData.append('attachment', pdfBlob, `${values?.invoice_id}-${values?.customerInfo.name || customerName}.pdf`);
            formData.append('to', values?.customerInfo.email || customerEmail);
            //formData.append('to', 's.ronit2812@gmail.com');
            formData.append('subject', `Invoice ${values?.invoice_id} from Maheshwari Infotech`);
            formData.append('text', emailBody);
            sendInvoice(formData)
              .then((response) => {
                setLoading(false);
                //This console is being used by Customer View in Flutter.
                console.log('emailResponse', response.data);
                openSnackbar({
                  open: true,
                  message: response.data,
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  }
                } as SnackbarProps);
                if (isLoggedIn) {
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                  history('/apps/invoice/list');
                }
              })
              .catch((error) => {
                console.log('responsePDF', error);
              });
          };
          const openInvoiceForm = () => {
            // Check if the user is on a mobile device
            const isMobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i);
            if (isMobile) {
              window.open(`https://maheshwariinfotech.netlify.app/create-invoice`, '_blank');
            } else {
              //alert('This link is best viewed on a mobile device.');
            }
          };
          const fetchComplaintResolvedDetails = () => {
            const accessToken = 8388;
            //invoicePreData(accessToken)
            invoicePreData(myToken)
              .then((response) => {
                const complaintResolvedDetails = response.data as ComplaintResolvedData;
                const complaintId = complaintResolvedDetails.PreData.Complaint_id;
                const repairParts = complaintResolvedDetails.PreData.Repair_parts;
                // Map repairParts to invoice_detail and set it in Formik
                const updatedInvoiceDetail = repairParts.map((part: any) => ({
                  id: UIDV4(),
                  name: part.part, // Assuming partName is the relevant field from repairParts
                  qty: part.quantity,
                  price: part.price || '0.00'
                }));
                setFieldValue('invoice_detail', updatedInvoiceDetail); // Update invoice_detail in Formik
                setComplaintId(complaintId);
                setRepairParts(repairParts);
                fetchComplaintDetails(complaintId);
              })
              .catch((error) => {
                console.log('complaintError', error);
              });
          };
          useEffect(() => {
            fetchComplaintResolvedDetails();
            openInvoiceForm();
          }, []);
          const fetchComplaintDetails = async (complaintId: any) => {
            try {
              const response = await getComplaintDetails(complaintId);
              const complaintData = response.data as ComplaintData; // Cast to expected type
              const complaintDetails = complaintData.ComplaintDetails[0];
              const customerDetails = complaintData.ComplaintDetails[0].Customer_Details[0];
              setFieldValue('customerInfo.name', customerDetails.First_Name + ' ' + customerDetails.Last_Name);
              setFieldValue('customerInfo.email', customerDetails.Email);
              setFieldValue('customerInfo.contact', customerDetails.Contact);
              setFieldValue('customerInfo.address', customerDetails.Location);
              setCustomerId(customerDetails.Id);
              setCustomerEmail(customerDetails.Email);
              setCustomerAddress(customerDetails.Location);
              setCustomerName(customerDetails.First_Name + ' ' + customerDetails.Last_Name);
            } catch (error) {
              console.error('Error fetching technicians:', error);
            }
          };
          const handleCreateInvoice = () => {
            const date = new Date(values?.date);
            const formattedDate = date.toISOString().split('T')[0];
            const invoiceDetails = {
              invoiceId: values?.invoice_id,
              customerId: values?.customerInfo.id || customerId,
              customerName: values?.customerInfo.name || customerName,
              customerEmail: values?.customerInfo.email || customerEmail,
              customerAddress: values?.customerInfo.address || customerAddress,
              status: values?.status,
              date: formattedDate,
              technicianCharges: values?.serviceCharge,
              taxAmount: values?.gst,
              discount: values?.discount,
              totalAmount: total,
              notes: 'Invoice Details'
            };
            const itemDetails = values?.invoice_detail.map((details, index) => {
              return {
                invoiceId: values?.invoice_id,
                itemName: details.name,
                quantity: details.qty,
                unitPrice: details.price
              };
            });
            const createInvoiceData = {
              invoice: invoiceDetails,
              items: itemDetails
            };
            createInvoice(createInvoiceData)
              .then((response) => {
                const createInvoiceResponse = response.data as InvoiceResponse;
                if (isLoggedIn) {
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                  history('/apps/invoice/list');
                }
              })
              .catch((error) => {
                const errorData = error as ErrorData;
                openSnackbar({
                  open: true,
                  message: errorData.response.data.error,
                  variant: 'alert',
                  alert: {
                    color: 'error'
                  }
                } as SnackbarProps);
              });
          };
          return (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {isLoggedIn && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box color="grey.200">
                      <Button
                        size="small"
                        startIcon={<Add />}
                        color="primary"
                        variant="contained"
                        // onClick={() => handlerCustomerTo(true)}
                        sx={{ height: '46px', width: '100%', mt: '28px' }} // Adjust height as needed
                        onClick={() => setShowAddressModal(true)}
                      >
                        Add Customer
                      </Button>
                      <AddressModal
                        open={showAddressModal}
                        setOpen={(value) => setShowAddressModal(value as boolean)}
                        handlerAddress={(value) => setFieldValue('customerInfo', value)}
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Invoice Id</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <TextField
                        required
                        disabled
                        type="text"
                        name="invoice_id"
                        id="invoice_id"
                        value={values.invoice_id}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Stack spacing={1}>
                    <InputLabel>Status</InputLabel>
                    <FormControl sx={{ width: '100%' }}>
                      <Select
                        value={values.status}
                        displayEmpty
                        name="status"
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <Box sx={{ color: 'secondary.400' }}>Select status</Box>;
                          }
                          return selected;
                          // return selected.join(', ');
                        }}
                        onChange={handleChange}
                        error={Boolean(errors.status && touched.status)}
                      >
                        <MenuItem disabled value="">
                          Select status
                        </MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="PartialPaid">Partial Paid</MenuItem>
                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  {touched.status && errors.status && <FormHelperText error={true}>{errors.status}</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={6} md={3} sx={{ ml: 'auto' }}>
                  <Stack spacing={1}>
                    <InputLabel>Date</InputLabel>
                    <FormControl sx={{ width: '100%' }} error={Boolean(touched.date && errors.date)}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker format="dd/MM/yyyy" value={values.date} onChange={(newValue) => setFieldValue('date', newValue)} />
                      </LocalizationProvider>
                    </FormControl>
                  </Stack>
                  {touched.date && errors.date && <FormHelperText error={true}>{errors.date as string}</FormHelperText>}
                </Grid>
                <>
                  {/* <Grid item xs={12} sm={6} md={3}>
                <Stack spacing={1}>
                  <InputLabel>Due Date</InputLabel>
                  <FormControl sx={{ width: '100%' }} error={Boolean(touched.due_date && errors.due_date)}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        format="dd/MM/yyyy"
                        value={values.due_date}
                        onChange={(newValue) => setFieldValue('due_date', newValue)}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Stack>
                {touched.due_date && errors.due_date && <FormHelperText error={true}>{errors.due_date as string}</FormHelperText>}
              </Grid> */}
                </>
                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 168 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Stack spacing={2}>
                          <Typography variant="h5">From:</Typography>
                          <Stack sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{values?.cashierInfo?.name}</Typography>
                            <Typography color="secondary">{values?.cashierInfo?.address}</Typography>
                            <Typography color="secondary">{values?.cashierInfo?.contact}</Typography>
                            <Typography color="secondary">{values?.cashierInfo?.email}</Typography>
                            <Typography color="secondary">GSTIN: {values?.cashierInfo.gstIn}</Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign={{ xs: 'left', sm: 'right' }} color="secondary.200">
                          <Button
                            variant="outlined"
                            startIcon={<Edit />}
                            color="secondary"
                            onClick={() => handlerCustomerFrom(true)}
                            size="small"
                          >
                            Change
                          </Button>
                          <AddressModal
                            open={invoiceMaster.open}
                            setOpen={(value) => handlerCustomerFrom(value as boolean)}
                            handlerAddress={(address) => setFieldValue('cashierInfo', address)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MainCard sx={{ minHeight: 168 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={7}>
                        <Stack spacing={2}>
                          <Typography variant="h5">To:</Typography>
                          <Stack sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{values?.customerInfo?.name}</Typography>
                            <Typography color="secondary">{values?.customerInfo?.address}</Typography>
                            <Typography color="secondary">{values?.customerInfo?.contact}</Typography>
                            <Typography color="secondary">{values?.customerInfo?.email}</Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <Box textAlign="right" color="grey.200" sx={{ display: 'flex', justifyContent: !isLoggedIn ? 'left' : 'right' }}>
                          <Button
                            size="small"
                            startIcon={<Add />}
                            color="secondary"
                            variant="outlined"
                            // onClick={() => handlerCustomerTo(true)}
                            onClick={() => setShowAddressModal(true)}
                          >
                            Add Customer
                          </Button>
                          <AddressModal
                            open={showAddressModal}
                            setOpen={(value) => setShowAddressModal(value as boolean)}
                            handlerAddress={(value) => setFieldValue('customerInfo', value)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </MainCard>
                  {touched.customerInfo && errors.customerInfo && (
                    <FormHelperText error={true}>{errors?.customerInfo?.name as string}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5">Detail</Typography>
                </Grid>
                <Grid item xs={12}>
                  <FieldArray
                    name="invoice_detail"
                    render={({ remove, push }) => {
                      return (
                        <>
                          <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell>#</TableCell>
                                  <TableCell>Name</TableCell>
                                  {/* <TableCell>Description</TableCell> */}
                                  <TableCell>Quantity</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell align="right">Amount</TableCell>
                                  <TableCell align="center">Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {values.invoice_detail?.map((item: any, index: number) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{values.invoice_detail.indexOf(item) + 1}</TableCell>
                                    <InvoiceItem
                                      key={item.id}
                                      id={item.id}
                                      index={index}
                                      name={item.name}
                                      // description={item.description}
                                      qty={item.qty}
                                      price={item.price}
                                      onDeleteItem={(index: number) => remove(index)}
                                      onEditItem={handleChange}
                                      Blur={handleBlur}
                                      errors={errors}
                                      touched={touched}
                                    />
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Divider />
                          {touched.invoice_detail && errors.invoice_detail && !Array.isArray(errors?.invoice_detail) && (
                            <Stack direction="row" justifyContent="center" sx={{ p: 1.5 }}>
                              <FormHelperText error={true}>{errors.invoice_detail as string}</FormHelperText>
                            </Stack>
                          )}
                          <Grid container justifyContent="space-between">
                            <Grid item xs={12} md={4}>
                              <Box sx={{ pt: 2.5, pr: 2.5, pb: 2.5, pl: 0 }}>
                                <Button
                                  color="primary"
                                  startIcon={<Add />}
                                  onClick={() =>
                                    push({
                                      id: UIDV4(),
                                      name: '',
                                      description: '',
                                      qty: 0,
                                      price: '0.00'
                                    })
                                  }
                                  variant="dashed"
                                  sx={{ bgcolor: 'transparent !important' }}
                                >
                                  Add Item
                                </Button>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Grid container spacing={2} sx={{ pt: 2.5, pb: 2.5 }} justifyContent={'right'}>
                                {values.status == 'PartialPaid' && (
                                  <Grid item xs={3}>
                                    <Stack spacing={1}>
                                      <InputLabel>Paid Amount(₹)</InputLabel>
                                      <TextField
                                        type="number"
                                        fullWidth
                                        name="paidAmount"
                                        id="paidAmount"
                                        placeholder="0.00"
                                        value={values.paidAmount > 0 && values.paidAmount}
                                        onChange={handleChange}
                                        inputProps={{
                                          min: 0
                                        }}
                                      />
                                    </Stack>
                                  </Grid>
                                )}
                                <Grid item xs={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>Service Charge(₹)</InputLabel>
                                    <TextField
                                      type="number"
                                      fullWidth
                                      name="serviceCharge"
                                      id="serviceCharge"
                                      placeholder="0.00"
                                      value={values.serviceCharge > 0 && values.serviceCharge}
                                      onChange={handleChange}
                                      inputProps={{
                                        min: 0
                                      }}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid item xs={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>Discount(%)</InputLabel>
                                    <TextField
                                      type="number"
                                      fullWidth
                                      name="discount"
                                      id="discount"
                                      placeholder="0.00"
                                      value={values.discount > 0 && values.discount}
                                      onChange={handleChange}
                                      inputProps={{
                                        min: 0
                                      }}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid item xs={3}>
                                  <Stack spacing={1}>
                                    <InputLabel>GST(%)</InputLabel>
                                    <TextField
                                      type="number"
                                      fullWidth
                                      name="gst"
                                      id="gst"
                                      placeholder="0.00"
                                      value={values.gst > 0 && values.gst}
                                      onChange={handleChange}
                                      inputProps={{
                                        min: 0
                                      }}
                                    />
                                  </Stack>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'right' }}>
                              <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between" spacing={20}>
                                  <Typography color={theme.palette.secondary.main}>Sub Total:</Typography>
                                  <Typography>
                                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.secondary.main}>Discount:</Typography>
                                  <Typography variant="h6" color="success.main">
                                    ₹{discountRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.secondary.main}>Service Charge:</Typography>
                                  <Typography>
                                    ₹
                                    {values.serviceCharge
                                      ? values.serviceCharge.toLocaleString('en-IN', {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2
                                        })
                                      : '0.00'}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography color={theme.palette.secondary.main}>GST:</Typography>
                                  <Typography>
                                    ₹{taxRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </Typography>
                                </Stack>
                                {values.status == 'PartialPaid' && (
                                  <Stack direction="row" justifyContent="space-between">
                                    <Typography color={theme.palette.secondary.main}>Balance:</Typography>
                                    <Typography>
                                      ₹
                                      {balance % 1 == 0
                                        ? balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Typography>
                                  </Stack>
                                )}
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="subtitle1">Grand Total:</Typography>
                                  <Typography variant="subtitle1">
                                    ₹
                                    {total % 1 === 0
                                      ? total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                      : total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Grid>
                          </Grid>
                        </>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ ml: 'auto' }}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2} sx={{ height: '100%' }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled={
                        values.status == '' ||
                        values.date == null ||
                        values.cashierInfo.address == '' ||
                        values.customerInfo.address == '' ||
                        values.invoice_detail[0].name == ''
                      }
                      sx={{ color: 'secondary.dark' }}
                      onClick={() => handlerPreview(true)}
                    >
                      Preview
                    </Button>
                    <Button variant="outlined" color="secondary" sx={{ color: 'secondary.dark' }}>
                      Save
                    </Button>
                    <LoadingButton
                      loading={loading}
                      color="primary"
                      variant="contained"
                      loadingPosition="center"
                      sx={{ color: 'secondary.lighter' }}
                      disabled={
                        values.status == '' ||
                        values.date == null ||
                        values.cashierInfo.address == '' ||
                        values.customerInfo.address == '' ||
                        values.invoice_detail[0].name == '' ||
                        values.invoice_detail[0].qty == 0 ||
                        values.invoice_detail[0].price == ''
                      }
                      onClick={() => {
                        values.status == 'Paid' ? handleEmailPDF() : handleCreateInvoice();
                      }}
                      //onClick={handleCreateInvoice}
                    >
                      Create & Send
                    </LoadingButton>
                    <InvoiceModal
                      isOpen={invoiceMaster.isOpen}
                      setIsOpen={(value: any) => handlerPreview(value)}
                      key={values.invoice_id}
                      invoiceInfo={{
                        ...values,
                        subtotal,
                        taxRate,
                        discountRate,
                        total
                      }}
                      items={values?.invoice_detail}
                      onAddNextInvoice={() => handlerPreview(false)}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
      {/* )} */}
    </>
  );
}

// ==============================|| INVOICE - CREATE ||============================== //

export default function Create() {
  const { invoice } = useGetInvoice();
  const { invoiceMasterLoading, invoiceMaster } = useGetInvoiceMaster();

  const isLoader = invoiceMasterLoading || invoiceMaster === undefined;
  const loader = (
    <Box sx={{ height: 'calc(100vh - 310px)' }}>
      <CircularLoader />
    </Box>
  );

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Invoice', to: '/apps/invoice/dashboard' },
    { title: 'Create Invoice' }
  ];

  return (
    <>
      <Breadcrumbs custom heading="New Invoice" links={breadcrumbLinks} sx={{ padding: '24px 24px 0 24px' }} />
      <MainCard>{isLoader ? loader : <CreateForm {...{ lists: invoice, invoiceMaster }} />}</MainCard>
    </>
  );
}
