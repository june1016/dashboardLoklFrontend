import { memo, useEffect, useState } from 'react';
import { Grid, Card, CardContent, Box, Typography, Avatar, useTheme, CircularProgress, Alert } from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { dashboardService } from '../../api/api';
import { useDataFetching } from '../../hooks/useDataFetching';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

interface DashboardStats {
  totalIncome: number;
  lastMonthIncome: number;
  thisMonthIncome: number;
  totalActiveSubscriptions: number;
  newSubscriptions: number;
  overdueRate: number;
  overdueRateChange: number;
  monthlyCollection: number;
  monthlyCollectionChange: number;
}

function StatsCards() {
  const theme = useTheme();
  const [stats, setStats] = useState<StatCardProps[]>([]);

  // Usar el hook para obtener datos reales de la API
  const { data, loading, error } = useDataFetching<DashboardStats>({
    initialData: {
      totalIncome: 0,
      lastMonthIncome: 0,
      thisMonthIncome: 0,
      totalActiveSubscriptions: 0,
      newSubscriptions: 0,
      overdueRate: 0,
      overdueRateChange: 0,
      monthlyCollection: 0,
      monthlyCollectionChange: 0
    },
    fetchFn: dashboardService.getDashboardStats,
    dependencies: []
  });

  // Procesar los datos de KPIs cuando se reciben
  useEffect(() => {
    if (data) {
      // Formatear los números para mostrar
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0
        }).format(value);
      };

      const formatNumber = (value: number) => {
        return new Intl.NumberFormat('es-CO').format(value);
      };

      const formatPercentage = (value: number) => {
        return `${value.toFixed(2)}%`;
      };

      // Calcular cambio mensual de ingresos
      const incomeChange = data.thisMonthIncome === 0 ? 0 : 
        ((data.thisMonthIncome - data.lastMonthIncome) / data.lastMonthIncome) * 100;

      // Construir array de stats con datos reales
      const newStats: StatCardProps[] = [
        {
          title: 'Ingresos Totales',
          value: formatCurrency(data.totalIncome),
          change: `${incomeChange > 0 ? '+' : ''}${incomeChange.toFixed(1)}%`,
          trend: incomeChange >= 0 ? 'up' : 'down',
          icon: MoneyIcon,
          color: theme.palette.primary.main,
          gradientFrom: theme.palette.primary.main,
          gradientTo: theme.palette.primary.light
        },
        {
          title: 'Suscripciones Activas',
          value: formatNumber(data.totalActiveSubscriptions),
          change: `+${formatNumber(data.newSubscriptions)}`,
          trend: 'up',
          icon: PeopleIcon,
          color: theme.palette.info.main,
          gradientFrom: theme.palette.info.main,
          gradientTo: theme.palette.info.light
        },
        {
          title: 'Tasa de Morosidad',
          value: formatPercentage(data.overdueRate),
          change: `${data.overdueRateChange > 0 ? '+' : ''}${data.overdueRateChange.toFixed(1)}%`,
          trend: data.overdueRateChange > 0 ? 'up' : 'down',
          icon: WarningIcon,
          color: theme.palette.warning.main,
          gradientFrom: theme.palette.warning.main,
          gradientTo: theme.palette.warning.light
        },
        {
          title: 'Recaudación Mensual',
          value: formatCurrency(data.monthlyCollection),
          change: `${data.monthlyCollectionChange > 0 ? '+' : ''}${data.monthlyCollectionChange.toFixed(1)}%`,
          trend: data.monthlyCollectionChange >= 0 ? 'up' : 'down',
          icon: CalendarIcon,
          color: data.monthlyCollectionChange >= 0 ? theme.palette.success.main : theme.palette.error.main,
          gradientFrom: data.monthlyCollectionChange >= 0 ? theme.palette.success.main : theme.palette.error.main,
          gradientTo: data.monthlyCollectionChange >= 0 ? theme.palette.success.light : theme.palette.error.light
        },
      ];

      setStats(newStats);
    }
  }, [data, theme.palette]);

  // Componente de tarjeta memoizado para evitar renderizados innecesarios
  const StatCard = memo(({ stat }: { stat: StatCardProps }) => (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        position: 'relative',
        overflow: 'visible',
        height: '100%'
      }}
    >
      <Box
        sx={{
          height: 4,
          width: '100%',
          background: `linear-gradient(to right, ${stat.gradientFrom}, ${stat.gradientTo})`,
          position: 'absolute',
          top: 0,
          left: 0,
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius
        }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {stat.title}
          </Typography>
          <Avatar 
            sx={{ 
              bgcolor: `${stat.color}15`, 
              color: stat.color,
              width: 40,
              height: 40
            }}
          >
            <stat.icon />
          </Avatar>
        </Box>
        
        {/* Ajustar el tamaño de la tipografía y añadir propiedades para evitar desbordamiento */}
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ 
            mb: 1,
            fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.6rem', lg: '1.75rem' }, // Tamaño de fuente responsivo
            whiteSpace: 'nowrap', // Evita que el texto se divida en múltiples líneas
            overflow: 'hidden', // Oculta el contenido que se desborde
            textOverflow: 'ellipsis', // Muestra "..." si el texto es demasiado largo
            width: '100%', // Asegura que el contenedor tenga ancho completo
            display: 'block' // Asegura que el elemento sea un bloque
          }}
        >
          {stat.value}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {stat.trend === 'up' ? (
            <ArrowUpIcon fontSize="small" sx={{ color: 
              stat.title === 'Tasa de Morosidad' ? theme.palette.error.main : theme.palette.success.main, 
              mr: 0.5 
            }} />
          ) : (
            <ArrowDownIcon fontSize="small" sx={{ color: 
              stat.title === 'Tasa de Morosidad' ? theme.palette.success.main : theme.palette.error.main, 
              mr: 0.5 
            }} />
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              color: stat.title === 'Tasa de Morosidad' 
                ? (stat.trend === 'up' ? theme.palette.error.main : theme.palette.success.main)
                : (stat.trend === 'up' ? theme.palette.success.main : theme.palette.error.main),
              fontWeight: 'medium',
              mr: 0.5
            }}
          >
            {stat.change}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              whiteSpace: 'nowrap', // Evita que el texto se divida en múltiples líneas
              overflow: 'hidden', // Oculta el contenido que se desborde
              textOverflow: 'ellipsis' // Muestra "..." si el texto es demasiado largo
            }}
          >
            {stat.title === 'Suscripciones Activas' ? 'nuevas este mes' : 'desde el mes pasado'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  ));

  // Mostrar estado de carga
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error al cargar estadísticas: {error.message}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`stat-card-${index}`}>
          <StatCard stat={stat} />
        </Grid>
      ))}
    </Grid>
  );
}

// Utilizamos memo para evitar renderizados innecesarios del componente principal
export default memo(StatsCards);