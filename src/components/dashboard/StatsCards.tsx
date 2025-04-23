import { memo, useMemo } from 'react';
import { Grid, Card, CardContent, Box, Typography, Avatar, useTheme } from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  ShoppingCart as CartIcon,
  BarChart as ChartIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';

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

function StatsCards() {
  const theme = useTheme();

  // Usamos useMemo para evitar recrear el array en cada renderizado
  const stats = useMemo<StatCardProps[]>(() => [
    {
      title: 'Ingresos Totales',
      value: '$45.231.890',
      change: '+20,1%',
      trend: 'up',
      icon: MoneyIcon,
      color: theme.palette.primary.main,
      gradientFrom: theme.palette.primary.main,
      gradientTo: theme.palette.primary.light
    },
    {
      title: 'Suscripciones',
      value: '2.350',
      change: '+12,5%',
      trend: 'up',
      icon: PeopleIcon,
      color: theme.palette.info.main,
      gradientFrom: theme.palette.info.main,
      gradientTo: theme.palette.info.light
    },
    {
      title: 'Ventas',
      value: '12.234',
      change: '+19,5%',
      trend: 'up',
      icon: CartIcon,
      color: theme.palette.secondary.main,
      gradientFrom: theme.palette.secondary.main,
      gradientTo: theme.palette.secondary.light
    },
    {
      title: 'Rendimiento',
      value: '49,65%',
      change: '-8,5%',
      trend: 'down',
      icon: ChartIcon,
      color: theme.palette.error.main,
      gradientFrom: theme.palette.error.main,
      gradientTo: theme.palette.error.light
    },
  ], [theme.palette]);

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
            <ArrowUpIcon fontSize="small" sx={{ color: theme.palette.success.main, mr: 0.5 }} />
          ) : (
            <ArrowDownIcon fontSize="small" sx={{ color: theme.palette.error.main, mr: 0.5 }} />
          )}
          <Typography 
            variant="body2" 
            sx={{ 
              color: stat.trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
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
            desde el mes pasado
          </Typography>
        </Box>
      </CardContent>
    </Card>
  ));

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