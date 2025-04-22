import {
    Box,
    Button,
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
    ExpandMore as ExpandMoreIcon,
    GetApp as GetAppIcon,
    Assessment as AssessmentIcon
  } from '@mui/icons-material';
  import { useState } from 'react';
  
  export default function DashboardHeader() {
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
      <Box sx={{ position: 'relative' }}>
        {/* Gradient background */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            zIndex: -1
          }}
        />
  
        {/* Header content */}
        <Box 
          sx={{
            position: 'relative',
            display: 'flex',
            height: 200,
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
              Welcome back, your business summary
            </Typography>
  
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                sx={{
                  bgcolor: alpha('#FFFFFF', 0.1),
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: alpha('#FFFFFF', 0.2)
                  }
                }}
              >
                Weekly Report
              </Button>
              <Button
                variant="contained"
                startIcon={<GetAppIcon />}
                sx={{
                  bgcolor: alpha('#FFFFFF', 0.1),
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: alpha('#FFFFFF', 0.2)
                  }
                }}
              >
                Export Data
              </Button>
            </Box>
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
                placeholder="Search..."
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
              <Button
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
                    John Doe
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.8) }}>
                    Admin
                  </Typography>
                </Box>
                <ExpandMoreIcon sx={{ color: alpha('#FFFFFF', 0.8), ml: { xs: 0, md: 1 } }} />
              </Button>
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
                  <Typography variant="body2" fontWeight={500}>My Account</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={handleClose}>Billing</MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>Log out</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }