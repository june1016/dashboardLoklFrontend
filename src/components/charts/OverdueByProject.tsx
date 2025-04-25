import { useEffect, useState } from 'react';
import { Box, useTheme, CircularProgress, Alert, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { dashboardService } from '../../api/api';
import { useDataFetching } from '../../hooks/useDataFetching';

interface ProjectOverdue {
  name: string;
  amount: number;
  percentage: number;
}

export default function OverdueByProject() {
  const theme = useTheme();
  const [chartData, setChartData] = useState<ProjectOverdue[]>([]);

  // Usar el hook para obtener datos reales de la API
  const { data, loading, error } = useDataFetching<ProjectOverdue[]>({
    initialData: [],
    fetchFn: dashboardService.getOverdueByProject,
    dependencies: []
  });

  // Procesar datos cuando cambian
  useEffect(() => {
    if (data && data.length > 0) {
      // Los datos ya vienen ordenados del backend, pero por si acaso
      const sortedData = [...data].sort((a, b) => b.amount - a.amount);
      setChartData(sortedData);
    }
  }, [data]);

  // Función para formatear montos en el tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Box sx={{ fontWeight: 600, mb: 0.5 }}>
            {payload[0].payload.name}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box>
              <span style={{ fontWeight: 600 }}>Monto en mora: </span>
              <span>{formatCurrency(payload[0].value)}</span>
            </Box>
            <Box>
              <span style={{ fontWeight: 600 }}>Porcentaje del total: </span>
              <span>{payload[0].payload.percentage}%</span>
            </Box>
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <Box sx={{ height: 350, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar datos de mora por proyecto: {error.message}
        </Alert>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Intenta recargar la página. Si el problema persiste, contacta al administrador.
        </Typography>
      </Box>
    );
  }

  // Si no hay datos
  if (!chartData || chartData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
        <Typography variant="body2" color="text.secondary">
          No hay datos de mora por proyecto disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value / 1000000}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="amount" 
            name="Monto en Mora" 
            fill={theme.palette.error.main}
            radius={[4, 4, 0, 0]}
          >
            <LabelList 
              dataKey="percentage" 
              position="top" 
              formatter={(value: number) => `${value}%`}
              style={{ 
                fill: theme.palette.text.primary,
                fontSize: 12,
                fontWeight: 'bold'
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}