import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Grid,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useMonitoringServices } from '../hooks/useMonitoringServices';

export const ServiceStatusComparison: React.FC = () => {
  const { data: services, isLoading, error } = useMonitoringServices();

  const statusData = React.useMemo(() => {
    if (!services) return [];

    const totals = {
      passed: 0,
      blocked: 0,
      undefined: 0
    };

    services.forEach(service => {
      if (service.qg_status?.toLowerCase() === 'passed') {
        totals.passed++;
      } else if (service.qg_status?.toLowerCase() === 'blocked') {
        totals.blocked++;
      } else {
        totals.undefined++;
      }
    });

    return [
      { name: 'Passed', count: totals.passed, color: '#4caf50' },
      { name: 'Blocked', count: totals.blocked, color: '#f44336' },
      { name: 'Undefined', count: totals.undefined, color: '#9e9e9e' }
    ];
  }, [services]);

  const systemsData = React.useMemo(() => {
    if (!services) return [];

    const systemMap = new Map<string, number>();
    services.forEach(service => {
      const systemName = service.information_system || 'Unknown';
      const count = systemMap.get(systemName) || 0;
      systemMap.set(systemName, count + 1);
    });

    return Array.from(systemMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [services]);

  const monitoringData = React.useMemo(() => {
    if (!services) return [];

    const totals = {
      withMonitoring: 0,
      withoutMonitoring: 0,
    };

    services.forEach(service => {
      if (service.monitoring) {
        totals.withMonitoring++;
      } else {
        totals.withoutMonitoring++;
      }
    });

    return [
      { name: 'With Monitoring', value: totals.withMonitoring, color: '#4caf50' },
      { name: 'Without Monitoring', value: totals.withoutMonitoring, color: '#f44336' },
    ];
  }, [services]);

  const observabilityData = React.useMemo(() => {
    if (!services) return [];

    const totals = {
      withObservability: 0,
      withoutObservability: 0,
    };

    services.forEach(service => {
      if (service.observability) {
        totals.withObservability++;
      } else {
        totals.withoutObservability++;
      }
    });

    return [
      { name: 'With Observability', value: totals.withObservability, color: '#4caf50' },
      { name: 'Without Observability', value: totals.withoutObservability, color: '#f44336' },
    ];
  }, [services]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !services) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Failed to load services data'}
        </Alert>
      </Box>
    );
  }

  const totalServices = statusData.reduce((sum, item) => sum + item.count, 0);

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
            Status Overview
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Overall Service Status
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total services: {totalServices}
                </Typography>
                <Box sx={{ width: '100%', height: 400, mt: 2 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={statusData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const percentage = Math.round((data.count / totalServices) * 100);
                            return (
                              <Card>
                                <CardContent>
                                  <Typography variant="subtitle2" gutterBottom>
                                    {data.name}
                                  </Typography>
                                  <Typography variant="body2" color={data.color}>
                                    Count: {data.count}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {percentage}% of total
                                  </Typography>
                                </CardContent>
                              </Card>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Services">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Monitoring Coverage
                </Typography>
                <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={monitoringData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {monitoringData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <Card>
                                <CardContent>
                                  <Typography variant="subtitle2" gutterBottom>
                                    {data.name}
                                  </Typography>
                                  <Typography variant="body2" color={data.color}>
                                    Count: {data.value}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {((data.value / totalServices) * 100).toFixed(0)}% of total
                                  </Typography>
                                </CardContent>
                              </Card>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Observability Coverage
                </Typography>
                <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={observabilityData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {observabilityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <Card>
                                <CardContent>
                                  <Typography variant="subtitle2" gutterBottom>
                                    {data.name}
                                  </Typography>
                                  <Typography variant="body2" color={data.color}>
                                    Count: {data.value}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {((data.value / totalServices) * 100).toFixed(0)}% of total
                                  </Typography>
                                </CardContent>
                              </Card>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Services by Information System
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Top {systemsData.length} systems with most services
                </Typography>
                <Box sx={{ width: '100%', height: 400, mt: 2 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={systemsData}
                      margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={110}
                        tick={{ 
                          fontSize: 12,
                          width: 100
                        }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <Card>
                                <CardContent>
                                  <Typography variant="subtitle2" gutterBottom>
                                    {data.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    Services: {data.count}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {Math.round((data.count / totalServices) * 100)}% of total
                                  </Typography>
                                </CardContent>
                              </Card>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" fill="#2196f3" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}; 