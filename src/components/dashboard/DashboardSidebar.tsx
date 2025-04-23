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
  BarChart as BarChartIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  CreditCard as CreditCardIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { memo, useEffect } from 'react';

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

function DashboardSidebar({ collapsed, onToggleCollapse }: DashboardSidebarProps) {
  const theme = useTheme();

  // Usar useEffect para aplicar una clase CSS para animaciones más suaves
  useEffect(() => {
    // Añadir una clase al body para manejar transiciones CSS más fluidas
    document.body.classList.toggle('sidebar-transition', true);
    
    return () => {
      document.body.classList.toggle('sidebar-transition', false);
    };
  }, []);

  const menuItems: MenuItem[] = [
    { text: 'Panel Principal', icon: HomeIcon, path: '/', active: true },
    { text: 'Analítica', icon: BarChartIcon, path: '/analytics', active: false },
    { text: 'Suscripciones', icon: ShoppingCartIcon, path: '/orders', active: false },
    { text: 'Clientes', icon: PeopleIcon, path: '/customers', active: false },
    { text: 'Facturación', icon: CreditCardIcon, path: '/billing', active: false },
    { text: 'Configuración', icon: SettingsIcon, path: '/settings', active: false },
  ];

  return (
    <Box 
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        // Usar transitionProperty específico para mayor optimización
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.easeOut, // Usa easeOut para una sensación más natural
          duration: 120, // Reducir la duración aún más para que se sienta más rápida
        }),
        width: collapsed ? 72 : 240, // Reducir el ancho cuando está colapsado para mejor diseño
        overflowX: 'hidden',
        position: 'relative', // Necesario para posicionar absolutamente el botón
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
        {/* Logo - solo visible cuando está expandido */}
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
          <ListItem key={`menu-item-${item.text}`} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'initial',
                px: 2.5,
                borderRadius: 1,
                mx: collapsed ? 0.5 : 1, // Ajuste del margen para mejorar apariencia colapsada
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
        ))}
      </List>

      {/* Footer - solo mostrar cuando está expandido */}
      {!collapsed && (
        <Box 
          sx={{ 
            p: 2, 
            borderTop: 1, 
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
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
      )}
    </Box>
  );
}

// Utilizamos memo para evitar renderizados innecesarios
export default memo(DashboardSidebar);