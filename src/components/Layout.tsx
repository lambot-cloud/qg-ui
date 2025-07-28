import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  Typography,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Compare as CompareIcon,
  Send as SendIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              mr: 2,
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            QG
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            Quality Gate
          </Typography>
        </Box>
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Systems" />
            </ListItem>
            <ListItem button component={Link} to="/tech-radar">
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Tech Radar" />
            </ListItem>
            <ListItem button component={Link} to="/release-request">
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary="Release Request" />
            </ListItem>
            <ListItem button component={Link} to="/service-status">
              <ListItemIcon>
                <CompareIcon />
              </ListItemIcon>
              <ListItemText primary="Service Status" />
            </ListItem>
            <ListItem button component={Link} to="/trusted-images">
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Trusted Images" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ 
        flexGrow: 1,
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 