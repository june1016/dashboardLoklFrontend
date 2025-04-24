import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardHeader, 
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme 
} from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import SubscriptionChart from '../components/charts/SubscriptionChart';
import OverdueByProject from '../components/charts/OverdueByProject';
import MonthlyOverdueChart from '../components/charts/MonthlyOverdueChart';
import ExpectedVsActualChart from '../components/charts/ExpectedVsActualChart';

// Componente para análisis adicionales y personalizables
export default function AnalyticsPage() {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('year');
  const [projectFilter, setProjectFilter] = useState('all');
  
  // Placeholder para proyectos
  const projects = [
    { id: 'all', name: 'Todos los proyectos' },
    { id: 'green_tower', name: 'Green Tower' },
    { id: 'blue_ocean', name: 'Blue Ocean' },
    { id: 'sunset_hills', name: 'Sunset Hills' },
    { id: 'mountain_view', name: 'Mountain View' },
    { id: 'city_lofts', name: 'City Lofts' }
  ];

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const handleProjectChange = (event: SelectChangeEvent) => {
    setProjectFilter(event.target.value);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mt: 14, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Análisis Avanzado
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualizaciones detalladas para análisis de tendencias y patrones
        </Typography>
      </Box>

      {/* Filtros de análisis */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="time-range-label">Periodo de Tiempo</InputLabel>
            <Select
              labelId="time-range-label"
              value={timeRange}
              label="Periodo de Tiempo"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="month">Último Mes</MenuItem>
              <MenuItem value="quarter">Último Trimestre</MenuItem>
              <MenuItem value="year">Último Año</MenuItem>
              <MenuItem value="all">Todo el Historial</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="project-filter-label">Proyecto</InputLabel>
            <Select
              labelId="project-filter-label"
              value={projectFilter}
              label="Proyecto"
              onChange={handleProjectChange}
            >
              {projects.map(project => (
                <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Gráficos de análisis */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 2, borderRadius: 2, height: '100%' }}>
            <CardHeader
              title="Distribución de Suscripciones por Plan"
              subheader="Clasificación por tipo de plan contratado"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
            <CardContent>
              <SubscriptionChart />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 2, borderRadius: 2, height: '100%' }}>
            <CardHeader
              title="Tendencia de Mora por Proyecto"
              subheader="Evolución de la morosidad en el tiempo"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
            <CardContent>
              <OverdueByProject />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 3 }}>
          <Card sx={{ boxShadow: 2, borderRadius: 2, height: '100%' }}>
            <CardHeader
              title="Análisis de Pagos en el Tiempo"
              subheader="Comparativa de pagos esperados vs recibidos"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
            <CardContent>
              <ExpectedVsActualChart />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 3 }}>
          <Card sx={{ boxShadow: 2, borderRadius: 2, height: '100%' }}>
            <CardHeader
              title="Evolución de Mora Mensual"
              subheader="Tendencia de morosidad a lo largo del tiempo"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
            <CardContent>
              <MonthlyOverdueChart />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}