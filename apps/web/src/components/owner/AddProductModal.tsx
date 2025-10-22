'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Snackbar, Alert } from '@mui/material';
import AddProductForm from './AddProductForm';

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const AddProductModal: React.FC<AddProductModalProps> = ({ 
  open, 
  onClose, 
  onSuccess 
}) => {
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleFormSuccess = () => {
    // Show success notification
    setShowSuccessNotification(true);
    
    // Call parent success callback
    onSuccess?.();
    
    // Close modal
    onClose();
  };

  const handleCloseNotification = () => {
    setShowSuccessNotification(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        aria-labelledby="add-product-dialog-title"
      >
        <DialogTitle id="add-product-dialog-title">
          Add New Product
        </DialogTitle>
        <DialogContent>
          <AddProductForm 
            onSuccess={handleFormSuccess} 
            onCancel={onClose}
          />
        </DialogContent>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={showSuccessNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Product created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProductModal;
