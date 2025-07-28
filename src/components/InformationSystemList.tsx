import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { 
  Info as InfoIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Service } from '../types';

interface StatusCounts {
  passed: number;
  blocked: number;
  total: number;
}

interface UniqueSystem {
  information_system: string;
  services: Service[];
  statusCounts?: StatusCounts;
}

type ViewMode = 'grid' | 'list';

const getStatusCounts = (services: Service[]): StatusCounts => {
  return {
    passed: services.filter(service => service.qg_status?.toLowerCase() === 'passed').length,
    blocked: services.filter(service => service.qg_status?.toLowerCase() === 'blocked').length,
    total: services.length
  };
};

export const InformationSystemList: React.FC = () => {
  const navigate = useNavigate();
  const [systems, setSystems] = useState<UniqueSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const data = await apiService.getSystems();
      
      // Group services by information system
      const systemMap = new Map<string, any[]>();
      data.forEach(system => {
        const existing = systemMap.get(system.information_system) || [];
        systemMap.set(system.information_system, [...existing, system]);
      });

      // Convert map to array of unique systems
      const uniqueSystems = Array.from(systemMap.entries()).map(([information_system, services]) => ({
        information_system,
        services
      }));

      // Fetch status counts for each system
      const systemsWithCounts = await Promise.all(
        uniqueSystems.map(async (system) => {
          try {
            const systemServices = await apiService.getServicesBySystem(system.information_system);
            return {
              ...system,
              statusCounts: getStatusCounts(systemServices)
            };
          } catch (err) {
            console.error(`Error fetching services for ${system.information_system}:`, err);
            return system;
          }
        })
      );

      setSystems(systemsWithCounts);
    } catch (err) {
      setError('Failed to fetch information systems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSystems = useMemo(() => {
    if (!searchQuery || !systems) return systems || [];
    
    const query = searchQuery.toLowerCase();
    return systems.filter(system => 
      (system.information_system || '').toLowerCase().includes(query) ||
      system.services.some(service => 
        (service.service_name || '').toLowerCase().includes(query) ||
        (service.description || '').toLowerCase().includes(query)
      )
    );
  }, [systems, searchQuery]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredSystems.map((system) => {
        const statusCounts = system.statusCounts || { passed: 0, blocked: 0, total: 0 };
        
        return (
          <Grid item xs={12} md={6} lg={4} key={system.information_system}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4],
                },
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/system/${system.information_system}`)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="div" sx={{ 
                    flex: 1, 
                    mr: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {system.information_system}
                  </Typography>
                  <Tooltip title="View System Details">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/system/${system.information_system}`);
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Services: {statusCounts.total}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} justifyContent="center">
                  <Chip 
                    label={`Passed: ${statusCounts.passed}`}
                    color="success"
                    size="small"
                    sx={{ minWidth: 90 }}
                  />
                  <Chip 
                    label={`Blocked: ${statusCounts.blocked}`}
                    color="error"
                    size="small"
                    sx={{ minWidth: 90 }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  const renderListView = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>System Name</TableCell>
            <TableCell align="center">Total Services</TableCell>
            <TableCell align="center">Passed</TableCell>
            <TableCell align="center">Blocked</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSystems.map((system) => {
            const statusCounts = system.statusCounts || { passed: 0, blocked: 0, total: 0 };
            return (
              <TableRow 
                key={system.information_system}
                hover
                sx={{ 
                  cursor: 'pointer',
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
                onClick={() => navigate(`/system/${system.information_system}`)}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {system.information_system}
                  </Typography>
                </TableCell>
                <TableCell align="center">{statusCounts.total}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={statusCounts.passed}
                    color="success"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={statusCounts.blocked}
                    color="error"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View System Details">
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/system/${system.information_system}`);
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box p={3}>
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">
            Information Systems Dashboard
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1" color="text.secondary">
              Total Systems: {filteredSystems.length}
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="grid">
                <Tooltip title="Grid View">
                  <GridViewIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="list">
                <Tooltip title="List View">
                  <ListViewIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search systems by name, service, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {viewMode === 'grid' ? renderGridView() : renderListView()}
    </Box>
  );
};

export default InformationSystemList; 