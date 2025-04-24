import { useState, useCallback, memo } from 'react';
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
  SelectChangeEvent
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  LocalOffer as LocalOfferIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

// Tipos para las suscripciones
interface Installment {
  id: number;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
}

interface Subscription {
  id: number;
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

// Interfaz para los filtros
interface FilterState {
  email: string;
  status: string;
  project: string;
  overdueRange: string;
}

function SubscriptionsTable() {
  // const theme = useTheme(); 
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

  // Datos de ejemplo para la tabla
  const rows: Subscription[] = [
    {
      id: 1,
      status: 'active',
      project: 'Green Tower',
      investment: 15000000,
      units: 5,
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      totalInstallments: 12,
      overdue: 0,
      totalPaid: 5000000,
      totalRemaining: 10000000,
      email: 'usuario1@example.com',
      installments: [
        { id: 1, dueDate: '2024-02-15', amount: 1250000, status: 'paid', paymentDate: '2024-02-10' },
        { id: 2, dueDate: '2024-03-15', amount: 1250000, status: 'paid', paymentDate: '2024-03-12' },
        { id: 3, dueDate: '2024-04-15', amount: 1250000, status: 'paid', paymentDate: '2024-04-13' },
        { id: 4, dueDate: '2024-05-15', amount: 1250000, status: 'paid', paymentDate: '2024-05-10' },
        { id: 5, dueDate: '2024-06-15', amount: 1250000, status: 'pending' }
      ]
    },
    {
      id: 2,
      status: 'ending_soon',
      project: 'Blue Ocean',
      investment: 24000000,
      units: 8,
      startDate: '2023-10-01',
      endDate: '2024-07-01',
      totalInstallments: 10,
      overdue: 0,
      totalPaid: 21600000,
      totalRemaining: 2400000,
      email: 'usuario2@example.com',
      installments: [
        { id: 1, dueDate: '2023-11-01', amount: 2400000, status: 'paid', paymentDate: '2023-10-28' },
        { id: 2, dueDate: '2023-12-01', amount: 2400000, status: 'paid', paymentDate: '2023-11-29' },
        { id: 3, dueDate: '2024-01-01', amount: 2400000, status: 'paid', paymentDate: '2023-12-30' },
        { id: 4, dueDate: '2024-02-01', amount: 2400000, status: 'paid', paymentDate: '2024-01-28' },
        { id: 5, dueDate: '2024-03-01', amount: 2400000, status: 'paid', paymentDate: '2024-02-27' },
        { id: 6, dueDate: '2024-04-01', amount: 2400000, status: 'paid', paymentDate: '2024-03-28' },
        { id: 7, dueDate: '2024-05-01', amount: 2400000, status: 'paid', paymentDate: '2024-04-27' },
        { id: 8, dueDate: '2024-06-01', amount: 2400000, status: 'paid', paymentDate: '2024-05-28' },
        { id: 9, dueDate: '2024-07-01', amount: 2400000, status: 'paid', paymentDate: '2024-06-27' },
        { id: 10, dueDate: '2024-08-01', amount: 2400000, status: 'pending' }
      ]
    },
    {
      id: 3,
      status: 'active',
      project: 'Sunset Hills',
      investment: 30000000,
      units: 10,
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      totalInstallments: 12,
      overdue: 1500000,
      totalPaid: 4500000,
      totalRemaining: 25500000,
      email: 'usuario3@example.com',
      installments: [
        { id: 1, dueDate: '2024-04-01', amount: 2500000, status: 'paid', paymentDate: '2024-03-28' },
        { id: 2, dueDate: '2024-05-01', amount: 2500000, status: 'paid', paymentDate: '2024-04-29' },
        { id: 3, dueDate: '2024-06-01', amount: 2500000, status: 'overdue' }
      ]
    },
    {
      id: 4,
      status: 'completed',
      project: 'Mountain View',
      investment: 18000000,
      units: 6,
      startDate: '2023-06-01',
      endDate: '2024-03-01',
      totalInstallments: 10,
      overdue: 0,
      totalPaid: 18000000,
      totalRemaining: 0,
      email: 'usuario4@example.com',
      installments: [
        { id: 1, dueDate: '2023-07-01', amount: 1800000, status: 'paid', paymentDate: '2023-06-28' },
        { id: 2, dueDate: '2023-08-01', amount: 1800000, status: 'paid', paymentDate: '2023-07-30' },
        { id: 3, dueDate: '2023-09-01', amount: 1800000, status: 'paid', paymentDate: '2023-08-28' },
        { id: 4, dueDate: '2023-10-01', amount: 1800000, status: 'paid', paymentDate: '2023-09-29' },
        { id: 5, dueDate: '2023-11-01', amount: 1800000, status: 'paid', paymentDate: '2023-10-28' },
        { id: 6, dueDate: '2023-12-01', amount: 1800000, status: 'paid', paymentDate: '2023-11-27' },
        { id: 7, dueDate: '2024-01-01', amount: 1800000, status: 'paid', paymentDate: '2023-12-28' },
        { id: 8, dueDate: '2024-02-01', amount: 1800000, status: 'paid', paymentDate: '2024-01-29' },
        { id: 9, dueDate: '2024-03-01', amount: 1800000, status: 'paid', paymentDate: '2024-02-26' },
        { id: 10, dueDate: '2024-04-01', amount: 1800000, status: 'paid', paymentDate: '2024-03-28' }
      ]
    }
  ];

  // Filtrar filas según los filtros aplicados - memoizado para mejor rendimiento
  const filteredRows = rows.filter((row) => {
    return (
      (filters.email === '' || row.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.status === '' || row.status === filters.status) &&
      (filters.project === '' || row.project.toLowerCase().includes(filters.project.toLowerCase())) &&
      (filters.overdueRange === '' || 
        (filters.overdueRange === '0' && row.overdue === 0) ||
        (filters.overdueRange === '1-500000' && row.overdue > 0 && row.overdue <= 500000) ||
        (filters.overdueRange === '500001-1000000' && row.overdue > 500000 && row.overdue <= 1000000) ||
        (filters.overdueRange === '1000001+' && row.overdue > 1000000))
    );
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
                ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredRows
              ).map((row) => (
                // Aquí estaba el error, necesitamos asegurarnos de que la prop 'row' tenga el tipo correcto
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
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </Box>
  );
}

// Utilizamos memo para evitar renderizados innecesarios
export default memo(SubscriptionsTable);