import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAPIError, getValidationErrors, showSuccess } from '../../lib/error-handler';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await registerUser(data);
      showSuccess('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      // Check for validation errors
      const validationErrors = getValidationErrors(err);
      if (Object.keys(validationErrors).length > 0) {
        // Set form field errors
        Object.entries(validationErrors).forEach(([field, message]) => {
          setFormError(field as any, { message });
        });
      } else {
        // Handle other errors with toast
        handleAPIError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white dark:bg-neutral-200 rounded-lg shadow-md p-8 border border-gray-100 dark:border-neutral-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-neutral-900">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-900 dark:text-neutral-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-400 bg-white dark:bg-neutral-200 text-gray-900 dark:text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary-500 placeholder:text-gray-500 dark:placeholder:text-neutral-600"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-900 dark:text-neutral-900">
              Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-400 bg-white dark:bg-neutral-200 text-gray-900 dark:text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary-500 placeholder:text-gray-500 dark:placeholder:text-neutral-600"
              placeholder="Your Name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-900 dark:text-neutral-900">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-400 bg-white dark:bg-neutral-200 text-gray-900 dark:text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary-500 placeholder:text-gray-500 dark:placeholder:text-neutral-600"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-600">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
