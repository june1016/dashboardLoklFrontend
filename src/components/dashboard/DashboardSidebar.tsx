import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Typography, 
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Home as HomeIcon,
  AttachMoney as MoneyIcon, // Nuevo ícono
  People as PeopleIcon,
  AutoFixHigh as AutomationIcon, // Nuevo ícono
  Analytics as AnalyticsIcon, // Nuevo ícono
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom'; // Importación de useLocation
import { memo, useMemo } from 'react';

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  text: string;
  icon: React.ElementType;
  path: string;
  active: boolean;
}

// Componente memoizado para renderizar cada item del menú
const MenuItemComponent = memo(({ item, collapsed }: { item: MenuItem, collapsed: boolean }) => {
  const theme = useTheme();
  
  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        component={Link}
        to={item.path}
        sx={{
          minHeight: 48,
          justifyContent: collapsed ? 'center' : 'initial',
          px: 2.5,
          borderRadius: 1,
          mx: collapsed ? 0.5 : 1,
          ...(item.active && {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
            },
            '& .MuiListItemIcon-root': {
              color: 'primary.main',
            }
          })
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: collapsed ? 0 : 2,
            justifyContent: 'center',
            color: item.active ? 'primary.main' : 'text.secondary'
          }}
        >
          <item.icon />
        </ListItemIcon>
        {!collapsed && (
          <ListItemText 
            primary={item.text}
            primaryTypographyProps={{ 
              fontSize: 14,
              fontWeight: item.active ? 600 : 400
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
});

function DashboardSidebar({ collapsed, onToggleCollapse }: DashboardSidebarProps) {
  const theme = useTheme();
  const location = useLocation(); // Hook para obtener la ruta actual
  const currentPath = location.pathname;

  // Memoizamos los items del menú con paths actualizados
  const menuItems = useMemo<MenuItem[]>(() => [
    { text: 'Panel Principal', icon: HomeIcon, path: '/', active: currentPath === '/' },
    { text: 'Suscripciones', icon: PeopleIcon, path: '/subscriptions', active: currentPath === '/subscriptions' },
    { text: 'Mora y Pagos', icon: MoneyIcon, path: '/overdue', active: currentPath === '/overdue' },
    { text: 'Automatizaciones', icon: AutomationIcon, path: '/automation', active: currentPath === '/automation' },
    { text: 'Analítica', icon: AnalyticsIcon, path: '/analytics', active: currentPath === '/analytics' },
  ], [currentPath]);

  return (
    <Box 
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        // Transición acelerada para mayor fluidez
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp, // Sharp en lugar de easeOut para efecto instantáneo
          duration: 80, // Reducida de 120ms a 80ms para mayor velocidad
        }),
        width: collapsed ? 72 : 240,
        overflowX: 'hidden',
        position: 'relative',
        // Aplicamos will-change para optimizar el rendimiento de la animación
        willChange: 'width', 
        // Forzamos aceleración por hardware 
        transform: 'translateZ(0)',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 64,
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {/* Logo - con transición de opacity para mejor apariencia */}
        <Box 
          sx={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
            overflow: 'hidden',
            transition: theme.transitions.create(['opacity', 'width'], {
              duration: 80,
              easing: theme.transitions.easing.sharp,
            }),
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {!collapsed && (
            <img 
              src="/src/assets/Logo.png" 
              alt="LOKL Logo" 
              style={{ 
                height: 40, 
                maxWidth: 120,
                objectFit: 'contain' 
              }} 
            />
          )}
        </Box>

        {/* Botón de toggle - ajustado para ambos estados */}
        <IconButton 
          onClick={onToggleCollapse}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
            // Centrar el botón cuando está colapsado
            ...(collapsed && {
              mx: 'auto',
            })
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <MenuItemComponent 
            key={`menu-item-${item.text}`} 
            item={item} 
            collapsed={collapsed} 
          />
        ))}
      </List>

      {/* Footer - con transición de opacity */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          opacity: collapsed ? 0 : 1,
          maxHeight: collapsed ? 0 : 64,
          overflow: 'hidden',
          transition: theme.transitions.create(['opacity', 'max-height'], {
            duration: 80,
            easing: theme.transitions.easing.sharp,
          }),
        }}
      >
        <Box>
          <Typography variant="body2" fontWeight={500}>
            LOKL Pro
          </Typography>
          <Typography variant="caption" color="text.secondary">
            5 usuarios
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// Memoizamos todo el componente para evitar renderizados innecesarios
export default memo(DashboardSidebar);