'use client';

import React, { useState, ChangeEvent, FocusEvent, FormEvent } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { ProductInput, ProductFormErrors } from '../../../../../packages/shared/src/types';
import { createProduct } from '../../services/productService';

type AddProductFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const AddProductForm: React.FC<AddProductFormProps> = ({ 
  onSuccess, 
  onCancel
}) => {
  const [formData, setFormData] = useState<ProductInput>({
    title: '',
    price: '',
    image: null
  });
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [touched, setTouched] = useState({
    title: false,
    price: false,
    image: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validate individual field
  const validateField = (name: keyof ProductInput, value: string | File | null): string | undefined => {
    switch (name) {
      case 'title':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'Product title is required';
        }
        if (typeof value === 'string' && value.length > 200) {
          return 'Title must be 200 characters or less';
        }
        break;
      
      case 'price':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return 'Price is required';
        }
        if (typeof value === 'string' && !/^\d+(\.\d{1,2})?$/.test(value)) {
          return 'Price must be a positive number with up to 2 decimals';
        }
        break;
      
      case 'image':
        if (!value) {
          return 'Product image is required';
        }
        if (value instanceof File) {
          const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
          if (!validTypes.includes(value.type)) {
            return 'Image must be JPEG, PNG, or WebP';
          }
          if (value.size > 5 * 1024 * 1024) {
            return 'Image must be less than 5MB';
          }
        }
        break;
    }
    return undefined;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};
    
    const titleError = validateField('title', formData.title);
    if (titleError) newErrors.title = titleError;
    
    const priceError = validateField('price', formData.price);
    if (priceError) newErrors.price = priceError;
    
    const imageError = validateField('image', formData.image);
    if (imageError) newErrors.image = imageError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle text input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ProductInput) => ({ ...prev, [name]: value }));
    
    // Clear error for this field on change
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name as keyof ProductInput, value);
      setErrors((prev: ProductFormErrors) => ({ ...prev, [name]: error }));
    }
  };

  // Handle field blur for validation
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name as keyof ProductInput, value);
    setErrors((prev: ProductFormErrors) => ({ ...prev, [name]: error }));
  };

  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev: ProductInput) => ({ ...prev, image: file }));
    setTouched((prev) => ({ ...prev, image: true }));
    
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Validate image
      const error = validateField('image', file);
      setErrors((prev: ProductFormErrors) => ({ ...prev, image: error }));
    } else {
      setImagePreview('');
      setErrors((prev: ProductFormErrors) => ({ ...prev, image: 'Product image is required' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ title: true, price: true, image: true });
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Call product service to create product
      await createProduct(formData);

      // Success
      setSubmitSuccess(true);
      
      // Clear form
      setFormData({ title: '', price: '', image: null });
      setImagePreview('');
      setTouched({ title: false, price: false, image: false });
      
      // Notify parent component
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while saving the product. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.title.trim() !== '' &&
      formData.price !== '' &&
      formData.image !== null &&
      /^\d+(\.\d{1,2})?$/.test(formData.price) &&
      Object.values(errors).every(error => !error)
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* Error Alert */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      {/* Success Alert */}
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSubmitSuccess(false)}>
          Product created successfully!
        </Alert>
      )}

      {/* Product Title Field */}
      <TextField
        fullWidth
        label="Product Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.title && !!errors.title}
        helperText={touched.title && errors.title}
        required
        disabled={isSubmitting}
        sx={{ mb: 2 }}
        inputProps={{
          'aria-label': 'Product Title',
          maxLength: 200
        }}
      />

      {/* Product Price Field */}
      <TextField
        fullWidth
        label="Product Price"
        name="price"
        type="text"
        value={formData.price}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.price && !!errors.price}
        helperText={touched.price && errors.price}
        required
        disabled={isSubmitting}
        sx={{ mb: 2 }}
        inputProps={{
          'aria-label': 'Product Price',
          pattern: '^\\d+(\\.\\d{1,2})?$',
          placeholder: '0.00'
        }}
      />

      {/* Product Image Upload */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          disabled={isSubmitting}
          fullWidth
        >
          {formData.image ? 'Change Image' : 'Upload Product Image'}
          <input
            type="file"
            hidden
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            aria-label="Product Image"
          />
        </Button>
        
        {touched.image && errors.image && (
          <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
            {errors.image}
          </Typography>
        )}
        
        {/* Image Preview */}
        {imagePreview && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img 
              src={imagePreview} 
              alt="Product preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                objectFit: 'contain',
                borderRadius: '8px'
              }} 
            />
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              {formData.image?.name}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Form Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddProductForm;
