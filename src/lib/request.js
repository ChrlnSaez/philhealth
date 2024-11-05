import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:8000/api',
});

const errorHandler = (err) => {
  if (!err) return;

  return err.response?.data || err;
};

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

request.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(errorHandler(error))
);

export const attachToken = () => {
  const token = localStorage.getItem('token');
  request.defaults.headers.common = {
    Authorization: `Bearer ${token}`,
  };
};

export const detachToken = () => {
  delete request.defaults.headers.common.Authorization;
};

export default request;
