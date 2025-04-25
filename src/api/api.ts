import axios from 'axios';

// Definimos la URL base del API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configuración básica para axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaz para las respuestas de la API
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Servicios para el dashboard
export const dashboardService = {
  // Suscripciones activas y próximas a finalizar
  getActiveSubscriptions: async () => {
    try {
      const response = await api.get('/subscriptions/active');
      return response.data;
    } catch (error) {
      console.error('Error en getActiveSubscriptions:', error);
      throw error;
    }
  },

  // kpis del dashboard
getDashboardStats: async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error en getDashboardStats:', error);
    throw error;
  }
},

  // Dinero esperado vs real
  getExpectedVsActual: async (year?: number) => {
    try {
      const response = await api.get('/analytics/expected-vs-actual', {
        params: year ? { year } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error('Error en getExpectedVsActual:', error);
      throw error;
    }
  },

  // Mora mensual y acumulada
  getMonthlyOverdue: async (year?: number) => {
    try {
      const response = await api.get('/analytics/monthly-overdue', {
        params: year ? { year } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error('Error en getMonthlyOverdue:', error);
      throw error;
    }
  },

// Mora por proyecto
getOverdueByProject: async (year?: number) => {
  try {
    const response = await api.get('/analytics/overdue-by-project', {
      params: year ? { year } : undefined,
    });
    return response.data;
  } catch (error) {
    console.error('Error en getOverdueByProject:', error);
    throw error;
  }
},

  // Tabla de suscripciones con filtros
  getSubscriptions: async (filters?: any) => {
    try {
      const response = await api.get('/subscriptions', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Error en getSubscriptions:', error);
      throw error;
    }
  },
};

export default {
  dashboardService,
};