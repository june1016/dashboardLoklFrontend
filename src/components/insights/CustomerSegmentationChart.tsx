import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  useTheme
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { CustomerSegment } from '../../api/insightsService';

// Props para el componente
interface CustomerSegmentationChartProps {
  segments: CustomerSegment[];
  period: string;
}

// Componente para la pestaña de visualización
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`segmentation-tabpanel-${index}`}
      aria-labelledby={`segmentation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CustomerSegmentationChart({ 
  segments, 
  period 
}: CustomerSegmentationChartProps) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Función para formatear valores monetarios
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Preparar datos para el gráfico de distribución de clientes
  const customerData = segments.map(segment => ({
    name: segment.name,
    value: segment.count,
    color: segment.color
  }));

  // Preparar datos para el gráfico de distribución de inversión
  const investmentData = segments.map(segment => ({
    name: segment.name,
    value: segment.investmentPercentage,
    color: segment.color,
    amount: segment.totalInvestment
  }));

  // Preparar datos para el gráfico de distribución de mora
  const overdueData = segments.filter(segment => segment.totalOverdue > 0).map(segment => ({
    name: segment.name,
    value: segment.overduePercentage,
    color: segment.color,
    amount: segment.totalOverdue
  }));

  // Manejar cambio de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Función para mapear el periodo a un texto descriptivo
  const getPeriodText = (period: string) => {
    switch(period) {
      case 'month': return 'el último mes';
      case 'quarter': return 'el último trimestre';
      case 'year': return 'el último año';
      case 'all': return 'todo el historial';
      default: return 'el período seleccionado';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Segmentación de Clientes por Comportamiento de Pago
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Análisis basado en {getPeriodText(period)}
      </Typography>

      {/* Tarjetas de resumen por segmento */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {segments.map((segment) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={segment.name}>
            <Paper
              sx={{
                p: 2,
                height: '100%',
                borderLeft: `4px solid ${segment.color}`,
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
                }
              }}
            >
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                {segment.name}
              </Typography>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {segment.count}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {segment.description}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <b>Inversión:</b> {segment.investmentPercentage}% del total
                </Typography>
                {segment.totalOverdue > 0 && (
                  <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <b>Mora:</b> {segment.overduePercentage}% del total
                  </Typography>
                )}
                {segment.averagePaymentDelay > 0 && (
                  <Typography variant="body2">
                    <b>Retraso medio:</b> {segment.averagePaymentDelay} días
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

{/* Pestañas para diferentes visualizaciones */}
<Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="tabs de segmentación de clientes"
        >
          <Tab label="Distribución de Clientes" />
          <Tab label="Distribución de Inversión" />
          {overdueData.length > 0 && <Tab label="Distribución de Mora" />}
          <Tab label="Tabla Detallada" />
        </Tabs>

        {/* Panel 1: Distribución de Clientes */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2, height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value, name) => [`${value} clientes`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </TabPanel>

        {/* Panel 2: Distribución de Inversión */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2, height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={investmentData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="name" type="category" width={120} />
                <RechartsTooltip
                  formatter={(value, name, props) => {
                    const entry = props.payload as any;
                    return [`${formatCurrency(entry.amount)} (${value}%)`, name];
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {investmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </TabPanel>

        {/* Panel 3: Distribución de Mora (solo si hay datos) */}
        {overdueData.length > 0 && (
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 2, height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overdueData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <RechartsTooltip
                    formatter={(value, name, props) => {
                      const entry = props.payload as any;
                      return [`${formatCurrency(entry.amount)} (${value}%)`, name];
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {overdueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </TabPanel>
        )}

        {/* Panel 4: Tabla Detallada */}
        <TabPanel value={tabValue} index={overdueData.length > 0 ? 3 : 2}>
          <Box sx={{ p: 2 }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="tabla de segmentación de clientes">
                <TableHead>
                  <TableRow>
                    <TableCell>Segmento</TableCell>
                    <TableCell align="right">Clientes</TableCell>
                    <TableCell align="right">% Clientes</TableCell>
                    <TableCell align="right">Inversión Total</TableCell>
                    <TableCell align="right">% Inversión</TableCell>
                    <TableCell align="right">Mora Total</TableCell>
                    <TableCell align="right">% Mora</TableCell>
                    <TableCell align="right">Retraso Promedio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {segments.map((segment) => (
                    <TableRow
                      key={segment.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box 
                            sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: segment.color 
                            }} 
                          />
                          {segment.name}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{segment.count}</TableCell>
                      <TableCell align="right">
                        {(segment.count / segments.reduce((sum, s) => sum + s.count, 0) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell align="right">{formatCurrency(segment.totalInvestment)}</TableCell>
                      <TableCell align="right">{segment.investmentPercentage}%</TableCell>
                      <TableCell align="right">{formatCurrency(segment.totalOverdue)}</TableCell>
                      <TableCell align="right">{segment.overduePercentage}%</TableCell>
                      <TableCell align="right">{segment.averagePaymentDelay} días</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </Paper>

      {/* Insights claves sobre segmentación */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Insights claves sobre segmentación de clientes
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Insight 1: Concentración de inversión */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Concentración de inversión
              </Typography>
              {segments.length > 0 && (
                <Typography variant="body2">
                  El {Math.max(...segments.map(s => s.investmentPercentage)).toFixed(1)}% de la inversión está concentrada en el segmento "{segments.reduce((prev, current) => {
                    return (prev.investmentPercentage > current.investmentPercentage) ? prev : current;
                  }).name}".
                </Typography>
              )}
            </Box>
          </Grid>
          
          {/* Insight 2: Concentración de mora */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Distribución de mora
              </Typography>
              {overdueData.length > 0 && (
                <Typography variant="body2">
                  El {Math.max(...overdueData.map(s => s.value)).toFixed(1)}% de la mora está concentrada en el segmento "{overdueData.reduce((prev, current) => {
                    return (prev.value > current.value) ? prev : current;
                  }).name}".
                </Typography>
              )}
            </Box>
          </Grid>
          
          {/* Insight 3: Comportamiento general */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Comportamiento general
              </Typography>
              {segments.length > 0 && (
                <Typography variant="body2">
                  El {((segments.find(s => s.name === 'Siempre puntuales')?.count || 0) / 
                       segments.reduce((sum, s) => sum + s.count, 0) * 100).toFixed(1)}% de los clientes 
                  tienen un excelente comportamiento de pago.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}