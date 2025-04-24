import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import theme from './theme/theme';
import './styles/global.css';
import { AppProvider } from './context/AppContext';

// Implementamos lazy loading para todas las páginas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage'));
const OverduePage = lazy(() => import('./pages/OverduePage'));
const AutomationPage = lazy(() => import('./pages/AutomationPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Suspense fallback={
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
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/overdue" element={<OverduePage />} />
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;