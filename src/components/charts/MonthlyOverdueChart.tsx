import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  ToggleButton, 
  ToggleButtonGroup, 
  CircularProgress, 
  Alert, 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
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
import { dashboardService } from '../../api/api';
import { useDataFetching } from '../../hooks/useDataFetching';

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
  
  // Obtener el año actual para usarlo como parámetro por defecto
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generar años disponibles (2023 hasta año actual)
  const availableYears = [];
  for (let year = 2023; year <= currentYear; year++) {
    availableYears.push(year);
  }

  // Usar el hook para obtener datos reales de la API
  const { data, loading, error } = useDataFetching<MonthlyOverdue[]>({
    initialData: [],
    fetchFn: () => dashboardService.getMonthlyOverdue(selectedYear),
    dependencies: [selectedYear] // Volver a ejecutar cuando cambie el año
  });

  // Procesar datos cuando cambian
  useEffect(() => {
    if (data && data.length > 0) {
      // Si estamos en móvil, mostrar menos datos
      setChartData(isMobile ? data.filter((_, i) => i % 2 === 0) : data);
    }
  }, [data, isMobile]);

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

  // Añadir manejador para el cambio de año
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

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
          Error al cargar datos de mora: {error.message}
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
          No hay datos de mora disponibles para mostrar en {selectedYear}
        </Typography>
      </Box>
    );
  }

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="monthly-overdue-year-select-label">Año</InputLabel>
          <Select
            labelId="monthly-overdue-year-select-label"
            value={selectedYear}
            label="Año"
            onChange={handleYearChange}
          >
            {availableYears.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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