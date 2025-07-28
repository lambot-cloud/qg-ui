import { useState, useEffect } from 'react';
import { ServiceWithInfra } from '../types/service';
import { apiService } from '../services/api';

export const useServices = (system: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceWithInfra[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!system) {
        setServices([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching services for system:', system);
        
        const [servicesData, infraData] = await Promise.all([
          apiService.getServicesBySystem(system),
          apiService.getServicesInfra(system)
        ]);

        console.log('Received services data:', servicesData);
        console.log('Received infra data:', infraData);

        // Create a map of infrastructure data by service name
        const infraMap = new Map(infraData.map(infra => [infra.service_name, infra]));

        // Combine service data with infrastructure data
        const combinedServices = servicesData.map(service => ({
          ...service,
          platform: infraMap.get(service.service_name)?.platform ?? null,
          zone: infraMap.get(service.service_name)?.zone ?? null,
        }));

        console.log('Combined services:', combinedServices);
        setServices(combinedServices);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [system]);

  return { services, loading, error };
}; 