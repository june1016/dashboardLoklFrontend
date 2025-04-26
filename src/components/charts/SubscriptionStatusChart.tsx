import { useEffect, useState } from 'react';
import { Box, Typography, useTheme, CircularProgress, Alert } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { dashboardService } from '../../api/api';
import { useDataFetching } from '../../hooks/useDataFetching';

// Interfaces para tipado
interface SubscriptionData {
  name: string;
  value: number;
  description: string;
}

interface ApiSubscriptionResponse {
  active: Array<{
    id: string;
    status: string;
    project: string;
    investment: number;
    units: number;
    remainingInstallments: number;
    totalInstallments: number;
  }>;
  endingSoon: Array<{
    id: string;
    status: string;
    project: string;
    investment: number;
    units: number;
    remainingInstallments: number;
    totalInstallments: number;
  }>;
  total: number;
}

export default function SubscriptionStatusChart() {
  const theme = useTheme();

  // Usar el hook de fetching para obtener los datos
  const { data, loading, error } = useDataFetching<ApiSubscriptionResponse>({
    initialData: { active: [], endingSoon: [], total: 0 },
    fetchFn: dashboardService.getActiveSubscriptions,
    dependencies: []
  });

  // Estado para los datos procesados para el gráfico
  const [chartData, setChartData] = useState<SubscriptionData[]>([]);

  // Procesar los datos cuando se reciben de la API
  useEffect(() => {
    if (data) {
      const processedData: SubscriptionData[] = [
        { 
          name: 'Activas', 
          value: data.active.length, 
          description: 'Suscripciones actualmente en curso'
        },
        { 
          name: 'Finalizando Pronto', 
          value: data.endingSoon.length, 
          description: 'Suscripciones con 3 cuotas o menos restantes'
        }
      ];
      setChartData(processedData);
    }
  }, [data]);

  // Colores personalizados para el gráfico
  const COLORS = [theme.palette.success.main, theme.palette.warning.main];

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
          <Typography fontWeight={600} color={payload[0].color} sx={{ mb: 0.5 }}>
            {payload[0].name}: {payload[0].value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {payload[0].payload.description}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Renderizado personalizado de las etiquetas dentro del gráfico
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: any) => {
    if (value === 0) return null; // No mostrar etiqueta para valores cero
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#FFFFFF" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontWeight="bold"
      >
        {value}
      </text>
    );
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <Box sx={{ height: 250 }}>
        <Alert severity="error">
          Error al cargar datos de suscripciones: {error.message}
        </Alert>
      </Box>
    );
  }

  // Si no hay datos
  if (!chartData.length || (chartData[0].value === 0 && chartData[1].value === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
        <Typography variant="body2" color="text.secondary">
          No hay datos de suscripciones disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 250, display: 'flex', flexDirection: 'column' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            formatter={(value, _, index) => {
              if (!chartData[index]) return value;
              return (
                <Box sx={{ color: COLORS[index % COLORS.length], fontWeight: 'bold' }}>
                  {value} ({chartData[index].value})
                </Box>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {chartData.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            <strong>Total:</strong> {chartData.reduce((acc, item) => acc + item.value, 0)} suscripciones
          </Typography>
        </Box>
      )}
    </Box>
  );
}