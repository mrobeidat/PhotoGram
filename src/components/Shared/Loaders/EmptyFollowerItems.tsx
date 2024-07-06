import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        color: 'white',
        opacity:"0.5"
      }}
    >
      <svg
        width={100}
        height={100}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13l-1.41 1.41L12 13.41 8.41 16.59 7 15.17l3.59-3.59L7 8l1.41-1.41L12 10.59l3.59-3.59L17 8l-3.59 3.59L17 15z"
          fill="white"
        />
      </svg>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;
