// Simplificación de Dashboard.tsx
import { Grid, Card, CardHeader, CardContent, Typography, Box, Button, useTheme } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCards from '../components/dashboard/StatsCards';
import ExpectedVsActualChart from '../components/charts/ExpectedVsActualChart';
import SubscriptionStatusChart from '../components/charts/SubscriptionStatusChart';

export default function Dashboard() {
  const theme = useTheme();

  return (
    <DashboardLayout>
      <Box sx={{ mt: 14, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Panel Principal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Resumen general de suscripciones LOKL
        </Typography>
      </Box>

      {/* KPIs principales */}
      <StatsCards />

      {/* Gráficos principales */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
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
        
        <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 3 }}>
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
        
        <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 3 }}>
          <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title="Accesos Rápidos"
              subheader="Navegación directa a secciones importantes"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, justifyContent: 'center' }}>
              <Button variant="contained" color="primary" fullWidth href="/subscriptions">
                Ver todas las suscripciones
              </Button>
              <Button variant="contained" color="secondary" fullWidth href="/overdue">
                Analizar morosidad
              </Button>
              <Button variant="contained" color="info" fullWidth href="/automation">
                Ejecutar automatizaciones
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}