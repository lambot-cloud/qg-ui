import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  Stack,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  Tooltip,
} from '@mui/material';
import {
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Storage as StorageIcon,
  Place as PlaceIcon
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useParams, useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { ServiceWithInfra } from '../types/service';
import ServiceDetails from './ServiceDetails';

type SortField = 'service_name' | 'qg_status' | 'update_date' | 'platform' | 'zone';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

interface Filters {
  platform: string;
  zone: string;
  status: string;
  search: string;
}

export const ServicesList: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { services, loading, error } = useServices(systemId || '');
  const [selectedService, setSelectedService] = useState<ServiceWithInfra | null>(null);
  const [filters, setFilters] = useState<Filters>({
    platform: 'all',
    zone: 'all',
    status: 'all',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'service_name',
    order: 'asc'
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Event handler to manage search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFilters(prev => ({
      ...prev,
      search: event.target.value,
    }));
  };

  // Extract unique platforms and zones for filter options
  const platforms = useMemo(() => {
    const uniquePlatforms = new Set(services.map(s => s.platform).filter(Boolean));
    return ['all', ...Array.from(uniquePlatforms)];
  }, [services]);

  const zones = useMemo(() => {
    const uniqueZones = new Set(services.map(s => s.zone).filter(Boolean));
    return ['all', ...Array.from(uniqueZones)];
  }, [services]);

  const handleServiceClick = (service: ServiceWithInfra) => {
    setSelectedService(service);
  };

  const handleCloseDialog = () => {
    setSelectedService(null);
  };

  const handleSortChange = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterName: keyof Filters) => (
    event: SelectChangeEvent<string>
  ) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: event.target.value
    }));
  };

  const filteredAndSortedServices = useMemo(() => {
    let result = [...(services as ServiceWithInfra[])];

    // Apply search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(service => 
        service.service_name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(service => 
        service.qg_status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Apply platform filter
    if (filters.platform !== 'all') {
      result = result.filter(service => 
        service.platform === filters.platform
      );
    }

    // Apply zone filter
    if (filters.zone !== 'all') {
      result = result.filter(service => 
        service.zone === filters.zone
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.field] || '';
      const bValue = b[sortConfig.field] || '';
      
      if (sortConfig.field === 'update_date') {
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        return sortConfig.order === 'asc' ? dateA - dateB : dateB - dateA;
      }

      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortConfig.order === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [services, filters, sortConfig]);

  const getStatusColor = (status: string | null): "success" | "error" | "default" => {
    if (!status) return "default";
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'passed') return "success";
    if (normalizedStatus === 'blocked') return "error";
    return "default";
  };

  const renderFilters = () => (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <TextField
        size="small"
        placeholder="Search services..."
        value={filters.search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 200 }}
      />
      
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          label="Status"
          onChange={handleFilterChange('status')}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="passed">Passed</MenuItem>
          <MenuItem value="blocked">Blocked</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Platform</InputLabel>
        <Select
          value={filters.platform}
          label="Platform"
          onChange={handleFilterChange('platform')}
        >
          {platforms.map(platform => (
            <MenuItem key={String(platform)} value={platform || 'all'}>
              {platform === 'all' ? 'All Platforms' : platform}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Zone</InputLabel>
        <Select
          value={filters.zone}
          label="Zone"
          onChange={handleFilterChange('zone')}
        >
          {zones.map(zone => (
            <MenuItem key={String(zone)} value={zone || 'all'}>
              {zone === 'all' ? 'All Zones' : zone}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ToggleButtonGroup
        size="small"
        value={viewMode}
        exclusive
        onChange={(_, newMode) => newMode && setViewMode(newMode)}
      >
        <ToggleButton value="grid">
          <GridViewIcon />
        </ToggleButton>
        <ToggleButton value="list">
          <ListViewIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredAndSortedServices.map((service) => (
        <Grid item xs={12} sm={6} md={4} key={service.service_name}>
          <Card 
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.shadows[4],
              }
            }}
            onClick={() => handleServiceClick(service)}
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
                  {service.service_name}
                </Typography>
                <Tooltip title="View Details">
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceClick(service);
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Stack spacing={1}>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label={service.qg_status || 'Unknown'}
                    color={getStatusColor(service.qg_status)}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {service.platform && (
                    <Chip
                      icon={<StorageIcon />}
                      label={service.platform}
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilters(prev => ({
                          ...prev,
                          platform: service.platform || 'all'
                        }));
                      }}
                    />
                  )}
                  {service.zone && (
                    <Chip
                      icon={<PlaceIcon />}
                      label={service.zone}
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilters(prev => ({
                          ...prev,
                          zone: service.zone || 'all'
                        }));
                      }}
                    />
                  )}
                </Box>
                {service.description && (
                  <Typography variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {service.description}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer' 
                }}
                onClick={() => handleSortChange('service_name')}
              >
                Service Name
                {sortConfig.field === 'service_name' && (
                  <SortIcon 
                    sx={{ 
                      ml: 0.5, 
                      fontSize: '1.2rem',
                      transform: sortConfig.order === 'desc' ? 'rotate(180deg)' : 'none'
                    }} 
                  />
                )}
              </Box>
            </TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Platform</TableCell>
            <TableCell>Zone</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAndSortedServices.map((service) => (
            <TableRow 
              key={service.service_name}
              hover
              sx={{ 
                cursor: 'pointer',
                '&:last-child td, &:last-child th': { border: 0 }
              }}
              onClick={() => handleServiceClick(service)}
            >
              <TableCell>{service.service_name}</TableCell>
              <TableCell>
                <Chip
                  label={service.qg_status || 'Unknown'}
                  color={getStatusColor(service.qg_status)}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell>
                {service.platform && (
                  <Chip
                    icon={<StorageIcon />}
                    label={service.platform}
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({
                        ...prev,
                        platform: service.platform || 'all'
                      }));
                    }}
                  />
                )}
              </TableCell>
              <TableCell>
                {service.zone && (
                  <Chip
                    icon={<PlaceIcon />}
                    label={service.zone}
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({
                        ...prev,
                        zone: service.zone || 'all'
                      }));
                    }}
                  />
                )}
              </TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell align="center">
                <Tooltip title="View Details">
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceClick(service);
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Systems
        </Button>
      </Box>

      {renderFilters()}
      
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      <Dialog
        open={!!selectedService}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedService && (
          <ServiceDetails
            service={selectedService}
            onClose={handleCloseDialog}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default ServicesList;