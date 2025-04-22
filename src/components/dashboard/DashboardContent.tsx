import { Box } from '@mui/material';
import React from 'react';

interface DashboardContentProps {
  children: React.ReactNode;
}

export default function DashboardContent({ children }: DashboardContentProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        mt: -8, // Eleva el contenido para que se superponga al header
        px: 4,
        pb: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      {children}
    </Box>
  );
}