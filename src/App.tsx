import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { InformationSystemList } from './components/InformationSystemList';
import { DocumentHead } from './components/DocumentHead';
import Layout from './components/Layout';
import TechRadarPage from './pages/TechRadarPage';
import ReleaseRequest from './components/ReleaseRequest';
import ServicesList from './components/ServicesList';
import ServiceStatusPage from './pages/ServiceStatusPage';
import TrustedImages from './components/TrustedImages';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <DocumentHead />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<InformationSystemList />} />
              <Route path="/system/:systemId" element={<ServicesList />} />
              <Route path="/tech-radar" element={<TechRadarPage />} />
              <Route path="/status-overview" element={<ServiceStatusPage />} />
              <Route path="/release-request" element={<ReleaseRequest />} />
              <Route path="/service-status" element={<ServiceStatusPage />} />
              <Route path="/trusted-images" element={<TrustedImages />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
