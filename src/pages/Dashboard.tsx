// En Dashboard.tsx, ajustar el espaciado del título principal

import { useState, useCallback, memo } from 'react';
import { 
  Grid, 
  Card, 
  CardHeader, 
  CardContent, 
  Typography,
  Box,
  useTheme,
  Tab,
  Tabs,
  Button,
  Divider,
  Paper
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import AssessmentIcon from '@mui/icons-material/Assessment';

import DashboardLayout from '../layouts/DashboardLayout';
import StatsCards from '../components/dashboard/StatsCards';
import ExpectedVsActualChart from '../components/charts/ExpectedVsActualChart';
import MonthlyOverdueChart from '../components/charts/MonthlyOverdueChart';
import OverdueByProject from '../components/charts/OverdueByProject';
import SubscriptionStatusChart from '../components/charts/SubscriptionStatusChart';
import SubscriptionsTable from '../components/tables/SubscriptionsTable';

// Componente para manejar las pestañas del dashboard
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = memo(function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
});

export default function Dashboard() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Función para cambiar de pestaña
  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  // Función para generar el reporte de Excel
  const handleGenerateExcelReport = useCallback(() => {
    alert('Esta funcionalidad se implementará en el próximo paso');
  }, []);

  // Función para enviar alertas de correo
  const handleSendEmailAlerts = useCallback(() => {
    alert('Esta funcionalidad se implementará en el próximo paso');
  }, []);

  // Función para actualizar la tabla de mora
  const handleUpdateOverdueTable = useCallback(() => {
    alert('Esta funcionalidad se implementará en el próximo paso');
  }, []);

  return (
    <DashboardLayout>
      {/* Título principal y acciones - Ajustado con margen superior para evitar solapamiento con header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' }, 
        mb: 3,
        mt: 14, // Aumentado el margen superior para evitar solapamiento con el header
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Dashboard de Suscripciones LOKL
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Monitoreo y gestión de suscripciones inmobiliarias
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          width: { xs: '100%', md: 'auto' }
        }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<DownloadIcon />}
            onClick={handleGenerateExcelReport}
          >
            Generar Reporte
          </Button>
          
          <Button 
            variant="outlined" 
            color="secondary" 
            startIcon={<EmailIcon />}
            onClick={handleSendEmailAlerts}
          >
            Enviar Alertas
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AssessmentIcon />}
            onClick={handleUpdateOverdueTable}
          >
            Actualizar Mora
          </Button>
        </Box>
      </Box>

      {/* Estadísticas principales */}
      <StatsCards />

      {/* Gráficos y Tablas */}
      <Paper sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        boxShadow: theme.shadows[2],
        mt: 4
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="pestañas del dashboard"
            sx={{ px: 2 }}
          >
            <Tab label="Visión General" />
            <Tab label="Mora y Pagos" />
            <Tab label="Suscripciones" />
          </Tabs>
        </Box>
        
        {/* Resto del código... */}
        {/* Las pestañas y su contenido permanecen igual */}
        
        {/* Pestaña 1: Visión General */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                  <CardHeader
                    title="Dinero Esperado vs. Real (Mensual)"
                    subheader="Comparación entre el dinero esperado por mes frente al dinero realmente recibido"
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
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                  <CardHeader
                    title="Suscripciones Activas y Próximas a Finalizar"
                    subheader="Distribución de suscripciones por estado"
                    sx={{
                      background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      color: 'white',
                      '& .MuiCardHeader-subheader': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      }
                    }}
                  />
                  <CardContent>
                    <SubscriptionStatusChart />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2 }}>
                  <CardHeader
                    title="Mora por Proyecto"
                    subheader="Desglose de mora acumulada por proyecto"
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
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Pestaña 2: Mora y Pagos */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                  <CardHeader
                    title="Mora Mensual y Acumulada"
                    subheader="Visualización de la mora a través del tiempo"
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
              
              <Grid size={12}>
                <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                  <CardHeader
                    title="Mora por Proyecto"
                    subheader="Desglose de mora acumulada por proyecto"
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
            </Grid>
          </Box>
        </TabPanel>
        
        {/* Pestaña 3: Suscripciones */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardHeader
                title="Tabla de Suscripciones"
                subheader="Detalle de todas las suscripciones activas y su estado"
                sx={{
                  background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  color: 'white',
                  '& .MuiCardHeader-subheader': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              />
              <Divider />
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <SubscriptionsTable />
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Paper>
    </DashboardLayout>
  );
}