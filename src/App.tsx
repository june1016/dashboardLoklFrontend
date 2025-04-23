import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import theme from './theme/theme';
// Importar los estilos globales
import './styles/global.css';

// Implementamos lazy loading para mejorar el rendimiento inicial
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={
          // Spinner centrado para mejor experiencia durante la carga
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              bgcolor: 'background.default'
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        }>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;