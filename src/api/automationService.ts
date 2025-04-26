import axios from 'axios';

// Definimos la URL base del API
const API_URL = import.meta.env.VITE_API_URL || 'dashboardloklbackend-production.up.railway.app/api';

// Configuración básica para axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interfaz para las respuestas de la API
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Interfaz para los emails enviados
interface EmailResult {
  emailsSent: number;
  previewUrls?: Array<{
    email: string;
    url: string;
  }>;
}

interface ReportResult {
  filePath: string;
  fileUrl?: string; // URL para acceder al archivo
}

// Interfaz para el historial de ejecuciones
export interface ExecutionRecord {
  id: number;
  type: 'report' | 'email' | 'table';
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

// Servicios de automatización
const automationService = {
  // Generar reporte de mora
  generateReport: async (format = 'excel'): Promise<ApiResponse<ReportResult>> => {
    try {
      const response = await api.get('/automations/generate-report', { 
        params: { format } 
      });
      return response.data;
    } catch (error) {
      console.error('Error en generateReport:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          message: error.response.data.error || 'Error al generar reporte'
        };
      }
      return { 
        success: false, 
        message: 'Error de conexión al servidor' 
      };
    }
  },
  
  // Enviar emails de cobro
  sendOverdueEmails: async (): Promise<ApiResponse<EmailResult>> => {
    try {
      const response = await api.post('/automations/send-emails');
      return response.data;
    } catch (error) {
      console.error('Error en sendOverdueEmails:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          message: error.response.data.error || 'Error al enviar emails'
        };
      }
      return { 
        success: false, 
        message: 'Error de conexión al servidor' 
      };
    }
  },
  
  // Actualizar tabla de usuarios en mora
  updateOverdueTable: async (): Promise<ApiResponse<{usersCount: number}>> => {
    try {
      const response = await api.post('/automations/update-overdue-table');
      return response.data;
    } catch (error) {
      console.error('Error en updateOverdueTable:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          message: error.response.data.error || 'Error al actualizar tabla'
        };
      }
      return { 
        success: false, 
        message: 'Error de conexión al servidor' 
      };
    }
  },

  // Obtener historial de ejecuciones
  getExecutionHistory: async (): Promise<ApiResponse<ExecutionRecord[]>> => {
    try {
      const response = await api.get('/automations/execution-history');
      return response.data;
    } catch (error) {
      console.error('Error en getExecutionHistory:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          message: error.response.data.error || 'Error al obtener historial'
        };
      }
      return { 
        success: false, 
        message: 'Error de conexión al servidor' 
      };
    }
  },

  // Configurar frecuencia de emails (opcional)
  setEmailFrequency: async (frequency: string): Promise<ApiResponse<null>> => {
    try {
      const response = await api.post('/automations/set-email-frequency', { frequency });
      return response.data;
    } catch (error) {
      console.error('Error en setEmailFrequency:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          message: error.response.data.error || 'Error al configurar frecuencia'
        };
      }
      return { 
        success: false, 
        message: 'Error de conexión al servidor' 
      };
    }
  }
};

export { automationService };