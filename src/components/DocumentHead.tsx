import React from 'react';
import { Helmet } from 'react-helmet-async';

interface DocumentHeadProps {
  title?: string;
}

export const DocumentHead: React.FC<DocumentHeadProps> = ({ 
  title = 'Quality Gate'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Quality Gate Portal - Service Quality Management System" />
      <meta name="theme-color" content="#2196f3" />
    </Helmet>
  );
}; 