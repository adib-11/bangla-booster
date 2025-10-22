'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Paper } from '@mui/material';
import BusinessNameForm from '@/components/owner/BusinessNameForm';

const SubdomainSetupClient: React.FC = () => {
  const router = useRouter();

  const handleSuccess = (subdomain: string) => {
    // Redirect to admin dashboard after successful subdomain creation
    router.push('/admin');
  };

  return (
    <Container maxWidth="sm" className="py-12">
      <Paper elevation={3} className="p-8">
        <Box className="mb-6 text-center">
          <Typography variant="h4" component="h1" gutterBottom>
            Set Up Your Business
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a name for your business. We'll create a unique subdomain for you.
          </Typography>
        </Box>

        <BusinessNameForm onSuccess={handleSuccess} />
      </Paper>
    </Container>
  );
};

export default SubdomainSetupClient;
