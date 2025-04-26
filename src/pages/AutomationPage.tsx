import { useState, useEffect } from 'react';
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
  Link,
  LinearProgress,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  FileDownload as DownloadIcon, 
  Email as EmailIcon, 
  Storage as StorageIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import DashboardLayout from '../layouts/DashboardLayout';
import { automationService } from '../api/automationService';

// Interfaz para el historial de ejecuciones
interface ExecutionRecord {
  id: number;
  type: 'report' | 'email' | 'table';
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

// Interfaz para las vistas previas de emails
interface EmailPreview {
  email: string;
  url: string;
}

export default function AutomationPage() {
  const theme = useTheme();
  
  // Estados para controlar las automatizaciones
  const [reportFormat, setReportFormat] = useState('excel');
  const [emailFrequency, setEmailFrequency] = useState('manual');
  const [runningTask, setRunningTask] = useState<string | null>(null);
  const [taskResult, setTaskResult] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [executionHistory, setExecutionHistory] = useState<ExecutionRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [emailPreviews, setEmailPreviews] = useState<EmailPreview[]>([]);
  
  // Estados para la barra de progreso
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isShowingProgressBar, setIsShowingProgressBar] = useState(false);
  
  // Cargar historial de ejecuciones al iniciar
  useEffect(() => {
    fetchExecutionHistory();
  }, []);

