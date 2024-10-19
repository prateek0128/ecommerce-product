// material-ui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project import
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { updateInvoiceStatus } from 'apiServices/invoice';
// assets
import { Trash } from 'iconsax-react';
import { sendInvoice, invoicePreData, createInvoice } from 'apiServices/invoice';
import { useEffect, useState } from 'react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import ExportPDFView from 'sections/apps/invoice/export-pdf';
import { SnackbarProps } from 'types/snackbar';
import { openSnackbar } from 'api/snackbar';
import { useLocation, useNavigate } from 'react-router';
import useAuth from 'hooks/useAuth';
import { getInvoicesDetails } from '../../../apiServices/invoice';
// types
interface Props {
  invoiceId: number;
  open: boolean;
  invoiceData: any;
  handleClose: (status: boolean) => void;
}
interface InvoiceDetails {
  invoice: any;
  items: any;
}
interface InvoiceDetails {
  date: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  technicianCharges: number;
  discount: number;
  taxAmount: number;
  notes: string;
}
// ==============================|| INVOICE - PRODUCT DELETE ||============================== //

export default function UpdateInvoiceStatusPopup({ invoiceId, invoiceData, open, handleClose }: Props) {
  const [invoiceDetailsData, setInvoiceDetails] = useState<InvoiceDetails | null>(null); // or provide an initial default value
  const [invoiceItemDetails, setInvoiceItemDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, login } = useAuth();
  const history = useNavigate();
  const myDataInvoice = {
    invoiceId: 'INV-003',
    customerName: null,
    customerEmail: 'customer@example.com',
    date: '2024-10-07',
    status: 'Overdue',
    totalAmount: '160.00'
  };
  const pdfData = {
    id: 120,
    invoice_id: 'INV-20241017-0076',
    status: 'Paid',
    date: '2024-10-17T15:24:32.207Z',
    due_date: null,
    cashierInfo: {
      name: 'Maheshwari Infotech Mathura',
      address: 'Shop No.5 Usha Kiran Plaza, Dampier Nagar, Mathura',
      contact: '07409548907, 09897808544',
      email: 'maheshwariinfotechmtr@gmail.com',
      gstIn: '09BEWPM4982E1ZR'
    },
    customerInfo: {
      id: 1,
      name: 'Rahul Sen',
      address: 'Gwalior',
      contact: '9691945217',
      email: 's.ronit2812@gmail.com',
      firstName: 'Rahul',
      lastName: 'Sen'
    },
    invoice_detail: [
      {
        id: 'ebd9c79f-ae4f-4741-b31d-98199d97b518',
        name: 'Mobile',
        qty: 12,
        price: 123545
      }
    ],
    paidAmount: 0,
    serviceCharge: 0,
    discount: 0,
    gst: 0,
    notes: ''
  };
  const invoiceDetails = {
    invoice: {
      invoiceId: 'INV-00617171',
      customerId: 1,
      customerName: 'prateek',
      customerEmail: 'customer@example.com',
      customerAddress: '123 Main St, Anytown, USA',
      status: 'Unpaid',
      date: '2024-10-07T18:30:00.000Z',
      technicianCharges: '150.00',
      taxAmount: '15.00',
      discount: '5.00',
      totalAmount: '160.00',
      notes: 'Please handle with care.'
    },
    items: [
      {
        invoiceId: 'INV-00617171',
        itemName: 'Battery Replacement',
        quantity: 2,
        unitPrice: '20.00'
      },
      {
        invoiceId: 'INV-00617171',
        itemName: 'Screen Repair',
        quantity: 1,
        unitPrice: '100.00'
      }
    ]
  };
  const allItemDetails =
    invoiceItemDetails &&
    invoiceItemDetails.map((item: any, index: number) => {
      return {
        invoiceId: item.invoiceId,
        name: item.itemName,
        qty: item.quantity,
        price: item.unitPrice
      };
    });
  const invoicePDFData = {
    invoice_id: invoiceId,
    status: 'Paid',
    date: invoiceDetailsData?.date || '',
    due_date: null,
    cashierInfo: {
      name: 'Maheshwari Infotech Mathura',
      address: 'Shop No.5 Usha Kiran Plaza, Dampier Nagar, Mathura',
      contact: '07409548907, 09897808544',
      email: 'maheshwariinfotechmtr@gmail.com',
      gstIn: '09BEWPM4982E1ZR'
    },
    customerInfo: {
      id: 1,
      name: invoiceDetailsData?.customerName || '',
      address: invoiceDetailsData?.customerAddress || '',
      contact: '',
      email: invoiceDetailsData?.customerEmail || ''
      // firstName: 'Rahul',
      // lastName: 'Sen'
    },
    invoice_detail: allItemDetails,
    paidAmount: 0,
    serviceCharge: invoiceDetailsData?.technicianCharges || '',
    discount: invoiceDetailsData?.discount || '',
    gst: invoiceDetailsData?.taxAmount || '',
    notes: invoiceDetailsData?.notes || ''
  };
  const handleUpdateStatus = () => {
    updateInvoiceStatus(invoiceId)
      .then((response) => {
        handleEmailPDF();
        setTimeout(() => {
          // window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.log('errorResponse', error);
      });
    // handleClose(false);
  };
  const handleGetInvoiceDetail = () => {
    getInvoicesDetails(invoiceId)
      .then((response) => {
        const invoiceDetails = response.data as InvoiceDetails;
        setInvoiceDetails(invoiceDetails.invoice);
        setInvoiceItemDetails(invoiceDetails.items);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  useEffect(() => {
    handleGetInvoiceDetail();
  }, [invoiceId]);
  const handleEmailPDF = async () => {
    setLoading(true);
    // Generate the PDF blob
    const doc = <ExportPDFView list={invoicePDFData} />;
    const pdfBlob = await pdf(doc).toBlob(); // Convert document to blob
    // If you want to trigger download manually
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `${invoiceId}-${invoiceData.customerName}.pdf`;
    link.click();
    //setIsLoader(false);
    const date = new Date(invoiceData.date);
    const formattedDate = date.toISOString().split('T')[0];
    const emailBody = `
  Dear ${invoiceData.customerName},

  We hope this message finds you well. Please find attached the invoice for the services provided in the month of  ${formattedDate}.

  If you have any questions regarding this invoice, please feel free to reach out.

  Thank you for using our services.

  Best regards,
  Maheshwari Infotech
`;
    const formData = new FormData();
    formData.append('attachment', pdfBlob, `${invoiceId}-${invoiceData.customerName}.pdf`);
    formData.append('to', invoiceData.customerEmail);
    //formData.append('to', 's.ronit2812@gmail.com');
    formData.append('subject', `Invoice ${invoiceId} from Maheshwari Infotech`);
    formData.append('text', emailBody);
    sendInvoice(formData)
      .then((response) => {
        setLoading(false);
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
    handleClose(false);
  };
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      TransitionComponent={PopupTransition}
      keepMounted
      maxWidth="xs"
      aria-labelledby="item-delete-title"
      aria-describedby="item-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to update status to paid?
            </Typography>
            <Typography align="center">
              By updating the status of
              <Typography variant="subtitle1" component="span">
                &quot;{invoiceId}&quot;
              </Typography>
              , its payment will also be reflected in the invoice.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={handleUpdateStatus} autoFocus>
              Update
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
