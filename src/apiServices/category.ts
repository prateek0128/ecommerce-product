import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiUrl } from './apiUrl';

const accessToken = localStorage.getItem('serviceToken');

// Create an Axios instance with default settings
const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  }
});

export type ApiResponse<T> = AxiosResponse<T>;

//Assign Category
export const assignCategory = async <T>(data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.post('assignCategory', data, config);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
