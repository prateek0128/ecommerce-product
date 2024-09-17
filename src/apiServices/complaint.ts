import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiUrl } from './apiUrl';

const accessToken = localStorage.getItem('serviceToken');

// Create an Axios instance with default settings
const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
    // Add other headers here if needed
  }
});
const formApiClient: AxiosInstance = axios.create({
  baseURL: apiUrl, // Replace with your API base URL
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${accessToken}`
    // Add other headers here if needed
  }
});
// Define common request and response types
export type ApiResponse<T> = AxiosResponse<T>;

// Add New Complaint
export const raiseComplaint = async <T>(data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await formApiClient.post<T>('complaint/raiseComplaint', data, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    console.log('Error', error);
    throw error;
  }
};
//Update Complaint
export const updateComplaint = async <T>(data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.put<T>('complaint/editComplaint', data, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
//Get All Complaints
export const getAllComplaints = async <T>(config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.get<T>('complaint/allComplaint', config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
//Delete Complaint
export const deleteComplaint = async <T>(id: number, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.delete<T>(`complaint/deleteComplaint?id=${id}`, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
// Add Assign Technician
export const assignTechnician = async <T>(data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.post<T>('assignTechnician', data, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    console.log('Error', error);
    throw error;
  }
};
//Get Complaints Details
export const getComplaintDetails = async <T>(id: number, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.get<T>(`complaint/complaintDetails?id=${id}`, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
