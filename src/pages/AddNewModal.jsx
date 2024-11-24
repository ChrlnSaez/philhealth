/* eslint-disable react/prop-types */
import { Input } from '@material-tailwind/react';
import Modal from '../components/Modal';
import { useCallback, useState } from 'react';
import request from '../lib/request';
import { useNavigate } from 'react-router-dom';

// // Options array containing different types of healthcare professionals with specific values and labels
// const specialOptions = [
//   { value: 'ob-gyn', label: 'OB-GYN' },
//   { value: 'pediatrician', label: 'Pediatrician' },
//   { value: 'surgeon', label: 'Surgeon' },
//   { value: 'doctor', label: 'Doctor' },
//   { value: 'nurse', label: 'Nurse' },
//   { value: 'dentist', label: 'Dentist' },
// ];

// // Function to sort options alphabetically by the 'value' field
// function sortOptions(options) {
//   const sortedOptions = options.sort((a, b) => a.value.localeCompare(b.value));

//   return sortedOptions;
// }
// // Sort and store the options in sortedOptions variable for further use in the component
// const sortedOptions = sortOptions(specialOptions);

// Main component to add a new entry, with modal props 'open' to control visibility and 'onClose' for closing the modal
export default function AddNewModal({ open, onClose, filter }) {
  const [state, setState] = useState({
    name: '',
    address: '',
    contactNumber: '',
    licenceNumber: '',
    email: '',
    level: '1', // Default level, assuming 'Facility' level structure
  });

  // Handle changes to input fields in the form, updating the corresponding state properties
  const handleChange = (event) => {
    const value = event.target.value;
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: value,
    }));
  };

  // Hook for navigating after submission
  const navigate = useNavigate();

  // Submit handler for the form, making an API request based on the 'filter' type
  const handleSubmit = useCallback(async () => {
    // Set API endpoint based on the 'filter' prop
    const endpoint =
      filter === 'Facility' ? '/facility' : '/health-professional';

    // Extract fields and prepare data payload for the API request
    const { level, specialization, ...data } = state;

    try {
      // Make a POST request with relevant data based on the 'filter' type
      await request.post(endpoint, {
        ...data,
        ...(filter === 'Facility' ? { level } : { specialization }),
      });
      // Close the modal after successful submission
      onClose();
      // Refresh the page
      navigate(0);
    } catch (error) {
      console.log(error); // Log any errors for debugging
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, filter]);

  return (
    <Modal
      open={open}
      handleOpen={onClose}
      title='Add New'
      action={handleSubmit}>
      <form className='space-y-4'>
        <Input
          label='Licensed Number'
          name='licenceNumber'
          value={state.licenceNumber}
          onChange={handleChange}
        />
        {filter === 'Facility' ? (
          <>
            <Input
              label='Facility Name'
              name='name'
              value={state.name}
              onChange={handleChange}
            />
            <Input
              label='Address'
              name='address'
              value={state.address}
              onChange={handleChange}
            />
            <Input
              label='Contact Number'
              name='contactNumber'
              onChange={handleChange}
              value={state.contactNumber}
            />
            <Input
              label='Email'
              name='email'
              value={state.email}
              onChange={handleChange}
            />

            {/* Level Dropdown */}
            <div className='flex flex-col relative'>
              <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                Level
              </label>
              <select
                onChange={handleChange}
                name='level'
                value={state.level}
                className='mt-0 block w-full p-2 text-sm text-blue-gray-800 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-gray-600'>
                <option value='1'>Level 1</option>
                <option value='2'>Level 2</option>
                <option value='3'>Level 3</option>
                <option value='4'>Level 4</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <Input
              label='Healthcare Professional'
              onChange={handleChange}
              name='name'
              value={state.name}
            />
            {/* Specialization Dropdown */}
            {/* <div className='flex flex-col relative'>
              <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                Specialization
              </label>
              <select
                onChange={handleChange}
                name='specialization'
                value={state.specialization}
                className='mt-0 block w-full p-2 text-sm text-blue-gray-800 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-gray-600'>
                {sortedOptions.map((op, index) => (
                  <option key={index} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div> */}
            <Input
              label='Specialization'
              onChange={handleChange}
              name='specialization'
              value={state.specialization}
            />
            <Input
              label='Address'
              name='address'
              value={state.address}
              onChange={handleChange}
            />
            <Input
              onChange={handleChange}
              label='Contact Number'
              name='contactNumber'
              value={state.contactNumber}
            />
            <Input
              label='Email'
              name='email'
              value={state.email}
              onChange={handleChange}
            />
          </>
        )}
      </form>
    </Modal>
  );
}
