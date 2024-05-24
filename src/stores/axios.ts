import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create an Axios instance with custom configurations
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL, // Use import.meta.env to access Vue.js environment variables
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  withXSRFToken: true
});

// Define the various request methods with typings
const getRequest = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await instance.get(url, config);
  return response.data;
};

const postRequest = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await instance.post(url, data, config);
  return response.data;
};

const putRequest = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await instance.put(url, data, config);
  return response.data;
};

const deleteRequest = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await instance.delete(url, config);
  return response.data;
};

// Export the request methods
export { getRequest, postRequest, putRequest, deleteRequest };

// Export the Axios instance for additional customization if needed
export default instance;
