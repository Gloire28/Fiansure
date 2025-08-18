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
  console.log('API request - method:', config.method, 'url:', config.url, 'headers:', config.headers, 'data:', config.data);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('API response - url:', response.config.url, 'status:', response.status, 'data:', response.data);
    return response;
  },
  error => {
    console.error('API error - url:', error.config.url, 'status:', error.response?.status, 'data:', error.response?.data, 'error:', error.message);
    return Promise.reject(error);
  }
);

// Authentification
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Objectifs
export const createGoal = (data) => api.post('/objectifs', data);
export const getGoals = () => api.get('/objectifs');
export const getGoal = (id) => api.get(`/objectifs/${id}`);
export const addEntry = (id, data) => api.post(`/objectifs/${id}/entrees`, data);
export const updateGoalDate = (id, data) => api.put(`/objectifs/${id}`, data);
export const deleteGoal = (id) => api.delete(`/objectifs/${id}`);
export const getCorbeilleGoals = () => api.get('/objectifs/corbeille').catch(err => { console.error('getCorbeilleGoals error:', err.response?.status, err.response?.data); throw err; });
export const restoreGoal = (id) => api.put(`/objectifs/corbeille/${id}/restore`);

// Comptes
export const createAccount = (data) => {
  const { nom, solde, assignedUserId } = data;
  if (assignedUserId && !/^[A-Z]{2}\d{4}$/.test(assignedUserId)) {
    return Promise.reject(new Error('ID d\'utilisateur invalide (format AB1234 requis)'));
  }
  console.log('Creating account with data:', { nom, solde, assignedUserId });
  return api.post('/comptes', data).catch(err => { console.error('createAccount error:', err.response?.status, err.response?.data); throw err; });
};
export const getAccounts = () => api.get('/comptes').catch(err => { console.error('getAccounts error:', err.response?.status, err.response?.data); throw err; });
export const getAccount = (id) => {
  console.log('Calling getAccount with ID:', id);
  return api.get(`/comptes/${id}`).catch(err => { console.error('getAccount error:', err.response?.status, err.response?.data); throw err; });
};
export const addMovement = (id, data) => api.post(`/comptes/${id}/mouvements`, data).catch(err => { console.error('addMovement error:', err.response?.status, err.response?.data); throw err; });
export const deleteAccount = (id) => api.delete(`/comptes/${id}`).catch(err => { console.error('deleteAccount error:', err.response?.status, err.response?.data); throw err; });
export const getCorbeilleAccounts = () => {
  console.log('Calling getCorbeilleAccounts');
  return api.get('/comptes/corbeille').catch(err => { console.error('getCorbeilleAccounts error:', err.response?.status, err.response?.data); throw err; });
};
export const restoreAccount = (id) => api.put(`/comptes/corbeille/${id}/restore`).catch(err => { console.error('restoreAccount error:', err.response?.status, err.response?.data); throw err; });

// Assignations
export const assignUser = (id, data) => {
  const { assignedUserId } = data;
  if (!/^[A-Z]{2}\d{4}$/.test(assignedUserId)) {
    return Promise.reject(new Error('ID d\'utilisateur invalide (format AB1234 requis)'));
  }
  console.log('Assigning user to account:', id, 'with data:', data);
  return api.post(`/comptes/${id}/assign`, data).catch(err => { console.error('assignUser error:', err.response?.status, err.response?.data); throw err; });
};
export const confirmAssignment = (id) => api.post(`/comptes/${id}/confirm-assign`).catch(err => { console.error('confirmAssignment error:', err.response?.status, err.response?.data); throw err; });
export const changeAssignedUser = (id, data) => {
  const { newAssignedUserId } = data;
  if (!/^[A-Z]{2}\d{4}$/.test(newAssignedUserId)) {
    return Promise.reject(new Error('Nouvel ID d\'utilisateur invalide (format AB1234 requis)'));
  }
  console.log('Changing assigned user for account:', id, 'with data:', data);
  return api.put(`/comptes/${id}/change-assign`, data).catch(err => { console.error('changeAssignedUser error:', err.response?.status, err.response?.data); throw err; });
};
export const getAccountHistory = (id) => api.get(`/comptes/${id}/history`).catch(err => { console.error('getAccountHistory error:', err.response?.status, err.response?.data); throw err; });

// Invitations
export const sendInvitation = (id, data) => {
  const { receiverId } = data;
  if (!/^[A-Z]{2}\d{4}$/.test(receiverId)) {
    return Promise.reject(new Error('ID de destinataire invalide (format AB1234 requis)'));
  }
  console.log('Sending invitation for account:', id, 'to:', receiverId);
  return api.post(`/comptes/${id}/invite`, data).catch(err => { console.error('sendInvitation error:', err.response?.status, err.response?.data); throw err; });
};
export const getPendingInvitations = () => api.get('/comptes/invitations/pending').catch(err => { console.error('getPendingInvitations error:', err.response?.status, err.response?.data); throw err; });
export const acceptInvitation = (id) => api.post(`/comptes/${id}/accept`).catch(err => { console.error('acceptInvitation error:', err.response?.status, err.response?.data); throw err; });

// Messagerie
export const sendMessage = (data) => api.post('/messages', data).catch(err => { console.error('sendMessage error:', err.response?.status, err.response?.data); throw err; });
export const getMessages = (accountId) => api.get(`/messages/${accountId}`).catch(err => { console.error('getMessages error:', err.response?.status, err.response?.data); throw err; });
export const getDiscussions = () => api.get('/messages/discussions').catch(err => { console.error('getDiscussions error:', err.response?.status, err.response?.data); throw err; });
export const markAsRead = (messageId) => api.put(`/messages/${messageId}/read`).catch(err => { console.error('markAsRead error:', err.response?.status, err.response?.data); throw err; });

export default api;