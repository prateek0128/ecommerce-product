// ==============================|| TYPES - INVOICE ||============================== //

export interface InfoType {
  name: string;
  address: string;
  contact: string;
  email: string;
  gstIn: string;
}

export interface CountryType {
  code: string;
  label: string;
  currency: string;
  prefix: string;
}

export interface Items {
  id: string | number;
  name: string;
  description: string;
  qty: number;
  price: string | number;
}

export interface InvoiceProps {
  isOpen: boolean;
  isCustomerOpen: boolean;
  open: boolean;
  country: CountryType | null;
  countries: CountryType[];
  alertPopup: boolean;
}

export interface InvoiceList {
  id: number;
  invoice_id: string;
  customer_name: string;
  email: string;
  avatar: number;
  date: Date | string | number;
  due_date: Date | string | number;
  quantity: number;
  status: string;
  invoice_detail: Items[];
  cashierInfo: InfoType;
  discount: number | null;
  serviceCharge: number;
  gst: number | null;
  customerInfo: InfoType;
  notes: string;
  balance: number;
}

export interface InvoiceDetail {
  id: number | string;
  name: string;
  qty: number;
  description: string;
  price: number;
}
