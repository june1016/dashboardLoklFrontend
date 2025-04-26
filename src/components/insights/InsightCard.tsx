// src/components/insights/InsightCard.tsx
//@ts-ignore
import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, Divider } from '@mui/material';
import { Warning as WarningIcon, Info as InfoIcon, PriorityHigh as HighPriorityIcon } from '@mui/icons-material';
import { Insight } from '../../api/insightsService';

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  // Determinar el icono y color basado en la severidad
  const getSeverityProps = () => {
    switch (insight.severity) {
      case 'high':
        return {
          icon: <HighPriorityIcon />,
          color: 'error',
          label: 'Alta prioridad'
        };
      case 'medium':
        return {
          icon: <WarningIcon />,
          color: 'warning',
          label: 'Media prioridad'
        };
      default:
        return {
          icon: <InfoIcon />,
          color: 'info',
          label: 'Información'
        };
    }
  };

  const { icon, color, label } = getSeverityProps();

  return (
    <Card 
      elevation={2} 
      sx={{ 
        mb: 2, 
        borderLeft: 4, 
        borderColor: `${color}.main`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {insight.title}
          </Typography>
          <Chip 
            icon={icon} 
            label={label} 
            size="small" 
            color={color as any}
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {insight.description}
        </Typography>
        
        {insight.actionable && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Recomendación:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {insight.recommendation}
              </Typography>
              <Button size="small" variant="outlined" color={color as any}>
                Tomar acción
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}