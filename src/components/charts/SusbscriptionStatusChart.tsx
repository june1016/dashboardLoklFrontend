import { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SubscriptionData {
  name: string;
  value: number;
  description: string;
}

export default function SubscriptionStatusChart() {
  const theme = useTheme();
  const [chartData, setChartData] = useState<SubscriptionData[]>([]);

  useEffect(() => {
    // Datos de ejemplo (estos se reemplazarán con datos reales de la API)
    const data: SubscriptionData[] = [
      { 
        name: 'Activas', 
        value: 145, 
        description: 'Suscripciones actualmente en curso'
      },
      { 
        name: 'Finalizando Pronto', 
        value: 38, 
        description: 'Suscripciones con 3 cuotas o menos restantes'
      }
    ];
    setChartData(data);
  }, []);

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
    percent,
    value,
  }: any) => {
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
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            formatter={(value, entry, index) => {
              return (
                <Box sx={{ color: COLORS[index % COLORS.length], fontWeight: 'bold' }}>
                  {value} ({chartData[index]?.value})
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