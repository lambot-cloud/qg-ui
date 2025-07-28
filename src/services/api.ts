import axios from 'axios';
import { Service, InformationSystem } from '../types';
import { ServiceInfra } from '../types/service';
import { TrustedImage } from '../types/trusted-images';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export const api = axios.create({
  baseURL: API_BASE_URL,
  params: {
    token: API_TOKEN,
  },
});

export interface MonitoringService {
  service_name: string;
  description: string;
  qg_status: string;
  framework?: string;
  last_check_date?: string;
}

export interface ReleaseRequest {
  information_system: string;
  service_name: string;
  cm_key: string;
}

export class ApiService {
  async getMonitoringServices(): Promise<Service[]> {
    try {
      const response = await api.get('/api/v1/monitoring/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching monitoring services:', error);
      throw error;
    }
  }

  async getSystems(): Promise<InformationSystem[]> {
    const response = await api.get('/api/v1/monitoring/info_system');
    return response.data;
  }

  async getServicesBySystem(systemId: string): Promise<Service[]> {
    const response = await api.get(`/api/v1/monitoring/services/${systemId}`);
    return response.data;
  }

  async getServiceDetails(systemId: string, serviceName: string): Promise<Service> {
    const response = await api.get(`/api/v1/monitoring/services/${systemId}/${serviceName}`);
    return response.data;
  }

  async createReleaseRequest(request: ReleaseRequest): Promise<void> {
    await api.post('/api/v1/release/cm/set', request);
  }

  async updateService(service: Service): Promise<void> {
    await api.post('/api/v1/monitoring/update', service);
  }

  async deleteService(informationSystem: string, serviceName: string): Promise<void> {
    await api.delete('/api/v1/monitoring/services', {
      data: {
        information_system: informationSystem,
        service_name: serviceName,
      },
    });
  }

  async getServicesInfra(system: string): Promise<ServiceInfra[]> {
    const response = await api.get(`/api/v1/infrastructure/services/${system}`);
    return response.data;
  }

  async getServiceInfra(system: string, serviceName: string): Promise<ServiceInfra> {
    const response = await api.post('/api/v1/infrastructure/service/get', {
      information_system: system,
      service_name: serviceName,
    });
    return response.data;
  }

  async setServiceInfra(serviceInfra: ServiceInfra): Promise<void> {
    await api.post('/api/v1/infrastructure/service/set', serviceInfra);
  }

  async getTrustedImages(): Promise<TrustedImage[]> {
    try {
      const response = await api.get<TrustedImage[]>('/api/v1/trusted/images/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching trusted images:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 