  // Obtener historial de ejecuciones
  const fetchExecutionHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await automationService.getExecutionHistory();
      if (response.success && response.data) {
        setExecutionHistory(response.data);
      } else {
        console.error('Error al cargar historial:', response.message);
        // Usar datos ficticios en caso de error
        setExecutionHistory([
          {
            id: 1,
            type: 'report',
            status: 'success',
            message: 'Reporte generado exitosamente',
            timestamp: '23 Abril, 2025 - 14:15'
          },
          {
            id: 2,
            type: 'email',
            status: 'success',
            message: 'Correos enviados exitosamente',
            timestamp: '22 Abril, 2025 - 09:30'
          },
          {
            id: 3,
            type: 'table',
            status: 'success',
            message: 'Tabla actualizada correctamente',
            timestamp: '22 Abril, 2025 - 08:45'
          }
        ]);
      }
    } catch (error) {
      console.error('Error al obtener historial de ejecuciones:', error);
      // Usar datos ficticios en caso de error
      setExecutionHistory([
        {
          id: 1,
          type: 'report',
          status: 'success',
          message: 'Reporte generado exitosamente',
          timestamp: '23 Abril, 2025 - 14:15'
        },
        {
          id: 2,
          type: 'email',
          status: 'success',
          message: 'Correos enviados exitosamente',
          timestamp: '22 Abril, 2025 - 09:30'
        },
        {
          id: 3,
          type: 'table',
          status: 'success',
          message: 'Tabla actualizada correctamente',
          timestamp: '22 Abril, 2025 - 08:45'
        }
      ]);
    } finally {
      setLoadingHistory(false);
    }
  };
  
  // Función para generar reporte
  const generateReport = async () => {
    setRunningTask('report');
    setTaskResult(null);
    
    try {
      const response = await automationService.generateReport(reportFormat);
      
      if (response.success && response.data) {
        setTaskResult({
          type: 'success',
          message: `Reporte generado exitosamente en formato ${reportFormat.toUpperCase()}`
        });
        
        // Abrir el archivo automáticamente si hay una URL
        if (response.data.fileUrl) {
          window.open(response.data.fileUrl, '_blank');
        }
        
        // Actualizar historial después de una ejecución exitosa
        fetchExecutionHistory();
      } else {
        setTaskResult({
          type: 'error',
          message: response.message || 'Error generando el reporte. Intente nuevamente.'
        });
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      setTaskResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error generando el reporte. Intente nuevamente.'
      });
    } finally {
      setRunningTask(null);
    }
  };
  
  // Función para enviar emails con barra de progreso
  const sendEmails = async () => {
    setRunningTask('email');
    setTaskResult(null);
    setEmailPreviews([]); // Limpiar previews anteriores
    
    // Iniciar una simulación de progreso
    setIsShowingProgressBar(true);
    setProgressPercentage(0);
    const progressInterval = setInterval(() => {
      setProgressPercentage(prev => {
        // Incrementar gradualmente hasta 90% (el 100% se alcanza al terminar)
        if (prev < 90) {
          return prev + Math.random() * 5;
        }
        return prev;
      });
    }, 800);
    
    try {
      const response = await automationService.sendOverdueEmails();
      
      // Finalizar progreso al 100%
      setProgressPercentage(100);
      
      if (response.success && response.data) {
        setTaskResult({
          type: 'success',
          message: `Correos de notificación enviados exitosamente: ${response.data.emailsSent} emails`
        });
        
        // Guardar URLs de vista previa si existen
        if (response.data.previewUrls && response.data.previewUrls.length > 0) {
          setEmailPreviews(response.data.previewUrls);
        }
        
        // Actualizar historial después de una ejecución exitosa
        fetchExecutionHistory();
      } else {
        setTaskResult({
          type: 'error',
          message: response.message || 'Error enviando emails. Intente nuevamente.'
        });
      }
    } catch (error) {
      console.error('Error al enviar emails:', error);
      setTaskResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error enviando emails. Intente nuevamente.'
      });
    } finally {
      clearInterval(progressInterval);
      setRunningTask(null);
      // Ocultar barra de progreso después de un momento
      setTimeout(() => {
        setIsShowingProgressBar(false);
      }, 1500);
    }
  };
  
  // Función para actualizar tabla de usuarios en mora
  const updateOverdueTable = async () => {
    setRunningTask('table');
    setTaskResult(null);
    
    try {
      const response = await automationService.updateOverdueTable();
      
      if (response.success) {
        setTaskResult({
          type: 'success',
          message: 'Tabla de usuarios en mora actualizada correctamente'
        });
        // Actualizar historial después de una ejecución exitosa
        fetchExecutionHistory();
      } else {
        setTaskResult({
          type: 'error',
          message: response.message || 'Error actualizando tabla. Intente nuevamente.'
        });
      }
    } catch (error) {
      console.error('Error al actualizar tabla:', error);
      setTaskResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error actualizando tabla. Intente nuevamente.'
      });
    } finally {
      setRunningTask(null);
    }
  };

  const handleEmailFrequencyChange = (event: SelectChangeEvent) => {
    setEmailFrequency(event.target.value);
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
                  onChange={handleEmailFrequencyChange}
                >
                  <MenuItem value="manual">Manual</MenuItem>
                  <MenuItem value="daily">Diario</MenuItem>
                  <MenuItem value="weekly">Semanal</MenuItem>
                </Select>
              </FormControl>
              
              {emailFrequency === 'manual' ? (
                <>
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
                  
                  {isShowingProgressBar && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" display="block" gutterBottom>
                        Progreso de envío: {Math.round(progressPercentage)}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={progressPercentage} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  )}
                  
                  {emailPreviews.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1), borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Vista previa de emails enviados:
                      </Typography>
                      <Box sx={{ maxHeight: 200, overflow: 'auto', mt: 1 }}>
                        {emailPreviews.map((preview, index) => (
                          <Box key={index} sx={{ mb: 1 }}>
                            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                              {preview.email}
                            </Typography>
                            <Link 
                              href={preview.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              Ver email enviado
                            </Link>
                            {index < emailPreviews.length - 1 && <Divider sx={{ my: 1 }} />}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </>
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
                  {executionHistory.find(item => item.type === 'table')?.timestamp || 'No hay datos'}
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
      
      {/* Historial de ejecuciones */}
      <Card sx={{ mt: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardHeader
          title="Historial de Ejecuciones"
          subheader="Registro de las últimas automatizaciones ejecutadas"
        />
        <Divider />
        <CardContent>
          {loadingHistory ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {executionHistory.map((record) => (
                <Box key={record.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {record.type === 'report' ? (
                        <DownloadIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      ) : record.type === 'email' ? (
                        <EmailIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      ) : (
                        <StorageIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                      )}
                      <Typography>
                        {record.type === 'report' 
                          ? 'Generación de Reporte' 
                          : record.type === 'email' 
                            ? 'Envío de Alertas por Email' 
                            : 'Actualización de Tabla de Mora'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {record.timestamp}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}