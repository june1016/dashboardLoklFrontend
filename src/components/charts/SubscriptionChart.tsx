import { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

export default function SubscriptionChart() {
  const theme = useTheme();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Datos de ejemplo (estos se reemplazarán con datos reales de la API)
    const data = [
      { name: 'Pro Plan', value: 45 },
      { name: 'Enterprise', value: 25 },
      { name: 'Basic', value: 20 },
      { name: 'Free Trial', value: 10 },
    ];
    setChartData(data);
  }, []);

  // Colores basados en la paleta del tema
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
    theme.palette.warning.main,
  ];

  // Renderizado personalizado para la etiqueta
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: any) => {
    if (percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="#FFFFFF"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Box sx={{ color: payload[0].color, fontWeight: 600, mb: 0.5 }}>
            {payload[0].name}
          </Box>
          <Box>
            <span style={{ fontWeight: 600 }}>{payload[0].value}</span>
            <span style={{ color: theme.palette.text.secondary, marginLeft: 4 }}>
              ({percentage}%)
            </span>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
          >
            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 20 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}