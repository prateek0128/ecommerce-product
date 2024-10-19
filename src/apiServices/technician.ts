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

// Add New Teechnicain
export const addTechnician = async <T>(data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await formApiClient.post<T>('technician/newTechnician', data, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
//Update Technician
export const updateTechnician = async <T>(data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.put<T>('technician/updateTechnician', data, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
//Get All Technicians
export const getAllTechnicians = async <T>(config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.get<T>('technician/allTechnician', config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
//Delete Technician
export const deleteTechnician = async <T>(id: number, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.delete<T>(`technician/deleteTechnician?id=${id}`, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
//Get Technician Details
export const getTechnicianDetails = async <T>(id: number, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.get<T>(`technician/technicianDetails?id=${id}`, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};

//Get Technician Details
export const getAssignedComplaints = async <T>(id: number, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.get<T>(`technician/complaintsAssigned?id=${id}`, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    throw error;
  }
};
