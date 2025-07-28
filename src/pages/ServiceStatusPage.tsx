import React from 'react';
import { ServiceStatusComparison } from '../components/ServiceStatusComparison';
import { DocumentHead } from '../components/DocumentHead';

const ServiceStatusPage: React.FC = () => {
  return (
    <>
      <DocumentHead title="Service Status Comparison" />
      <ServiceStatusComparison />
    </>
  );
};

export default ServiceStatusPage; 