import React from 'react';
import { UserCircle as LoaderCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, className = '' }) => {
  return (
    <LoaderCircle 
      className={`animate-spin ${className}`} 
      size={size} 
    />
  );
};

export default LoadingSpinner;