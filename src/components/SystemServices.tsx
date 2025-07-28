import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import ServiceList from './ServiceList';
import { Service } from '../types';
import { apiService } from '../services/api';

export const SystemServices: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (!systemId) return;
      
      console.log('Fetching services for system:', systemId);
      try {
        setIsLoading(true);
        const data = await apiService.getServicesBySystem(systemId);
        console.log('Received services data:', data);
        console.log('Services with qg_status:', data.map(s => ({
          name: s.service_name,
          status: s.qg_status,
          raw: s
        })));
        setServices(data);
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to load system services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [systemId]);

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
          Loading system services...
        </Typography>
      </Box>
    );
  }

  if (error || !services) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Failed to load system services'}
        </Alert>
      </Box>
    );
  }

  if (!systemId) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">
          System ID is missing
        </Alert>
      </Box>
    );
  }

  return <ServiceList services={services} systemName={systemId} />;
}; 