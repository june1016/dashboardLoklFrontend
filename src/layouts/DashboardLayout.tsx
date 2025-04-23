import { useState, ReactNode } from 'react';
import { Box, Drawer, useTheme } from '@mui/material';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardContent from '../components/dashboard/DashboardContent';
import { useMobile } from '../hooks/useMobile';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: '#f5f7fa', // Fondo más claro para contraste
      overflow: 'hidden'
    }}>
      {/* Sidebar para desktop */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            zIndex: theme.zIndex.drawer
          }}
        >
          <DashboardSidebar 
            collapsed={sidebarCollapsed} 
            onToggleCollapse={handleSidebarToggle} 
          />
        </Box>
      )}

      {/* Sidebar para móvil */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejor rendimiento en dispositivos móviles
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              boxShadow: 3
            },
            zIndex: theme.zIndex.drawer
          }}
        >
          <DashboardSidebar 
            collapsed={false} 
            onToggleCollapse={handleDrawerToggle} 
          />
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', sm: `calc(100% - ${sidebarWidth}px)` },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <DashboardHeader />
        <DashboardContent>
          {children}
        </DashboardContent>
      </Box>
    </Box>
  );
}