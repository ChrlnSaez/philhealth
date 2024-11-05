/* eslint-disable react/prop-types */
import { Input } from '@material-tailwind/react';
import Modal from '../components/Modal';
import { useCallback, useState } from 'react';
import request from '../lib/request';
import { useNavigate } from 'react-router-dom';

const specialOptions = [
  { value: 'ob-gyn', label: 'OB-GYN' },
  { value: 'pediatrician', label: 'Pediatrician' },
  { value: 'surgeon', label: 'Surgeon' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'dentist', label: 'Dentist' },
];

function sortOptions(options) {
  const sortedOptions = options.sort((a, b) => a.value.localeCompare(b.value));

  sortedOptions.push({ value: 'other', label: 'Other' });

  return sortedOptions;
}
const sortedOptions = sortOptions(specialOptions);

export default function AddNewModal({ open, onClose, filter }) {
  const [state, setState] = useState({
    name: '',
    address: '',
    contactNumber: '',
    licenceNumber: '',
    email: '',
    level: '1',
    specialization: 'other',
  });

  const handleChange = (event) => {
    const value = event.target.value;
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = useCallback(async () => {
    const endpoint =
      filter === 'Facility' ? '/facility' : '/health-professional';

    const { level, specialization, ...data } = state;

    try {
      await request.post(endpoint, {
        ...data,
        ...(filter === 'Facility' ? { level } : { specialization }),
      });
      onClose();
      navigate(0);
    } catch (error) {
      console.log(error);
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
            <div className='flex flex-col relative'>
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
            </div>
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