import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import RadarIcon from '@mui/icons-material/Radar';
import HomeIcon from '@mui/icons-material/Home';

const Navigation: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      <Link
        component={RouterLink}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'inherit',
          textDecoration: 'none',
          '&:hover': { color: 'primary.main' }
        }}
      >
        <HomeIcon />
        Home
      </Link>
      <Link
        component={RouterLink}
        to="/tech-radar"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'inherit',
          textDecoration: 'none',
          '&:hover': { color: 'primary.main' }
        }}
      >
        <RadarIcon />
        Tech Radar
      </Link>
    </Box>
  );
};

export default Navigation; 