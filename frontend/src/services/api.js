import axios from 'axios';

// Include /api at the end since your backend routes start with /api
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://msdproject-1-sel3.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 🩺 Authentication APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// 👨‍⚕️ Doctor APIs
export const doctorsAPI = {
  getDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  getDoctorAppointments: (id) => api.get(`/doctors/${id}/appointments`),
  updateAppointmentStatus: (appointmentId, status) =>
    api.put(`/doctors/appointments/${appointmentId}`, { status }),
};

// 📅 Appointment APIs
export const appointmentsAPI = {
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  getUserAppointments: () => api.get('/appointments'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  cancelAppointment: (id) => api.delete(`/appointments/${id}`),
};

export default api;
