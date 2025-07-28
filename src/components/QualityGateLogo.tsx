import React from 'react';

interface QualityGateLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export const QualityGateLogo: React.FC<QualityGateLogoProps> = ({
  width = 40,
  height = 40,
  color = '#1976d2'
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Буква Q */}
      <path
        d="M20 4C11.716 4 5 10.716 5 19s6.716 15 15 15c2.64 0 5.116-.684 7.26-1.884l5.74 5.884 3-3-5.308-5.308C32.428 26.116 35 22.816 35 19c0-8.284-6.716-15-15-15zm0 26c-6.072 0-11-4.928-11-11s4.928-11 11-11 11 4.928 11 11-4.928 11-11 11z"
        fill={color}
      />
      
      {/* Буква G */}
      <path
        d="M45 19h-8v8h4v-4h4c2.2 0 4-1.8 4-4v-8c0-2.2-1.8-4-4-4h-8v4h8v8z"
        fill={color}
      />
    </svg>
  );
}; 