import { useEffect, useState, memo, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
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
import { dashboardService } from '../../api/api';
import { useDataFetching } from '../../hooks/useDataFetching';

interface MonthlyData {
  name: string;
  expected: number;
  actual: number;
  difference: number;
}

function ExpectedVsActualChart() {
  const theme = useTheme();
  const isMobile = useMobile();
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  
  // Obtener el año actual para usarlo como parámetro por defecto
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Usar el hook para obtener datos reales de la API
  const { data, loading, error } = useDataFetching<MonthlyData[]>({
    initialData: [],
    fetchFn: () => dashboardService.getExpectedVsActual(currentYear),
    dependencies: [currentYear]
  });

  // Procesar datos cuando cambian
  useEffect(() => {
    if (data && data.length > 0) {
      // Si estamos en móvil, mostrar menos datos
      setChartData(isMobile ? data.filter((_, i) => i % 2 === 0) : data);
    }
  }, [data, isMobile]);

  // Formateo de moneda memoizado para evitar recreación
  const formatCurrency = useMemo(() => {
    return (value: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(value);
    };
  }, []);

  // Personalizamos el tooltip como un componente memoizado
  const CustomTooltip = memo(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const expected = payload[0].value;
      const actual = payload[1].value;
      const difference = actual - expected;
      // Evitar división por cero
      const percentage = expected === 0 
        ? '0.0' 
        : ((actual / expected) * 100).toFixed(1);
      
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
  });

  // Mostrar estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <Box sx={{ height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar datos financieros: {error.message}
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Typography variant="body2" color="text.secondary">
          No hay datos financieros disponibles para mostrar
        </Typography>
      </Box>
    );
  }

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

// Utilizamos memo para evitar renderizados innecesarios
export default memo(ExpectedVsActualChart);