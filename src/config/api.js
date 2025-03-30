export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://anonymous-app-backend.onrender.com'
  : 'http://localhost:10000';

export const newsletterEndpoints = {
  subscribers: `${API_URL}/api/subscribers`,
  newsletter: `${API_URL}/api/newsletter`
};

export const apiConfig = {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // 5 seconds timeout
};