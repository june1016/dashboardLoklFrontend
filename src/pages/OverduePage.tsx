import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardHeader, 
  CardContent, 
  Tab, 
  Tabs, 
  Paper,
  useTheme 
} from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import MonthlyOverdueChart from '../components/charts/MonthlyOverdueChart';
import OverdueByProject from '../components/charts/OverdueByProject';
import ExpectedVsActualChart from '../components/charts/ExpectedVsActualChart';

// Componente para panel de pestañas
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
      id={`overdue-tabpanel-${index}`}
      aria-labelledby={`overdue-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function OverduePage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mt: 14, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Mora y Pagos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Análisis detallado de morosidad y comparativa de pagos
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[2] }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="pestañas de mora y pagos"
            sx={{ px: 2 }}
          >
            <Tab label="Mora Mensual y Acumulada" />
            <Tab label="Mora por Proyecto" />
            <Tab label="Comparativa de Pagos" />
          </Tabs>
        </Box>

        {/* Contenido de pestañas */}
        <Box sx={{ p: 2 }}>
          <TabPanel value={tabValue} index={0}>
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardHeader
                title="Mora Mensual y Acumulada"
                subheader="Evolución de la mora a través del tiempo"
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
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
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
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
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
          </TabPanel>
        </Box>
      </Paper>
    </DashboardLayout>
  );
}