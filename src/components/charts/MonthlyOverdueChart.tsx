import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useMobile } from '../../hooks/useMobile';
import {
  AreaChart,
  Area,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MonthlyOverdue {
  name: string;
  monthly: number;
  accumulated: number;
}

export default function MonthlyOverdueChart() {
  const theme = useTheme();
  const isMobile = useMobile();
  const [chartData, setChartData] = useState<MonthlyOverdue[]>([]);
  const [chartType, setChartType] = useState<'monthly' | 'accumulated'>('monthly');

  useEffect(() => {
    // Datos de ejemplo (estos se reemplazarán con datos reales de la API)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Valores mensuales
    const monthlyValues = [800000, 1200000, 950000, 1100000, 1500000, 1300000, 1600000, 1800000, 1400000, 1700000, 1900000, 2200000];
    
    // Calcular acumulado
    let accumulated = 0;
    const data = months.map((month, index) => {
      const monthly = monthlyValues[index];
      accumulated += monthly;
      return {
        name: month,
        monthly,
        accumulated
      };
    });

    setChartData(isMobile ? data.filter((_, i) => i % 2 === 0) : data);
  }, [isMobile]);

  // Formateo de moneda para tooltip y ejes
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Cambiar tipo de gráfico
  const handleChartTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: 'monthly' | 'accumulated',
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Renderizar el gráfico apropiado según la selección
  const renderChart = () => {
    if (chartType === 'monthly') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="name"
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000000}M`}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Mes: ${label}`}
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[3]
              }}
            />
            <Legend />
            <Bar 
              dataKey="monthly" 
              name="Mora Mensual" 
              fill={theme.palette.error.main}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="name"
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000000}M`}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Mes: ${label}`}
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[3]
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="accumulated" 
              name="Mora Acumulada" 
              fill={`${theme.palette.error.main}20`}
              stroke={theme.palette.error.main}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
        >
          <ToggleButton value="monthly">
            Mensual
          </ToggleButton>
          <ToggleButton value="accumulated">
            Acumulada
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {renderChart()}
    </Box>
  );
}