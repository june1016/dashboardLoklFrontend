// src/pages/AnalyticsPage.tsx
import { Box, Typography, Paper, CircularProgress, Alert, useTheme } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import { useDataFetching } from '../hooks/useDataFetching';
import { insightsService, CustomerSegmentationResponse } from '../api/insightsService';
import CustomerSegmentationChart from '../components/insights/CustomerSegmentationChart';

export default function AnalyticsPage() {
  const theme = useTheme();
  // Usar periodo fijo (último año)
  const period = 'year';
  
  // Obtener datos de segmentación de clientes
  const { 
    data: segmentationData, 
    loading: segmentationLoading, 
    error: segmentationError 
  } = useDataFetching<CustomerSegmentationResponse>({
    initialData: {
      segments: [],
      period: period
    },
    fetchFn: () => insightsService.getCustomerSegmentation(period),
    dependencies: [] // Solo cargar una vez al inicio
  });

  return (
    <DashboardLayout>
      <Box sx={{ mt: 14, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Centro de Insights de Negocio
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Análisis avanzado e insights accionables para optimizar la gestión de suscripciones
        </Typography>
      </Box>

      {/* Mostrar errores si ocurren */}
      {segmentationError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los datos: {segmentationError.message}
        </Alert>
      )}

      {/* Segmentación de clientes */}
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Segmentación de Clientes por Comportamiento de Pago
            </Typography>
            
            <Alert severity="info" sx={{ py: 0 }}>
              Datos basados en el último año
            </Alert>
          </Box>

          {segmentationLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <CustomerSegmentationChart 
              segments={segmentationData.segments} 
              period={segmentationData.period}
            />
          )}
        </Paper>
      </Box>
    </DashboardLayout>
  );
}