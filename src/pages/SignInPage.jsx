import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Logo from '../assets/logo.png';
import toast from 'react-hot-toast';
import request from '../lib/request';

export default function SignInPage() {
  // Initialize navigate function to redirect after successful login
  const Navigate = useNavigate();

  // State to hold employee number input
  const [employeeNumber, setEmployeeNumber] = useState('');
  // State to hold password input
  const [password, setPassword] = useState('');
  // State to toggle visibility of password
  const [showPassword, setShowPassword] = useState(false);
  // State to track form validation errors
  const [errors, setErrors] = useState({ employeeNumber: '', password: '' });

  // Initialize navigate function for redirecting after login
  const navigate = useNavigate();

  const handleEmployeeNumberChange = (e) => {
    const input = e.target.value;
    // Allow only numbers and a maximum of 8 digits
    if (input.length <= 8) {
      setEmployeeNumber(input);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Initialize an empty object to store validation errors
    let formErrors = {};

    // Check if employee number is provided, otherwise set an error message
    if (!employeeNumber) {
      formErrors.employeeNumber = 'Employee number is required!';
    }

    // Check if password is provided, otherwise set an error message
    if (!password) {
      formErrors.password = 'Password is required!';
    }

    // Update errors state with any validation errors
    setErrors(formErrors);

    // If there are errors, stop further execution
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      // Send login request to the server with employee number and password
      const response = await request.post('/auth/login', {
        code: employeeNumber,
        password,
      });
      // Store token and user profile in local storage on successful login
      localStorage.setItem('token', response.data?.token);
      localStorage.setItem('profile', JSON.stringify(response.data?.profile));

      // Show success message to the user
      toast.success('Employee Sign In');
      // Navigate to the dashboard page after login
      navigate('/dashboard');
    } catch (error) {
      // Log error message if login fails
      console.log(error.message);
      // Show error message to the user
      toast.error(error.message);
    }

    // Clear errors and navigate to dashboard
    setErrors({});
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left Side - Form */}
      <div className='w-1/2 flex flex-col justify-center items-center p-8'>
        <div className='w-full max-w-md space-y-6'>
          <h2 className='text-3xl font-bold text-gray-800'>Sign In</h2>
          <p className=' text-gray-500'>
            Enter your employee number and password to sign in
          </p>

          {/* Form */}
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Employee Number
              </label>
              <input
                type='number'
                placeholder='987654321'
                value={employeeNumber}
                onChange={handleEmployeeNumberChange}
                className={`w-full mt-1 px-3 py-2 border ${
                  errors.employeeNumber
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                } rounded-lg focus:outline-none`}
              />
              {errors.employeeNumber && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.employeeNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='********'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full mt-1 px-3 py-2 border ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                  } rounded-lg focus:outline-none`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600'>
                  {showPassword ? (
                    <EyeSlashIcon className='h-5 w-5' />
                  ) : (
                    <EyeIcon className='h-5 w-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
              )}
            </div>

            {/* Sign In Button */}
            <div className='mt-4'>
              <button
                type='submit'
                className='w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-400 transition-colors duration-300'>
                SIGN IN
              </button>
            </div>
          </form>

          {/* Not Registered Link */}
          <p className='mt-4 text-center text-sm text-gray-500'>
            Not registered?{' '}
            <a
              href='#'
              className='text-blue-500 hover:underline'
              onClick={() => Navigate('/')}>
              Create account
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className='w-1/3 flex items-center'>
        <img src={Logo} />
      </div>
    </div>
  );
}
