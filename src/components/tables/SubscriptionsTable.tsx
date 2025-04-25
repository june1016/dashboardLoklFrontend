import { useState, useEffect, useCallback, memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Collapse,
  Box,
  Typography,
  TablePagination,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  useTheme,
  SelectChangeEvent,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  LocalOffer as LocalOfferIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { dashboardService } from '../../api/api';
import { useDataFetching } from '../../hooks/useDataFetching';

// Tipos para las suscripciones
interface Installment {
  id: number;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
}

interface Subscription {
  id: string;
  status: 'active' | 'completed' | 'ending_soon' | 'canceled';
  project: string;
  investment: number;
  units: number;
  startDate: string;
  endDate: string;
  totalInstallments: number;
  overdue: number;
  totalPaid: number;
  totalRemaining: number;
  email: string;
  installments: Installment[];
}

interface RowProps {
  row: Subscription;
}

// Componente para una fila expandible - memoizado para evitar rerenderizados
const Row = memo(function Row({ row }: RowProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  // Función para formatear fechas - memoizada
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  // Función para formatear montos - memoizada
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  // Función para obtener estilos basados en el estado - memoizada
  const getStatusStyles = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return {
          bgcolor: theme.palette.success.main,
          color: '#FFFFFF'
        };
      case 'completed':
        return {
          bgcolor: theme.palette.info.main,
          color: '#FFFFFF'
        };
      case 'ending_soon':
        return {
          bgcolor: theme.palette.warning.main,
          color: '#FFFFFF'
        };
      case 'canceled':
        return {
          bgcolor: theme.palette.error.main,
          color: '#FFFFFF'
        };
      default:
        return {
          bgcolor: theme.palette.grey[500],
          color: '#FFFFFF'
        };
    }
  }, [theme.palette]);

  // Estilos para el estado de las cuotas - memoizada
  const getInstallmentStatusStyles = useCallback((status: string) => {
    switch (status) {
      case 'paid':
        return {
          bgcolor: theme.palette.success.light,
          color: theme.palette.success.dark
        };
      case 'pending':
        return {
          bgcolor: theme.palette.warning.light,
          color: theme.palette.warning.dark
        };
      case 'overdue':
        return {
          bgcolor: theme.palette.error.light,
          color: theme.palette.error.dark
        };
      default:
        return {
          bgcolor: theme.palette.grey[300],
          color: theme.palette.grey[800]
        };
    }
  }, [theme.palette]);

  // Traducciones de estados
  const getStatusTranslation = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'completed':
        return 'Completada';
      case 'ending_soon':
        return 'Finalizando Pronto';
      case 'canceled':
        return 'Cancelada';
      case 'paid':
        return 'Pagada';
      case 'pending':
        return 'Pendiente';
      case 'overdue':
        return 'En mora';
      default:
        return status;
    }
  }, []);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expandir fila"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Chip 
            label={getStatusTranslation(row.status)} 
            size="small"
            sx={getStatusStyles(row.status)}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalOfferIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 18 }} />
            <span>{row.project}</span>
          </Box>
        </TableCell>
        <TableCell align="right">{formatCurrency(row.investment)}</TableCell>
        <TableCell align="center">{row.units}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <CalendarTodayIcon sx={{ color: theme.palette.success.main, mr: 1, fontSize: 16 }} />
              <Typography variant="body2">{formatDate(row.startDate)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ color: theme.palette.error.main, mr: 1, fontSize: 16 }} />
              <Typography variant="body2">{formatDate(row.endDate)}</Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell align="center">{row.totalInstallments}</TableCell>
        <TableCell align="right">
          {row.overdue > 0 ? (
            <Chip 
              label={formatCurrency(row.overdue)} 
              size="small"
              sx={{
                bgcolor: theme.palette.error.light,
                color: theme.palette.error.dark
              }}
            />
          ) : (
            <Chip 
              label="Sin mora" 
              size="small"
              sx={{
                bgcolor: theme.palette.success.light,
                color: theme.palette.success.dark
              }}
            />
          )}
        </TableCell>
        <TableCell align="right">{formatCurrency(row.totalPaid)}</TableCell>
        <TableCell align="right">{formatCurrency(row.totalRemaining)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalle de Cuotas
              </Typography>
              <Table size="small" aria-label="cuotas">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Fecha Vencimiento</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha de Pago</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.installments.map((installment) => (
                    <TableRow key={`installment-${installment.id}`}>
                      <TableCell component="th" scope="row">
                        {installment.id}
                      </TableCell>
                      <TableCell>{formatDate(installment.dueDate)}</TableCell>
                      <TableCell>{formatCurrency(installment.amount)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusTranslation(installment.status)}
                          size="small"
                          sx={getInstallmentStatusStyles(installment.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {installment.paymentDate ? formatDate(installment.paymentDate) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
});

// Interfaz para los filtros enviados a la API
interface ApiFilters {
  email?: string;
  status?: string;
  project?: string;
  overdueMin?: number;
  overdueMax?: number;
}

// Interfaz para los filtros del componente
interface FilterState {
  email: string;
  status: string;
  project: string;
  overdueRange: string;
}

function SubscriptionsTable() {
  const theme = useTheme();
  
  // Estado para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estado para filtros
  const [filters, setFilters] = useState<FilterState>({
    email: '',
    status: '',
    project: '',
    overdueRange: ''
  });
  
  // Estado para los filtros procesados que se envían a la API
  const [apiFilters, setApiFilters] = useState<ApiFilters>({});

  // Procesar los filtros para la API
  useEffect(() => {
    const newFilters: ApiFilters = {};
    
    if (filters.email) newFilters.email = filters.email;
    if (filters.status) newFilters.status = filters.status;
    if (filters.project) newFilters.project = filters.project;
    
    // Procesar rango de mora
    if (filters.overdueRange) {
      switch (filters.overdueRange) {
        case '0':
          newFilters.overdueMin = 0;
          newFilters.overdueMax = 0;
          break;
        case '1-500000':
          newFilters.overdueMin = 1;
          newFilters.overdueMax = 500000;
          break;
        case '500001-1000000':
          newFilters.overdueMin = 500001;
          newFilters.overdueMax = 1000000;
          break;
        case '1000001+':
          newFilters.overdueMin = 1000001;
          break;
      }
    }
    
    setApiFilters(newFilters);
  }, [filters]);

  // Usar el hook para obtener datos reales de la API
  const { data, loading, error } = useDataFetching<Subscription[]>({
    initialData: [],
    fetchFn: () => dashboardService.getSubscriptions(apiFilters),
    dependencies: [apiFilters]
  });

  // Manejar cambio de página - useCallback para evitar recreación en cada renderizado
  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  // Manejar cambio en filas por página
  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Manejar cambios en los filtros de texto
  const handleTextFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
    setPage(0); // Regresar a la primera página después de aplicar un filtro
  }, []);

  // Manejar cambios en los filtros de selección
  const handleSelectFilterChange = useCallback((event: SelectChangeEvent<string>) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name as string]: event.target.value
    }));
    setPage(0); // Regresar a la primera página después de aplicar un filtro
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filtros */}
      <Paper sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Email"
              name="email"
              value={filters.email}
              onChange={handleTextFilterChange}
              variant="outlined"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Estado</InputLabel>
              <Select
                labelId="status-filter-label"
                name="status"
                value={filters.status}
                label="Estado"
                onChange={handleSelectFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="active">Activa</MenuItem>
                <MenuItem value="ending_soon">Finalizando Pronto</MenuItem>
                <MenuItem value="completed">Completada</MenuItem>
                <MenuItem value="canceled">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Proyecto"
              name="project"
              value={filters.project}
              onChange={handleTextFilterChange}
              variant="outlined"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="overdue-range-filter-label">Rango de Mora</InputLabel>
              <Select
                labelId="overdue-range-filter-label"
                name="overdueRange"
                value={filters.overdueRange}
                label="Rango de Mora"
                onChange={handleSelectFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="0">Sin mora</MenuItem>
                <MenuItem value="1-500000">$1 - $500.000</MenuItem>
                <MenuItem value="500001-1000000">$500.001 - $1.000.000</MenuItem>
                <MenuItem value="1000001+">Más de $1.000.000</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              Error al cargar los datos: {error.message}
            </Alert>
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No se encontraron suscripciones con los filtros seleccionados
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="tabla de suscripciones">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Estado</TableCell>
                    <TableCell>Proyecto</TableCell>
                    <TableCell align="right">Inversión</TableCell>
                    <TableCell align="center">Unidades</TableCell>
                    <TableCell>Fechas</TableCell>
                    <TableCell align="center">Cuotas</TableCell>
                    <TableCell align="right">Mora</TableCell>
                    <TableCell align="right">Total Pagado</TableCell>
                    <TableCell align="right">Por Pagar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : data
                  ).map((row) => (
                    <Row 
                      key={`subscription-row-${row.id}`} 
                      row={row} 
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}

// Utilizamos memo para evitar renderizados innecesarios
export default memo(SubscriptionsTable);