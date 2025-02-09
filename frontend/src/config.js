//export const API_BASE_URL = "http://127.0.0.1:8000/api";  // Adjust if needed

import axios from 'axios';

// Set the base URL for your API
const API_BASE_URL = REACT_APP_API_BASE_URL; // Replace with your actual API base URL

// Set the default headers for all axios requests
axios.defaults.baseURL = API_BASE_URL;

// Function to set the authorization header with the token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export { setAuthToken, API_BASE_URL };