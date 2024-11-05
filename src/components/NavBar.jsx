/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import SideBar from './SideBar';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Outlet } from 'react-router-dom';

function DateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Clean up the interval when component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='flex items-center ml-4'>
      {/* Date */}
      <p className=''>
        {dateTime.toLocaleDateString()} | {dateTime.toLocaleTimeString()}
      </p>
    </div>
  );
}

export default function ComplexNavbar({ children }) {
  const profile = JSON.parse(localStorage.getItem('profile') ?? {});

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='border-b shadow-sm flex items-center px-20 py-4'>
        <SideBar />
        <div className='flex items-center justify-between w-full'>
          <DateTime />
          <div className='flex gap-4 items-center'>
            <div className='flex gap-2'>
              <div className='text-right leading-4'>
                <p className='font-semibold'>{profile?.name}</p>
                <p className='text-sm text-gray-700 font-medium'>
                  {profile?.code}
                </p>
              </div>
            </div>

            <UserCircleIcon className='w-12 h-12' />
          </div>
        </div>
      </div>
      <div className='flex-grow'>{children ? children : <Outlet />}</div>
    </div>
  );
}
