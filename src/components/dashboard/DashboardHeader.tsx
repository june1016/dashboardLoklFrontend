import {
  Box,
  InputBase,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useState, memo } from 'react';

function DashboardHeader() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ 
      position: 'relative',
      width: '100%',
      height: 200,
      overflow: 'visible',
      zIndex: 10
    }}>
      {/* Gradient background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          zIndex: -1
        }}
      />

      {/* Header content */}
      <Box 
        sx={{
          display: 'flex',
          height: '100%',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: 4,
          pt: 3
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: alpha('#FFFFFF', 0.8), mt: 0.5 }}>
          para el monitoreo y gestión de las suscripciones de la 
          empresa.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            sx={{ 
              position: 'relative',
              bgcolor: alpha('#FFFFFF', 0.1),
              borderRadius: 4,
              px: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <SearchIcon sx={{ color: alpha('#FFFFFF', 0.7), mr: 1 }} />
            <InputBase
              placeholder="Buscar..."
              sx={{ 
                color: 'white',
                '& ::placeholder': {
                  color: alpha('#FFFFFF', 0.7),
                  opacity: 1
                },
                minWidth: 180
              }}
            />
          </Box>

          <IconButton
            sx={{
              bgcolor: alpha('#FFFFFF', 0.1),
              color: 'white',
              '&:hover': {
                bgcolor: alpha('#FFFFFF', 0.2)
              }
            }}
          >
            <NotificationsIcon />
          </IconButton>

          <Box>
            <IconButton
              id="profile-button"
              aria-controls={open ? 'profile-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: alpha('#FFFFFF', 0.1),
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 6,
                '&:hover': {
                  bgcolor: alpha('#FFFFFF', 0.2)
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  border: `2px solid ${alpha('#FFFFFF', 0.2)}`
                }}
              >
                JD
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Juan Esteban
                </Typography>
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.8) }}>
                  Administrador
                </Typography>
              </Box>
              <ExpandMoreIcon sx={{ color: alpha('#FFFFFF', 0.8), ml: { xs: 0, md: 1 } }} />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'profile-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem sx={{ minWidth: 180, py: 1 }}>
                <Typography variant="body2" fontWeight={500}>Mi Cuenta</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>Perfil</MenuItem>
              <MenuItem onClick={handleClose}>Configuración</MenuItem>
              <MenuItem onClick={handleClose}>Facturación</MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// Utilizamos memo para evitar renderizados innecesarios
export default memo(DashboardHeader);