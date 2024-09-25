

import axios from 'axios';
import { appEnv } from './app-env';

export const api = axios.create({
  baseURL: appEnv.API_BASE_URL,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});


axios.interceptors.request.use( (config) => {
  return config;
}, function (error) {
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});