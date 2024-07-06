import React from 'react';
import { Box } from '@mui/material';

const SkeletonLoader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '8px 12px',
      }}
    >
      <div className="w-10 h-10 rounded-full bg-gray-700 shimmer"></div>
      <Box sx={{ flex: 1 }}>
        <Box className="bg-white/10 p-2 rounded-lg">
          <Box className="h-4 bg-gray-700 rounded w-full mb- shimmer"></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SkeletonLoader;
