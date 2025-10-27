import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
        </div>
        <div className="gradient-text text-2xl font-bold font-display">Jilabi</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;