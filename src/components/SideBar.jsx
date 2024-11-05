import React from 'react';
import {
  IconButton,
  ListItem,
  ListItemPrefix,
  Drawer,
  Card,
} from '@material-tailwind/react';
import {
  PresentationChartBarIcon,
  TableCellsIcon,
  PowerIcon,
} from '@heroicons/react/24/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import PhilHealthImage from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function SideBar() {
  // const [open, setOpen] = React.useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const navigate = useNavigate();

  const changeRoute = (path) => {
    navigate(path);
    closeDrawer();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    changeRoute('/sign-in');
  };

  return (
    <>
      <IconButton variant='text' size='lg' onClick={openDrawer}>
        {isDrawerOpen ? (
          <XMarkIcon className='h-8 w-8 stroke-2' />
        ) : (
          <Bars3Icon className='h-8 w-8 stroke-2' />
        )}
      </IconButton>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card
          color='transparent'
          shadow={false}
          className='h-[calc(100vh-2rem)] w-full p-4 flex flex-col'>
          <div className='mb-2 flex items-center gap-4 p-4'>
            <img src={PhilHealthImage} alt='brand' className='h-15' />
          </div>

          <div className='flex-grow'>
            <ListItem
              className='mt-5 hover:bg-green-900 hover:text-white'
              onClick={() => changeRoute('/dashboard')}>
              <ListItemPrefix>
                <PresentationChartBarIcon className=' h-5 w-5' />
              </ListItemPrefix>
              Dashboard
            </ListItem>
            <ListItem
              className='hover:bg-green-900 hover:text-white'
              onClick={() => changeRoute('/data-table')}>
              <ListItemPrefix>
                <TableCellsIcon className='h-5 w-5' />
              </ListItemPrefix>
              Data Table
            </ListItem>
          </div>
          <hr className='my-2 border-blue-gray-50' />
          <ListItem
            className='mt-3 hover:bg-red-700 hover:text-white'
            onClick={handleLogout}>
            <ListItemPrefix>
              <PowerIcon className='h-5 w-5' />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </Card>
      </Drawer>
    </>
  );
}
