'use client';

import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddProductModal from '../../../components/owner/AddProductModal';

export default function AdminDashboardClient() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSuccess = () => {
    console.log('Product added successfully!');
    // In Story 1.5, this will refresh the product list
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Products
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        onClick={handleOpenModal}
        sx={{ mt: 2 }}
      >
        Add New Product
      </Button>

      <AddProductModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </Box>
  );
}
