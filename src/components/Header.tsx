import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

export const Header: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        bgcolor: 'background.paper', 
        borderBottom: 1, 
        borderColor: 'divider' 
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/logo.svg" alt="Quality Gate Logo" style={{ height: 32 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 700,
                letterSpacing: '0.02em',
                textDecoration: 'none'
              }}
            >
              Quality Gate
            </Typography>
          </Link>
          <Box sx={{ ml: 4 }}>
            <Navigation />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 