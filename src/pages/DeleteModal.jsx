/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import Modal from '../components/Modal';
import { data } from 'autoprefixer';
import { useNavigate } from 'react-router-dom';
import request from '../lib/request';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function DeleteModal({ open, onClose, filter, id }) {
  // Hook to navigate after deletion (e.g., refreshing the page)
  const navigate = useNavigate();

  // Callback function to handle the deletion request
  const handleSubmit = useCallback(async () => {
    // Determine the endpoint based on the filter type (Facility or Healthcare Professional)
    const endpoint =
      filter === 'Facility' ? '/facility' : '/health-professional';

    try {
      // Log the URL for debugging purposes
      console.log(`${endpoint}/${id}`);
      // Send a DELETE request to the appropriate endpoint with the given ID
      await request.delete(`${endpoint}/${id}`, {
        ...data, // No extra data to send in this case, so this can be omitted if unnecessary
      });
      // Close the modal upon successful deletion
      onClose();
      // Refresh the page or redirect as needed
      navigate(0);
    } catch (error) {
      // Log any errors encountered during the deletion request
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, id]);
  return (
    <Modal open={open} handleOpen={onClose} noButtons>
      <div className='flex flex-col items-center p-6'>
        <ExclamationTriangleIcon className=' text-red-400 bg-red-100 rounded-full mb-4 h-20 w-20 p-2' />
        <h1 className='font-semibold text-3xl mb-2'>Are you sure?</h1>
        <p className='text-center mb-6'>
          Do you really want to delete the item? This process cannot be undone.
        </p>
        <div className='flex space-x-4'>
          <button
            onClick={handleSubmit}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'>
            Delete
          </button>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100'>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
