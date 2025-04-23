// src/data/mockData.ts

/**
 * Datos de ejemplo para las suscripciones según su estado
 */
export const subscriptionStatusData = [
    { 
      name: 'Activas', 
      value: 145, 
      description: 'Suscripciones actualmente en curso'
    },
    { 
      name: 'Finalizando Pronto', 
      value: 38, 
      description: 'Suscripciones con 3 cuotas o menos restantes'
    }
  ];
  
  /**
   * Datos de ejemplo para el gráfico de Dinero Esperado vs Real
   */
  export const getExpectedVsActualData = (isMobile: boolean) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const expectedValues = [25000000, 27000000, 28500000, 30000000, 32000000, 35000000, 38000000, 42000000, 45000000, 48000000, 52000000, 55000000];
    const actualValues = [24500000, 26800000, 27000000, 28500000, 31000000, 33000000, 37000000, 40000000, 43000000, 45500000, 49000000, 52000000];
    
    const data = months.map((month, index) => ({
      name: month,
      expected: expectedValues[index],
      actual: actualValues[index],
      difference: actualValues[index] - expectedValues[index]
    }));
  
    return isMobile ? data.filter((_, i) => i % 2 === 0) : data;
  };
  
  /**
   * Datos de ejemplo para el gráfico de Mora Mensual
   */
  export const getMonthlyOverdueData = (isMobile: boolean) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Valores mensuales
    const monthlyValues = [800000, 1200000, 950000, 1100000, 1500000, 1300000, 1600000, 1800000, 1400000, 1700000, 1900000, 2200000];
    
    // Calcular acumulado
    let accumulated = 0;
    const data = months.map((month, index) => {
      const monthly = monthlyValues[index];
      accumulated += monthly;
      return {
        name: month,
        monthly,
        accumulated
      };
    });
  
    return isMobile ? data.filter((_, i) => i % 2 === 0) : data;
  };
  
  /**
   * Datos de ejemplo para el gráfico de Mora por Proyecto
   */
  export const overdueByProjectData: Array<{
    name: string;
    amount: number;
    percentage: number;
  }> = [
    { name: 'Green Tower', amount: 1200000, percentage: 12 },
    { name: 'Blue Ocean', amount: 3500000, percentage: 35 },
    { name: 'Sunset Hills', amount: 2800000, percentage: 28 },
    { name: 'Mountain View', amount: 900000, percentage: 9 },
    { name: 'City Lofts', amount: 1600000, percentage: 16 }
  ];
  
  /**
   * Datos de ejemplo para las tarjetas de estadísticas
   */
  export const getStatsCardsData = (theme: any) => [
    {
      title: 'Ingresos Totales',
      value: '$45.231.890',
      change: '+20,1%',
      trend: 'up',
      icon: 'MoneyIcon',
      color: theme.palette.primary.main,
      gradientFrom: theme.palette.primary.main,
      gradientTo: theme.palette.primary.light
    },
    {
      title: 'Suscripciones',
      value: '2.350',
      change: '+12,5%',
      trend: 'up',
      icon: 'PeopleIcon',
      color: theme.palette.info.main,
      gradientFrom: theme.palette.info.main,
      gradientTo: theme.palette.info.light
    },
    {
      title: 'Ventas',
      value: '12.234',
      change: '+19,5%',
      trend: 'up',
      icon: 'CartIcon',
      color: theme.palette.secondary.main,
      gradientFrom: theme.palette.secondary.main,
      gradientTo: theme.palette.secondary.light
    },
    {
      title: 'Rendimiento',
      value: '49,65%',
      change: '-8,5%',
      trend: 'down',
      icon: 'ChartIcon',
      color: theme.palette.error.main,
      gradientFrom: theme.palette.error.main,
      gradientTo: theme.palette.error.light
    },
  ];
  
  /**
   * Datos de ejemplo para la tabla de suscripciones
   */
  export const subscriptionsTableData = [
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