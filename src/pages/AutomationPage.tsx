import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardHeader, 
  CardContent, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  useTheme 
} from '@mui/material';
import { 
  FileDownload as DownloadIcon, 
  Email as EmailIcon, 
  Storage as StorageIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import DashboardLayout from '../layouts/DashboardLayout';

export default function AutomationPage() {
  const theme = useTheme();
  
  // Estados para controlar las automatizaciones
  const [reportFormat, setReportFormat] = useState('excel');
  const [emailFrequency, setEmailFrequency] = useState('manual');
  const [runningTask, setRunningTask] = useState<string | null>(null);
  const [taskResult, setTaskResult] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Simulaciones de procesos de automatización
  const generateReport = () => {
    setRunningTask('report');
    setTaskResult(null);
    
    // Simulamos procesamiento
    setTimeout(() => {
      setRunningTask(null);
      setTaskResult({
        type: 'success',
        message: `Reporte generado exitosamente en formato ${reportFormat.toUpperCase()}`
      });
    }, 2000);
  };
  
  const sendEmails = () => {
    setRunningTask('email');
    setTaskResult(null);
    
    // Simulamos procesamiento
    setTimeout(() => {
      setRunningTask(null);
      setTaskResult({
        type: 'success',
        message: 'Correos de notificación enviados exitosamente a usuarios en mora'
      });
    }, 2000);
  };
  
  const updateOverdueTable = () => {
    setRunningTask('table');
    setTaskResult(null);
    
    // Simulamos procesamiento
    setTimeout(() => {
      setRunningTask(null);
      setTaskResult({
        type: 'success',
        message: 'Tabla de usuarios en mora actualizada correctamente'
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mt: 14, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Automatizaciones
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Control y ejecución de procesos automáticos
        </Typography>
      </Box>

      {/* Alertas de resultados */}
      {taskResult && (
        <Alert 
          severity={taskResult.type} 
          sx={{ mb: 3 }}
          onClose={() => setTaskResult(null)}
        >
          <AlertTitle>{taskResult.type === 'success' ? 'Éxito' : 'Error'}</AlertTitle>
          {taskResult.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Automatización 1: Reporte de Mora */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ boxShadow: 2, borderRadius: 2, height: '100%' }}>
            <CardHeader
              title="Generar Reporte de Mora"
              subheader="Exportar informe de suscripciones en mora"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="report-format-label">Formato</InputLabel>
                <Select
                  labelId="report-format-label"
                  value={reportFormat}
                  label="Formato"
                  onChange={(e) => setReportFormat(e.target.value)}
                >
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={runningTask === 'report' ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                onClick={generateReport}
                disabled={!!runningTask}
              >
                {runningTask === 'report' ? 'Generando...' : 'Generar Reporte'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Automatización 2: Alertas de Cobro */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ boxShadow: 2, borderRadius: 2, height: '100%' }}>
            <CardHeader
              title="Alertas de Cobro"
              subheader="Envío de correos a usuarios en mora"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="email-frequency-label">Frecuencia</InputLabel>
                <Select
                  labelId="email-frequency-label"
                  value={emailFrequency}
                  label="Frecuencia"
                  onChange={(e) => setEmailFrequency(e.target.value)}
                >
                  <MenuItem value="manual">Manual</MenuItem>
                  <MenuItem value="daily">Diario</MenuItem>
                  <MenuItem value="weekly">Semanal</MenuItem>
                </Select>
              </FormControl>
              
              {emailFrequency === 'manual' ? (
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={runningTask === 'email' ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
                  onClick={sendEmails}
                  disabled={!!runningTask}
                >
                  {runningTask === 'email' ? 'Enviando...' : 'Enviar Alertas'}
                </Button>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Ejecución automática:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                    <Typography variant="body2" fontWeight="bold">
                      {emailFrequency === 'daily' ? 'Cada día a las 8:00 AM' : 'Cada lunes a las 8:00 AM'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Automatización 3: Tabla de Usuarios en Mora */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ boxShadow: 2, borderRadius: 2, height: '100%' }}>
            <CardHeader
              title="Registro de Usuarios en Mora"
              subheader="Actualización de tabla Users_in_Mora"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.info.dark}, ${theme.palette.info.main})`,
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Última actualización:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  23 Abril, 2025 - 15:30
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                color="info"
                fullWidth
                startIcon={runningTask === 'table' ? <CircularProgress size={20} color="inherit" /> : <StorageIcon />}
                onClick={updateOverdueTable}
                disabled={!!runningTask}
              >
                {runningTask === 'table' ? 'Actualizando...' : 'Actualizar Tabla'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Historia de ejecuciones */}
      <Card sx={{ mt: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardHeader
          title="Historial de Ejecuciones"
          subheader="Registro de las últimas automatizaciones ejecutadas"
        />
        <Divider />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DownloadIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography>Generación de Reporte Excel</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                23 Abril, 2025 - 14:15
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                <Typography>Envío de Alertas por Email</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                22 Abril, 2025 - 09:30
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StorageIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                <Typography>Actualización de Tabla de Mora</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                22 Abril, 2025 - 08:45
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}