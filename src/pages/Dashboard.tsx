import { useState } from 'react';
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
  Divider
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

function TabPanel(props: TabPanelProps) {
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
}

export default function Dashboard() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Función para cambiar de pestaña
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Función para generar el reporte de Excel (se implementará más adelante)
  const handleGenerateExcelReport = () => {
    alert('Esta funcionalidad se implementará en el próximo paso');
  };

  // Función para enviar alertas de correo (se implementará más adelante)
  const handleSendEmailAlerts = () => {
    alert('Esta funcionalidad se implementará en el próximo paso');
  };

  // Función para actualizar la tabla de mora (se implementará más adelante)
  const handleUpdateOverdueTable = () => {
    alert('Esta funcionalidad se implementará en el próximo paso');
  };

  return (
    <DashboardLayout>
      {/* Título principal y acciones */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Dashboard de Suscripciones LOKL
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Monitoreo y gestión de suscripciones inmobiliarias
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
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
      <Box sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="dashboard tabs"
          >
            <Tab label="Visión General" />
            <Tab label="Mora y Pagos" />
            <Tab label="Suscripciones" />
          </Tabs>
        </Box>
        
        {/* Pestaña 1: Visión General */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Card>
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
              <Card sx={{ height: '100%' }}>
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
              <Card sx={{ height: '100%' }}>
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
        </TabPanel>
        
        {/* Pestaña 2: Mora y Pagos */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Card>
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
              <Card>
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
        </TabPanel>
        
        {/* Pestaña 3: Suscripciones */}
        <TabPanel value={tabValue} index={2}>
          <Card>
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
            <CardContent>
              <SubscriptionsTable />
            </CardContent>
          </Card>
        </TabPanel>
      </Box>
    </DashboardLayout>
  );
}