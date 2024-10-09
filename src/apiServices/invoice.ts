import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiUrl } from './apiUrl';

const accessToken = localStorage.getItem('serviceToken');

// Create an Axios instance with default settings
const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json'
    //Authorization: `Bearer ${accessToken}`
    // Add other headers here if needed
  }
});

const formApiClientAPI: AxiosInstance = axios.create({
  baseURL: apiUrl, // Replace with your API base URL
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
// Define common request and response types
export type ApiResponse<T> = AxiosResponse<T>;

//InvoicePreData
export const invoicePreData = async <T>(token: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await formApiClientAPI.get<T>(`invoice/invoicePreData?token=${token}`, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};

//Create Invoice
export const createInvoice = async <T>(data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.post<T>('invoice/createInvoice', data, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};

//Send Invoice
export const sendInvoice = async <T>(data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await formApiClientAPI.post<T>('sendEmail', data, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
