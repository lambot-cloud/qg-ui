import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Link,
  Box,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { ServiceWithInfra } from '../types/service';

interface ServiceDetailsProps {
  service: ServiceWithInfra;
  onClose: () => void;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, onClose }) => {
  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {service.service_name}
          </Typography>
          <Chip
            label={service.qg_status || 'Unknown'}
            color={service.qg_status?.toLowerCase() === 'passed' ? 'success' : 
                   service.qg_status?.toLowerCase() === 'blocked' ? 'error' : 
                   'default'}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Check Updated: {service.update_date ? new Date(service.update_date).toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Quality Checks */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quality Checks
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Chip
                  label={service.monitoring ? 'Monitoring Enabled' : 'No Monitoring'}
                  color={service.monitoring ? 'success' : 'error'}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Chip
                  label={service.observability ? 'Observable' : 'Not Observable'}
                  color={service.observability ? 'success' : 'error'}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Chip
                  label={`Unit Test: ${service.unit_testing || 'N/A'}`}
                  color={service.unit_testing?.toLowerCase() === 'passed' ? 'success' : 
                         service.unit_testing?.toLowerCase() === 'failed' ? 'error' : 
                         'default'}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Repository Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Repository Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {service.git_url && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Git Repository
                    </Typography>
                    <Link href={service.git_url} target="_blank" rel="noopener noreferrer" component="a">
                      {service.git_url}
                    </Link>
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Checked Branch
                </Typography>
                <Typography variant="body1">
                  {service.git_branch}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* CI Pipeline Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              CI Pipeline Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {service.ci_pipeline_url && (
                  <>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Pipeline URL
                    </Typography>
                    <Link href={service.ci_pipeline_url} target="_blank" rel="noopener noreferrer" component="a">
                      {service.ci_pipeline_url}
                    </Link>
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!service.unit_testing_enabled}
                      disabled
                      size="small"
                    />
                  }
                  label="Unit Testing Enabled"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Platform:
              </Typography>
              <Typography variant="body1">
                {service.platform || 'Not specified'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Zone:
              </Typography>
              <Typography variant="body1">
                {service.zone || 'Not specified'}
              </Typography>
            </Box>
          </Grid>

          {service.description && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Framework
                </Typography>
                <Typography variant="body1">
                  {service.description}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </>
  );
};

export default ServiceDetails; 