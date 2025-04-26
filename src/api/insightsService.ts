// src/api/insightsService.ts
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Interfaces existentes (mantenerlas)
export interface PaymentBehavior {
  onTimePercentage: number;
  latePayments: number;
  earlyPayments: number;
  averageDelayDays: number;
  paymentDistribution: { category: string; count: number }[];
}

export interface ProjectAnalysis {
  projectsWithHighestOverdue: { projectName: string; overdueAmount: number; percentage: number }[];
  projectsWithLowestOverdue: { projectName: string; overdueAmount: number; percentage: number }[];
  riskAssessment: { projectName: string; riskScore: number; factors: string[] }[];
}

export interface TimeAnalysis {
  seasonalTrends: { month: string; overdueRate: number }[];
  paymentPredictions: { month: string; expectedAmount: number; predictedAmount: number }[];
}

export interface Insight {
  id: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  recommendation: string;
}

export interface InsightsResponse {
  paymentBehavior: PaymentBehavior;
  projectAnalysis: ProjectAnalysis;
  timeAnalysis: TimeAnalysis;
  insights: Insight[];
}

// Interface para segmentación de clientes
export interface CustomerSegment {
  name: string;
  color: string;
  count: number;
  totalInvestment: number;
  investmentPercentage: number;
  averagePaymentDelay: number;
  totalOverdue: number;
  overduePercentage: number;
  description: string;
}

export interface CustomerSegmentationResponse {
  segments: CustomerSegment[];
  period: string;
  metadata?: {
    timeFrame: {
      from: string;
      to: string;
    };
    totalClients: number;
    segmentDistribution: Record<string, number>;
  };
}

export const insightsService = {
  // Método existente (mantenerlo)
  getInsights: async (year?: string): Promise<InsightsResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/insights/payment-patterns`, {
        params: { year }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      
      // En caso de error, devolver datos simulados para desarrollo
      return {
        // Mantener datos de ejemplo existentes
        paymentBehavior: {
          onTimePercentage: 68,
          latePayments: 22,
          earlyPayments: 10,
          averageDelayDays: 7.3,
          paymentDistribution: [
            { category: 'A tiempo', count: 68 },
            { category: 'Con retraso', count: 22 },
            { category: 'Anticipado', count: 10 }
          ]
        },
        projectAnalysis: {
          projectsWithHighestOverdue: [
            { projectName: 'Blue Ocean', overdueAmount: 3500000, percentage: 35 },
            { projectName: 'Sunset Hills', overdueAmount: 2800000, percentage: 28 },
            { projectName: 'City Lofts', overdueAmount: 1600000, percentage: 16 }
          ],
          projectsWithLowestOverdue: [
            { projectName: 'Mountain View', overdueAmount: 900000, percentage: 9 },
            { projectName: 'Green Tower', overdueAmount: 1200000, percentage: 12 }
          ],
          riskAssessment: [
            { projectName: 'Blue Ocean', riskScore: 75, factors: ['Alta mora acumulada', 'Baja tasa de pago a tiempo'] },
            { projectName: 'Sunset Hills', riskScore: 65, factors: ['Tendencia creciente de mora'] },
            { projectName: 'City Lofts', riskScore: 45, factors: ['Mora moderada'] }
          ]
        },
        timeAnalysis: {
          seasonalTrends: [
            { month: 'Ene', overdueRate: 12 },
            { month: 'Feb', overdueRate: 15 },
            { month: 'Mar', overdueRate: 10 },
            { month: 'Abr', overdueRate: 8 },
            { month: 'May', overdueRate: 17 },
            { month: 'Jun', overdueRate: 14 },
            { month: 'Jul', overdueRate: 11 },
            { month: 'Ago', overdueRate: 12 },
            { month: 'Sep', overdueRate: 9 },
            { month: 'Oct', overdueRate: 16 },
            { month: 'Nov', overdueRate: 18 },
            { month: 'Dic', overdueRate: 22 }
          ],
          paymentPredictions: [
            { month: 'May', expectedAmount: 32000000, predictedAmount: 30500000 },
            { month: 'Jun', expectedAmount: 35000000, predictedAmount: 33200000 },
            { month: 'Jul', expectedAmount: 38000000, predictedAmount: 36800000 }
          ]
        },
        insights: [
          {
            id: 1,
            title: "Alta tasa de pagos tardíos en Blue Ocean",
            description: "El proyecto Blue Ocean muestra un 35% de mora, significativamente por encima del promedio.",
            severity: "high",
            actionable: true,
            recommendation: "Implementar recordatorios adicionales y revisar las condiciones de pago con los clientes."
          },
          {
            id: 2,
            title: "Tendencia estacional de mora en diciembre",
            description: "Se observa que la tasa de mora aumenta considerablemente en diciembre (22%).",
            severity: "medium",
            actionable: true,
            recommendation: "Planificar campañas de recordatorio anticipadas para noviembre."
          },
          {
            id: 3,
            title: "Mountain View muestra excelente comportamiento de pago",
            description: "Este proyecto tiene la menor tasa de mora (9%), indicando buenas prácticas de selección de clientes.",
            severity: "low",
            actionable: true,
            recommendation: "Estudiar el perfil de clientes de este proyecto para replicar en futuros proyectos."
          }
        ]
      };
    }
  },
  
  // Método para obtener segmentación de clientes
  getCustomerSegmentation: async (period?: string): Promise<CustomerSegmentationResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/insights/customer-segmentation`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer segmentation:', error);
      
      // En caso de error, devolver datos simulados para desarrollo
      return {
        segments: [
          { 
            name: 'Siempre puntuales', 
            color: '#4caf50',
            count: 78, 
            totalInvestment: 825000000,
            investmentPercentage: 45.8,
            averagePaymentDelay: 0,
            totalOverdue: 0,
            overduePercentage: 0,
            description: 'Clientes que pagan al menos el 90% de sus cuotas a tiempo.'
          },
          { 
            name: 'Ocasionalmente retrasados', 
            color: '#2196f3',
            count: 42, 
            totalInvestment: 542000000,
            investmentPercentage: 30.1,
            averagePaymentDelay: 5.2,
            totalOverdue: 12500000,
            overduePercentage: 8.3,
            description: 'Clientes que pagan entre el 70% y 90% de sus cuotas a tiempo.'
          },
          { 
            name: 'Frecuentemente retrasados', 
            color: '#ff9800',
            count: 23, 
            totalInvestment: 285000000,
            investmentPercentage: 15.8,
            averagePaymentDelay: 12.7,
            totalOverdue: 45800000,
            overduePercentage: 30.5,
            description: 'Clientes que pagan entre el 40% y 70% de sus cuotas a tiempo.'
          },
          { 
            name: 'Crónicamente morosos', 
            color: '#f44336',
            count: 15, 
            totalInvestment: 148000000,
            investmentPercentage: 8.3,
            averagePaymentDelay: 25.3,
            totalOverdue: 92000000,
            overduePercentage: 61.2,
            description: 'Clientes que pagan menos del 40% de sus cuotas a tiempo.'
          }
        ],
        period: period || 'year'
      };
    }
  }
};