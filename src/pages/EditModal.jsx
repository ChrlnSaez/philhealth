/* eslint-disable react/prop-types */
import { Input } from '@material-tailwind/react';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import request from '../lib/request';

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

export default function EditModal({ open, onClose, currentRow, filter }) {
  const [state, setState] = useState({ ...currentRow });

  useEffect(() => {
    if (!currentRow) return;

    setState({ ...currentRow });
  }, [currentRow]);

  const navigate = useNavigate();

  const handleSubmit = useCallback(async () => {
    const endpoint =
      filter === 'Facility' ? '/facility' : '/health-professional';

    console.log(state);
    try {
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
      onClose();
      navigate(0);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, state]);
  return (
    <Modal
      open={open}
      handleOpen={onClose}
      action={handleSubmit}
      title='Edit Details'>
      <form className='space-y-4'>
        <Input
          label='Licensed Number'
          value={state?.licenceNumber}
          onChange={(e) =>
            setState({ ...state, licenceNumber: e.target.value })
          }
        />
        {filter === 'Facility' ? (
          <>
            <Input
              label='Facility Name'
              value={state?.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
            />
            <Input
              label='Address'
              value={state?.address}
              onChange={(e) => setState({ ...state, address: e.target.value })}
            />
            <Input
              label='Contact Number'
              value={state?.contactNumber}
              onChange={(e) =>
                setState({
                  ...state,
                  contactNumber: e.target.value,
                })
              }
            />
            <Input
              label='Email'
              value={state?.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
            />
            {/* Level Dropdown */}
            <div className='flex flex-col relative'>
              <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                Level
              </label>
              <select
                className='mt-0 block w-full p-2 text-sm text-blue-gray-800 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-gray-600'
                value={state.level}
                onChange={(e) => setState({ ...state, level: e.target.value })}>
                <option value='1'>Level 1</option>
                <option value='2'>Level 2</option>
                <option value='3'>Level 3</option>
                <option value='4'>Level 4</option>
              </select>
            </div>
            <Input
              label='Send Date'
              type='date'
              value={
                state?.sendDate &&
                new Date(state?.sendDate).toISOString().substring(0, 10)
              }
              onFocus={(e) => e.target.showPicker()}
              onChange={(e) => {
                setState({
                  ...state,
                  sendDate: e.target.value,
                });
                e.target.disabled = true; // Temporarily disable
                setTimeout(() => {
                  e.target.disabled = false; // Re-enable after a short delay
                }, 0);
              }}
            />
            <Input
              label='Received Date'
              type='date'
              value={
                state?.receivedDate &&
                new Date(state?.receivedDate).toISOString().substring(0, 10)
              }
              onFocus={(e) => e.target.showPicker()}
              onChange={(e) => {
                setState({
                  ...state,
                  receivedDate: e.target.value,
                });
                e.target.disabled = true;
                setTimeout(() => {
                  e.target.disabled = false;
                }, 0);
              }}
            />
            {/* Status Dropdown */}
            <div className='flex flex-col relative'>
              <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                Status
              </label>
              <select
                className='mt-0 block w-full p-2 text-sm text-blue-gray-800 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-gray-600'
                value={state?.status}
                onChange={(e) =>
                  setState({ ...state, status: e.target.value })
                }>
                <option value='RECIEVED'>Received</option>
                <option value='NOT_RECEIVED'>Not Received</option>
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
                setState({
                  ...state,
                  dateClaimed: e.target.value,
                });
                e.target.disabled = true;
                setTimeout(() => {
                  e.target.disabled = false;
                }, 0);
              }}
            />
          </>
        ) : (
          <>
            <Input
              label='Healthcare Professional'
              value={state?.name}
              onChange={(e) =>
                setState({
                  ...state,
                  name: e.target.value,
                })
              }
            />
            {/* Specialization Dropdown */}
            <div className='flex flex-col relative'>
              <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                Specialization
              </label>
              <select
                onChange={(e) =>
                  setState({
                    ...state,
                    specialization: e.target.value,
                  })
                }
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
              value={state?.address}
              onChange={(e) => setState({ ...state, address: e.target.value })}
            />
            <Input
              label='Contact Number'
              value={state?.contactNumber}
              onChange={(e) =>
                setState({
                  ...state,
                  contactNumber: e.target.value,
                })
              }
            />
            <Input
              label='Email'
              value={state?.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
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
                setState({
                  ...state,
                  sendDate: e.target.value,
                });
                e.target.disabled = true;
                setTimeout(() => {
                  e.target.disabled = false;
                }, 0);
              }}
            />
            <Input
              label='Received Date'
              type='date'
              value={
                state?.receivedDate &&
                new Date(state?.receivedDate).toISOString().substring(0, 10)
              }
              onFocus={(e) => e.target.showPicker()}
              onChange={(e) => {
                setState({
                  ...state,
                  receivedDate: e.target.value,
                });
                e.target.disabled = true;
                setTimeout(() => {
                  e.target.disabled = false;
                }, 0);
              }}
            />
            {/* Status Dropdown */}
            <div className='flex flex-col relative'>
              <label className='absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500'>
                Status
              </label>
              <select
                className='mt-0 block w-full p-2 text-sm text-blue-gray-800 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-gray-600'
                value={state?.status}
                onChange={(e) =>
                  setState({ ...state, status: e.target.value })
                }>
                <option value='RECIEVED'>Received</option>
                <option value='NOT_RECEIVED'>Not Received</option>
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
                setState({
                  ...state,
                  dateClaimed: e.target.value,
                });
                e.target.disabled = true;
                setTimeout(() => {
                  e.target.disabled = false;
                }, 0);
              }}
            />
          </>
        )}
      </form>
    </Modal>
  );
}
