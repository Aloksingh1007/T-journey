import { useState } from 'react';
import { type UseFormSetError, type FieldValues, type Path } from 'react-hook-form';
import { handleAPIError, getValidationErrors } from '../lib/error-handler';

/**
 * Custom hook for handling form submissions with error handling
 * Automatically handles validation errors and API errors
 */
export function useFormSubmit<TFormData extends FieldValues>() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    submitFn: () => Promise<void>,
    setError?: UseFormSetError<TFormData>
  ): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      await submitFn();
      return true;
    } catch (error) {
      // Check for validation errors
      const validationErrors = getValidationErrors(error);
      
      if (Object.keys(validationErrors).length > 0 && setError) {
        // Set form field errors
        Object.entries(validationErrors).forEach(([field, message]) => {
          setError(field as Path<TFormData>, { 
            type: 'manual',
            message: message as string 
          });
        });
      } else {
        // Handle other errors with toast
        handleAPIError(error);
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
