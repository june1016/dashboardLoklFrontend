import { useEffect, useState } from 'react';
import { 
  Box, 
  useTheme, 
  CircularProgress, 
  Alert, 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
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

  // Obtener el año actual para usarlo como parámetro por defecto
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generar años disponibles (2023 hasta año actual)
  const availableYears = [];
  for (let year = 2023; year <= currentYear; year++) {
    availableYears.push(year);
  }

  // Usar el hook para obtener datos reales de la API
  const { data, loading, error } = useDataFetching<ProjectOverdue[]>({
    initialData: [],
    fetchFn: () => dashboardService.getOverdueByProject(selectedYear),
    dependencies: [selectedYear]
  });

  // Procesar datos cuando cambian
  useEffect(() => {
    if (data && data.length > 0) {
      // Los datos ya vienen ordenados del backend, pero por si acaso
      const sortedData = [...data].sort((a, b) => b.amount - a.amount);
      setChartData(sortedData);
    } else {
      setChartData([]);
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

  // Manejador para cambio de año
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center', height: 350 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="project-overdue-year-select-label">Año</InputLabel>
          <Select
            labelId="project-overdue-year-select-label"
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
        <Typography variant="body2" color="text.secondary">
          No hay datos de mora por proyecto disponibles para {selectedYear}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 350 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="project-overdue-year-select-label">Año</InputLabel>
          <Select
            labelId="project-overdue-year-select-label"
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
      </Box>
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