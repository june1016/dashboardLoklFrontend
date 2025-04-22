import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useMobile } from '../../hooks/useMobile';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function OverviewChart() {
  const theme = useTheme();
  const isMobile = useMobile();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Datos de ejemplo (estos se reemplazarán con datos reales de la API)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map((month, index) => ({
      name: month,
      revenue: [18000, 22000, 19500, 24000, 25500, 27000, 29500, 32000, 31000, 34000, 36500, 38000][index],
      users: [1200, 1350, 1500, 1700, 1850, 2000, 2150, 2300, 2450, 2600, 2750, 2900][index],
    }));

    setChartData(isMobile ? data.filter((_, i) => i % 2 === 0) : data);
  }, [isMobile]);

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="name"
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            stroke={theme.palette.text.secondary}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              boxShadow: theme.shadows[3]
            }}
            formatter={(value, name) => {
              return name === 'revenue' 
                ? [`$${value.toLocaleString()}`, 'Revenue'] 
                : [value.toLocaleString(), 'Users'];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            activeDot={{ r: 8 }}
            dot={{
              stroke: theme.palette.primary.main,
              strokeWidth: 2,
              fill: theme.palette.background.paper,
              r: 4,
            }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="users"
            stroke={theme.palette.secondary.main}
            strokeWidth={3}
            dot={{
              stroke: theme.palette.secondary.main,
              strokeWidth: 2,
              fill: theme.palette.background.paper,
              r: 4,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}