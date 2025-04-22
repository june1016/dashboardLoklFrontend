import { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
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

interface ProjectOverdue {
  name: string;
  amount: number;
  percentage: number;
}

export default function OverdueByProject() {
  const theme = useTheme();
  const [chartData, setChartData] = useState<ProjectOverdue[]>([]);

  useEffect(() => {
    // Datos de ejemplo (se reemplazarán con datos reales de la API)
    const data: ProjectOverdue[] = [
      { name: 'Green Tower', amount: 1200000, percentage: 12 },
      { name: 'Blue Ocean', amount: 3500000, percentage: 35 },
      { name: 'Sunset Hills', amount: 2800000, percentage: 28 },
      { name: 'Mountain View', amount: 900000, percentage: 9 },
      { name: 'City Lofts', amount: 1600000, percentage: 16 }
    ];
    
    // Ordenar de mayor a menor
    const sortedData = [...data].sort((a, b) => b.amount - a.amount);
    setChartData(sortedData);
  }, []);

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