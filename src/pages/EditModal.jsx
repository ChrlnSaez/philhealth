/* eslint-disable react/prop-types */
import { Input } from '@material-tailwind/react';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import request from '../lib/request';

// Array of special options for selection, each with a value and label
const specialOptions = [
  { value: 'ob-gyn', label: 'OB-GYN' },
  { value: 'pediatrician', label: 'Pediatrician' },
  { value: 'surgeon', label: 'Surgeon' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'dentist', label: 'Dentist' },
];

// Function to sort options alphabetically by the 'value' field
function sortOptions(options) {
  // Sort options alphabetically based on the 'value' property
  const sortedOptions = options.sort((a, b) => a.value.localeCompare(b.value));

  return sortedOptions;
}

// Sort and store the options in sortedOptions for use in the component
const sortedOptions = sortOptions(specialOptions);

export default function EditModal({ open, onClose, currentRow, filter }) {
  // State to manage the form fields, initially set to the values of the current row
  const [state, setState] = useState({ ...currentRow });

  // Update state whenever the currentRow changes (e.g., when selecting a different row to edit)
  useEffect(() => {
    if (!currentRow) return; // If no current row is selected, skip updating

    setState({ ...currentRow }); // Set state to the current row's data
  }, [currentRow]);

  // Hook to navigate after submission
  const navigate = useNavigate();

  // Submit handler to update the current record in the backend
  const handleSubmit = useCallback(async () => {
    // Determine the endpoint based on the filter type (Facility or Healthcare Professional)
    const endpoint =
      filter === 'Facility' ? '/facility' : '/health-professional';

    // Log current state data for debugging purposes
    console.log(state);
    try {
      // Send a PUT request to update the current record with formatted date fields
      await request.put(`${endpoint}/${state?.id}`, {
        ...state,
        sendDate: state?.sendDate ? new Date(state.sendDate).getTime() : null,
        receivedDate: state?.receivedDate
          ? new Date(state.receivedDate).getTime()
          : null,
        dateClaimed: state?.dateClaimed
          ? new Date(state.dateClaimed).getTime()
          : null,
      });
      // Close the modal after successful submission
      onClose();
      // Refresh the page or navigate as needed
      navigate(0);
    } catch (error) {
      console.log(error); // Log any errors encountered during the request
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, state]); // Dependencies include filter and state to rerun if these values change
  return (
    <Modal
      open={open}
      handleOpen={onClose}
      action={handleSubmit}
      title='Edit Details'>
      <form className='space-y-4'>
        {/* Flex container to split the form into two columns with consistent widths */}
        <div className='grid grid-cols-2 gap-4'>
          {/* Left Column */}
          <div className='space-y-4'>
            <Input
              label='Licensed Number'
              value={state?.licenceNumber}
              onChange={(e) =>
                setState({ ...state, licenceNumber: e.target.value })
              }
              className='w-full'
            />
            {filter === 'Facility' ? (
              <div className='grid gap-4'>
                <Input
                  label='Facility Name'
                  value={state?.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                  className='w-full'
                />
                <Input
                  label='Address'
                  value={state?.address}
                  onChange={(e) =>
                    setState({ ...state, address: e.target.value })
                  }
                  className='w-full'
                />
                <Input
                  label='Contact Number'
                  value={state?.contactNumber}
                  onChange={(e) =>
                    setState({ ...state, contactNumber: e.target.value })
                  }
                  className='w-full'
                />
                <Input
                  label='Email'
                  value={state?.email}
                  onChange={(e) =>
                    setState({ ...state, email: e.target.value })
                  }
                  className='w-full'
                />
                <Input
                  label='Send Date'
                  type='date'
                  value={
                    state?.sendDate &&
                    new Date(state?.sendDate).toISOString().substring(0, 10)
                  }
                  onFocus={(e) => e.target.showPicker()}
                  onChange={(e) => {
                    setState({ ...state, sendDate: e.target.value });
                    e.target.disabled = true;
                    setTimeout(() => {
                      e.target.disabled = false;
                    }, 0);
                  }}
                  className='w-full'
                />
              </div>
            ) : (
              <div className='grid gap-4'>
                <Input
                  label='Healthcare Professional'
                  value={state?.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                  className='w-full'
                />
                {/* Specialization Dropdown */}
                <div className='w-full flex flex-col relative'>
                  <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                    Specialization
                  </label>
                  <select
                    className='w-full p-2 text-sm text-blue-gray-800 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-gray-600'
                    value={state.specialization}
                    onChange={(e) =>
                      setState({ ...state, specialization: e.target.value })
                    }>
                    {sortedOptions.map((op, index) => (
                      <option key={index} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label='Email'
                  value={state?.email}
                  onChange={(e) =>
                    setState({ ...state, email: e.target.value })
                  }
                  className='w-full'
                />
                {/* Send Date Input for Healthcare Professional on Left Side */}
                <Input
                  label='Send Date'
                  type='date'
                  value={
                    state?.sendDate &&
                    new Date(state?.sendDate).toISOString().substring(0, 10)
                  }
                  onFocus={(e) => e.target.showPicker()}
                  onChange={(e) => {
                    setState({ ...state, sendDate: e.target.value });
                    e.target.disabled = true;
                    setTimeout(() => {
                      e.target.disabled = false;
                    }, 0);
                  }}
                  className='w-full'
                />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className='grid gap-4'>
            {filter === 'Facility' && (
              <>
                {/* Level Dropdown for Facility on Right Side */}
                <div className='w-full flex flex-col relative'>
                  <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                    Level
                  </label>
                  <select
                    className='w-full p-2 text-sm text-blue-gray-800 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-gray-600'
                    value={state.level}
                    onChange={(e) =>
                      setState({ ...state, level: e.target.value })
                    }>
                    <option value='1'>Level 1</option>
                    <option value='2'>Level 2</option>
                    <option value='3'>Level 3</option>
                    <option value='4'>Level 4</option>
                  </select>
                </div>
              </>
            )}
            <Input
              label='Received Date'
              type='date'
              value={
                state?.receivedDate &&
                new Date(state?.receivedDate).toISOString().substring(0, 10)
              }
              onFocus={(e) => e.target.showPicker()}
              onChange={(e) => {
                setState({ ...state, receivedDate: e.target.value });
                e.target.disabled = true;
                setTimeout(() => {
                  e.target.disabled = false;
                }, 0);
              }}
              className='w-full'
            />
            {/* Claim Status Dropdown */}
            <div className='w-full flex flex-col relative'>
              <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                Claim Status
              </label>
              <select
                className='w-full p-2 text-sm text-blue-gray-800 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-gray-600'
                value={state?.status}
                onChange={(e) =>
                  setState({ ...state, status: e.target.value })
                }>
                <option value='RECIEVED'>Received</option>
                <option value='NOT_RECEIVED'>Not Received</option>
              </select>
            </div>
            {/* Accreditation Status Dropdown */}
            <div className='w-full flex flex-col relative'>
              <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                Accreditation Status
              </label>
              <select
                className='w-full p-2 text-sm text-blue-gray-800 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-gray-600'
                value={state?.accreditationStatus}
                onChange={(e) =>
                  setState({ ...state, accreditationStatus: e.target.value })
                }>
                <option value='ACCEPTED'>Accepted</option>
                <option value='PENDING'>Pending</option>
              </select>
            </div>
            <Input
              label='Date Claimed'
              type='date'
              value={
                state?.dateClaimed &&
                new Date(state?.dateClaimed).toISOString().substring(0, 10)
              }
              onFocus={(e) => e.target.showPicker()}
              onChange={(e) => {
                setState({ ...state, dateClaimed: e.target.value });
                e.target.disabled = true;
                setTimeout(() => {
                  e.target.disabled = false;
                }, 0);
              }}
              className='w-full'
            />
            <Input
              label='Received By'
              value={state?.receivedBy}
              onChange={(e) =>
                setState({ ...state, receivedBy: e.target.value })
              }
              className='w-full'
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
