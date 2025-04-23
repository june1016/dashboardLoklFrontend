import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Typography, 
  Avatar,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // Added the import for alpha
import {
  Home as HomeIcon,
  BarChart as BarChartIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  CreditCard as CreditCardIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  GroupWork as GroupWorkIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

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

export default function DashboardSidebar({ collapsed, onToggleCollapse }: DashboardSidebarProps) {
  const theme = useTheme();

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: HomeIcon, path: '/', active: true },
    { text: 'Analytics', icon: BarChartIcon, path: '/analytics', active: false },
    { text: 'Orders', icon: ShoppingCartIcon, path: '/orders', active: false },
    { text: 'Customers', icon: PeopleIcon, path: '/customers', active: false },
    { text: 'Billing', icon: CreditCardIcon, path: '/billing', active: false },
    { text: 'Settings', icon: SettingsIcon, path: '/settings', active: false },
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
        transition: 'width 0.3s ease',
        width: collapsed ? 72 : 240,
        overflowX: 'hidden'
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'space-between',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 64
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40
            }}
          >
            <GroupWorkIcon sx={{ color: 'white' }} />
          </Avatar>
          
          {!collapsed && (
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              LOKL
            </Typography>
          )}
        </Box>

        <IconButton 
          onClick={onToggleCollapse}
          sx={{ display: collapsed ? 'none' : 'flex' }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {collapsed && (
          <IconButton 
            onClick={onToggleCollapse}
            sx={{ 
              position: 'absolute', 
              top: 72, 
              left: '50%', 
              transform: 'translateX(-50%)',
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              boxShadow: 1,
              width: 24,
              height: 24,
              '& .MuiSvgIcon-root': {
                fontSize: 16
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
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
                mx: 1,
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

      {/* Footer */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: collapsed ? 'center' : 'initial'
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            width: 32,
            height: 32
          }}
        >
          <PeopleIcon fontSize="small" />
        </Avatar>
        
        {!collapsed && (
          <Box>
            <Typography variant="body2" fontWeight={500}>
              LOKL Pro
            </Typography>
            <Typography variant="caption" color="text.secondary">
              5 users
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}