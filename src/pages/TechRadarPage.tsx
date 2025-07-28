import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import TechRadar from '../components/TechRadar';
import { useMonitoringServices } from '../hooks/useMonitoringServices';

const TechRadarPage: React.FC = () => {
  const { data: services, isLoading, error } = useMonitoringServices();

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading technology data...
        </Typography>
      </Box>
    );
  }

  if (error || !services) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Failed to load technology data'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <TechRadar services={services} />
    </Box>
  );
};

export default TechRadarPage; 