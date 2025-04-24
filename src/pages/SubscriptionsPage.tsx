import { Box, Typography } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';
import SubscriptionsTable from '../components/tables/SubscriptionsTable';

export default function SubscriptionsPage() {

  return (
    <DashboardLayout>
      <Box sx={{ mt: 14, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Gestión de Suscripciones
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualización y filtrado de todas las suscripciones
        </Typography>
      </Box>

      {/* Tabla completa de suscripciones con filtros */}
      <SubscriptionsTable />
    </DashboardLayout>
  );
}