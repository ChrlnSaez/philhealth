import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Logo from '../assets/logo.png';
import request from '../lib/request';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  // Hook to navigate to different routes after registration
  const Navigate = useNavigate();

  // State variables for form fields
  const [employeeName, setEmployeeName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State to store any validation errors for form fields
  const [errors, setErrors] = useState({
    employeeName: '',
    employeeNumber: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleEmployeeNumberChange = (e) => {
    const input = e.target.value;
    // Allow only numbers and a maximum of 8 digits
    if (input.length <= 8) {
      setEmployeeNumber(input);
    }
  };

  // Submit handler for the registration form
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault(); // Prevent form from refreshing the page

      // Validation check
      let formErrors = {};
      // Check if employee name is empty and add an error message if so
      if (!employeeName) {
        formErrors.employeeName = 'Employee Name is required!';
      }
      // Check if employee number is empty and add an error message if so
      if (!employeeNumber) {
        formErrors.employeeNumber = 'Employee Number is required!';
      }
      // Check if password is empty and add an error message if so
      if (!password) {
        formErrors.password = 'Password is required!';
      }

      // Update errors state with validation results
      setErrors(formErrors);

      // If there are validation errors, stop further execution
      if (Object.keys(formErrors).length > 0) {
        return;
      }

      try {
        // Send registration request to the backend API
        await request.post('/auth/register', {
          code: employeeNumber,
          name: employeeName,
          password,
        });
        // Show success message upon successful registration
        toast.success('Employee Added');
        // Redirect user to the sign-in page after registration
        navigate('/sign-in');
      } catch (error) {
        console.log(error.message); // Log error message
        toast.error(error.message); // Show error message to the user
      }

      // Clear errors after submission attempt
      setErrors('');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [employeeName, employeeNumber, password] // Dependency array to re-run the function if these values change
  );

  return (
    <div className='min-h-screen flex'>
      {/* Left Side - Form */}
      <div className='w-1/2 flex flex-col justify-center items-center p-8'>
        <div className='w-full max-w-md space-y-6'>
          <h2 className='text-3xl font-bold text-gray-800'>Register</h2>
          <p className='text-gray-500'>
            Enter the needed information to register
          </p>

          {/* Form */}
          {/* Employee Name */}
          <form className='space-y-4' onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Employee Name
              </label>
              <input
                type='text'
                placeholder='Your Name'
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className={`w-full mt-1 px-3 py-2 border ${
                  errors.employeeName
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                } rounded-lg focus:outline-none`}
              />
              {errors.employeeName && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.employeeName}
                </p>
              )}
            </div>

            {/* Employee Number */}
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
                  type={showPassword ? 'text' : 'password'} // Toggle between text/password
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

            {/* Register Button */}
            <div className='mt-4'>
              <button
                type='submit'
                className='w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-400 transition-colors duration-300'>
                REGISTER
              </button>
            </div>
          </form>

          {/* Not Registered Link */}
          <p className='mt-4 text-center text-sm text-gray-500'>
            Already have an account?{' '}
            <a
              href='#'
              className='text-blue-500 hover:underline'
              onClick={() => Navigate('/sign-in')}>
              Sign In
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className='w-1/3 flex items-center'>
        <img src={Logo} alt='Company Logo' />
      </div>
    </div>
  );
}
