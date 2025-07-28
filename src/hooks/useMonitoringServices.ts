import { useState, useEffect } from 'react';
import { Service } from '../types';
import { apiService } from '../services/api';

interface UseMonitoringServicesResult {
  data: Service[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useMonitoringServices = (): UseMonitoringServicesResult => {
  const [data, setData] = useState<Service[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const services = await apiService.getMonitoringServices();
        console.log('All services:', services);
        console.log('Services with descriptions:', services.filter(s => s.description));
        setData(services);
      } catch (err) {
        setError('Failed to fetch monitoring services');
        console.error('Error fetching monitoring services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { data, isLoading, error };
}; 