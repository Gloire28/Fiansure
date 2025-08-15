import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found in localStorage for request:', config.url);
  }
  console.log('API request:', config.method, config.url, { headers: config.headers });
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('API response:', response.config.url, 'Data:', response.data);
    return response;
  },
  error => {
    console.error('API error:', error.response?.status, error.response?.data, error.config.url);
    return Promise.reject(error);
  }
);

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const createGoal = (data) => api.post('/objectifs', data);
export const getGoals = () => api.get('/objectifs');
export const getGoal = (id) => api.get(`/objectifs/${id}`);
export const addEntry = (id, data) => api.post(`/objectifs/${id}/entrees`, data);
export const updateGoalDate = (id, data) => api.put(`/objectifs/${id}`, data);
export const deleteGoal = (id) => api.delete(`/objectifs/${id}`);
export const getCorbeilleGoals = () => api.get('/objectifs/corbeille');
export const restoreGoal = (id) => api.put(`/objectifs/corbeille/${id}/restore`);
export const createAccount = (data) => api.post('/comptes', data);
export const getAccounts = () => api.get('/comptes');
export const getAccount = (id) => {
  console.log('Calling getAccount with ID:', id);
  return api.get(`/comptes/${id}`);
};
export const addMovement = (id, data) => api.post(`/comptes/${id}/mouvements`, data);
export const deleteAccount = (id) => api.delete(`/comptes/${id}`);
export const getCorbeilleAccounts = () => {
  console.log('Calling getCorbeilleAccounts');
  return api.get('/comptes/corbeille').catch(err => {
    console.error('getCorbeilleAccounts error:', err.response?.status, err.response?.data);
    throw err;
  });
};
export const restoreAccount = (id) => api.put(`/comptes/corbeille/${id}/restore`);

export default api;
