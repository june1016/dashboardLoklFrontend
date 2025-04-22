import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useMobile } from '../../hooks/useMobile';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MonthlyData {
  name: string;
  expected: number;
  actual: number;
  difference: number;
}

export default function ExpectedVsActualChart() {
  const theme = useTheme();
  const isMobile = useMobile();
  const [chartData, setChartData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    // Datos de ejemplo (estos se reemplazarán con datos reales de la API)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const expectedValues = [25000000, 27000000, 28500000, 30000000, 32000000, 35000000, 38000000, 42000000, 45000000, 48000000, 52000000, 55000000];
    const actualValues = [24500000, 26800000, 27000000, 28500000, 31000000, 33000000, 37000000, 40000000, 43000000, 45500000, 49000000, 52000000];
    
    const data = months.map((month, index) => {
      const expected = expectedValues[index];
      const actual = actualValues[index];
      return {
        name: month,
        expected,
        actual,
        difference: actual - expected
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

  // Personalizamos el tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const expected = payload[0].value;
      const actual = payload[1].value;
      const difference = actual - expected;
      const percentage = ((actual / expected) * 100).toFixed(1);
      
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 1,
            boxShadow: 2,
            border: `1px solid ${theme.palette.divider}`,
            minWidth: 200
          }}
        >
          <Box sx={{ fontWeight: 'bold', mb: 1 }}>{label}</Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <span style={{ color: theme.palette.primary.main }}>Esperado:</span>
            <span style={{ fontWeight: 500 }}>{formatCurrency(expected)}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <span style={{ color: theme.palette.success.main }}>Real:</span>
            <span style={{ fontWeight: 500 }}>{formatCurrency(actual)}</span>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            color: difference >= 0 ? theme.palette.success.main : theme.palette.error.main,
            fontWeight: 'bold',
            mt: 1,
            pt: 1,
            borderTop: `1px dashed ${theme.palette.divider}`
          }}>
            <span>Diferencia:</span>
            <span>{formatCurrency(difference)} ({percentage}%)</span>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="expected" 
            name="Dinero Esperado" 
            fill={theme.palette.primary.light}
            radius={[4, 4, 0, 0]}
            barSize={20}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Dinero Real"
            stroke={theme.palette.success.main}
            strokeWidth={3}
            dot={{
              stroke: theme.palette.success.main,
              strokeWidth: 2,
              fill: theme.palette.background.paper,
              r: 6,
            }}
            activeDot={{ r: 8 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}