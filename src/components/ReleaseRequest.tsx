import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  SelectChangeEvent,
  AppBar,
  Toolbar
} from '@mui/material';
import { apiService } from '../services/api';
import { Service as ServiceType } from '../types/service';
import { InformationSystem } from '../types';

interface UniqueSystem {
  information_system: string;
  services: InformationSystem[];
}

interface ReleaseRequestData {
  information_system: string;
  service_name: string;
  cm_key: string;
}

const ReleaseRequest: React.FC = () => {
  const [systems, setSystems] = useState<UniqueSystem[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogSeverity, setDialogSeverity] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState<ReleaseRequestData>({
    information_system: '',
    service_name: '',
    cm_key: '',
  });

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSystems();
      
      // Group services by information system
      const systemMap = new Map<string, InformationSystem[]>();
      data.forEach(system => {
        const existing = systemMap.get(system.information_system) || [];
        systemMap.set(system.information_system, [...existing, system]);
      });

      // Convert map to array of unique systems
      const uniqueSystems = Array.from(systemMap.entries()).map(([information_system, services]) => ({
        information_system,
        services
      }));

      setSystems(uniqueSystems);
    } catch (err) {
      setError('Failed to fetch information systems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (systemId: string) => {
    try {
      const data = await apiService.getServicesBySystem(systemId);
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to fetch services');
    }
  };

  const handleSystemChange = async (event: SelectChangeEvent<string>) => {
    const systemId = event.target.value;
    setFormData(prevData => ({
      ...prevData,
      information_system: systemId,
      service_name: '', // Reset service selection when system changes
    }));

    if (systemId) {
      await fetchServices(systemId);
    } else {
      setServices([]);
    }
  };

  const handleServiceChange = (event: SelectChangeEvent<string>) => {
    setFormData(prevData => ({
      ...prevData,
      service_name: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await apiService.createReleaseRequest(formData);
      setDialogMessage('СЗ указан успешно');
      setDialogSeverity('success');
      setDialogOpen(true);
      // Reset form
      setFormData({
        information_system: '',
        service_name: '',
        cm_key: '',
      });
      setServices([]);
    } catch (err) {
      setDialogMessage('Убедитесь что вы ввели правильный ключ CM');
      setDialogSeverity('error');
      setDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <AppBar 
        position="static" 
        sx={{ 
          mb: 4,
          bgcolor: 'background.paper',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            Release Request
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Create Release Request
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select a system and service to create a release request
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ 
                display: 'grid',
                gap: 3,
                maxWidth: 600,
                margin: '0 auto',
                mt: 3
              }}>
                <FormControl>
                  <InputLabel>Information System</InputLabel>
                  <Select
                    value={formData.information_system}
                    label="Information System"
                    onChange={handleSystemChange}
                    required
                  >
                    <MenuItem value="">
                      <em>Select an Information System</em>
                    </MenuItem>
                    {systems.map((system) => (
                      <MenuItem 
                        key={system.information_system} 
                        value={system.information_system}
                      >
                        {system.information_system}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <InputLabel>Service Name</InputLabel>
                  <Select
                    value={formData.service_name}
                    label="Service Name"
                    onChange={handleServiceChange}
                    disabled={!formData.information_system}
                    required
                  >
                    <MenuItem value="">
                      <em>Select a Service</em>
                    </MenuItem>
                    {services.map((service) => (
                      <MenuItem 
                        key={service.service_name} 
                        value={service.service_name}
                      >
                        {service.service_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="CM Key"
                  value={formData.cm_key}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData(prevData => ({ ...prevData, cm_key: e.target.value }))
                  }
                  required
                />

                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Submit Release Request
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>
          {dialogSeverity === 'success' ? 'Success' : 'Error'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReleaseRequest; 