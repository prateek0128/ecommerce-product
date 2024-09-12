import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiUrl } from './apiUrl';

// Create an Axios instance with default settings
const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json'
    // Add other headers here if needed
  }
});

// Define common request and response types
export type ApiResponse<T> = AxiosResponse<T>;

// Login User
export const loginUser = async <T>(loginData: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.post<T>('user/login', loginData, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    console.log('Error', error);
    throw error;
  }
};
// Register User
export const registerUser = async <T>(registerData: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.post<T>('user/register', registerData, config);
    return response;
  } catch (error) {
    // Handle error (e.g., log it, show notification, etc.)
    console.log('Error', error);
    throw error;
  }
};
