import { createTheme } from '@mui/material/styles';

// Paleta de colores basada en #221FEB (índigo)
export const theme = createTheme({
  palette: {
    primary: {
      main: '#221FEB',
      light: '#4844FF',
      dark: '#15139A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4CC9F0',
      light: '#7ADBF9',
      dark: '#25A7CD',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.07)',
    '0px 6px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 12px rgba(0, 0, 0, 0.1)',
    '0px 10px 14px rgba(0, 0, 0, 0.12)',
    '0px 12px 16px rgba(0, 0, 0, 0.15)',
    '0px 14px 20px rgba(0, 0, 0, 0.15)',
    '0px 16px 24px rgba(0, 0, 0, 0.16)',
    '0px 20px 28px rgba(0, 0, 0, 0.18)',
    '0px 24px 32px rgba(0, 0, 0, 0.2)',
    '0px 28px 38px rgba(0, 0, 0, 0.21)',
    '0px 32px 44px rgba(0, 0, 0, 0.22)',
    '0px 36px 50px rgba(0, 0, 0, 0.23)',
    '0px 40px 56px rgba(0, 0, 0, 0.24)',
    '0px 44px 62px rgba(0, 0, 0, 0.25)',
    '0px 48px 68px rgba(0, 0, 0, 0.26)',
    '0px 52px 74px rgba(0, 0, 0, 0.27)',
    '0px 56px 80px rgba(0, 0, 0, 0.28)',
    '0px 60px 86px rgba(0, 0, 0, 0.29)',
    '0px 64px 92px rgba(0, 0, 0, 0.3)',
    '0px 68px 98px rgba(0, 0, 0, 0.31)',
    '0px 72px 104px rgba(0, 0, 0, 0.32)',
    '0px 76px 110px rgba(0, 0, 0, 0.33)',
    '0px 80px 116px rgba(0, 0, 0, 0.34)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
        },
      },
    },
  },
});

export default theme;