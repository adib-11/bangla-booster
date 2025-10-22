'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Alert, CircularProgress, Box, Typography } from '@mui/material';
import { provisionSubdomain } from '@/services/ownerService';
import { generateSubdomain } from '@/lib/utils';

type BusinessNameFormProps = {
  onSuccess?: (subdomain: string) => void;
};

const BusinessNameForm: React.FC<BusinessNameFormProps> = ({ onSuccess }) => {
  const [businessName, setBusinessName] = useState('');
  const [subdomainPreview, setSubdomainPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update subdomain preview as user types
  useEffect(() => {
    if (businessName.trim()) {
      const preview = generateSubdomain(businessName);
      setSubdomainPreview(preview);
    } else {
      setSubdomainPreview('');
    }
  }, [businessName]);

  const validateBusinessName = (): boolean => {
    if (!businessName.trim()) {
      setError('Business name is required');
      return false;
    }

    if (businessName.trim().length > 100) {
      setError('Business name must be 100 characters or less');
      return false;
    }

    const preview = generateSubdomain(businessName);
    if (!preview || preview.length < 3) {
      setError('Business name must contain at least 3 alphanumeric characters');
      return false;
    }

    if (preview.length > 63) {
      setError('Business name is too long. Please use a shorter name');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateBusinessName()) {
      return;
    }

    setLoading(true);

    try {
      const result = await provisionSubdomain(businessName.trim());
      
      if (onSuccess) {
        onSuccess(result.subdomain);
      }
    } catch (err: any) {
      console.error('Subdomain provisioning error:', err);
      setError(err.message || 'Failed to set up your subdomain. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Business Name"
        type="text"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        disabled={loading}
        variant="outlined"
        placeholder="e.g., Adib's Kicks"
        helperText="Enter your business name to create your unique subdomain"
      />

      {subdomainPreview && (
        <Box className="p-4 bg-blue-50 rounded-md">
          <Typography variant="body2" color="text.secondary" className="mb-1">
            Your subdomain preview:
          </Typography>
          <Typography variant="body1" className="font-semibold text-blue-600">
            {subdomainPreview}.ourplatform.com
          </Typography>
        </Box>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !businessName.trim()}
        sx={{ py: 1.5, mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Create My Subdomain'}
      </Button>
    </Box>
  );
};

export default BusinessNameForm;
