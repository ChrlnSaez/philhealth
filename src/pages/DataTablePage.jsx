import { useEffect, useMemo, useState } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  IconButton,
  Tooltip,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react';
import EditModal from './EditModal';
import AddNewModal from './AddNewModal';
import request from '../lib/request';
import { useSearchParams } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';

// Function to capitalize the first letter of a given string
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function DataTablePage() {
  // State for handling which table to show (Facility or Healthcare Professional)
  const [searchParams, setSearchParams] = useSearchParams();
  // State to store the current filter based on the URL query parameter or default to 'Facility'
  const [filter, setFilter] = useState(
    searchParams.get('filter') ?? 'Facility'
  );
  // State to manage the visibility of modals for editing, deleting, and adding records
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  // State to hold the current row selected for editing
  const [currentRow, setCurrentRow] = useState(null);
  // State to hold the ID of the selected row for deletion
  const [selectedId, setSelectedId] = useState(null);

  // State to store fetched facilities data
  const [facilities, setFacilities] = useState([]);

  // State to store fetched healthcare professionals data
  const [healthCare, setHealthCare] = useState([]);

  // State to handle the search term for filtering table data
  const [search, setSearch] = useState('');

  // useEffect to fetch facilities and healthcare data when the component mounts
  useEffect(() => {
    // Function to fetch facilities data from API
    const getAllFacilities = async () => {
      try {
        const response = await request.get('/facility');

        setFacilities(response.data);
      } catch (error) {
        console.log(error); // Log any errors in the request
      }
    };

    // Function to fetch healthcare professionals data from API
    const getAllHealthCare = async () => {
      try {
        const response = await request.get('/health-professional');

        setHealthCare(response.data);
      } catch (error) {
        console.log(error); // Log any errors in the request
      }
    };
    // Call both functions to fetch data
    getAllFacilities();
    getAllHealthCare();
  }, []);

  // Conditional rendering of table rows based on filter
  const TABLE_ROWS = filter === 'Facility' ? facilities : healthCare;

  // Define table head based on the filter
  const TABLE_HEAD =
    filter === 'Healthcare Professional'
      ? [
          'ID',
          'Licensed No.',
          'Healthcare Professional',
          'Specialization',
          'Address',
          'Contact Number',
          'Email',
          'Send Date',
          'Received Date',
          'Claim Status',
          'Accreditation Status',
          'Date Claimed',
          'Received By',
          '',
        ]
      : [
          'ID',
          'Licensed No.',
          'Facility',
          'Address',
          'Contact Number',
          'Email',
          'Level',
          'Send Date',
          'Received Date',
          'Claim Status',
          'Accreditation Status',
          'Date Claimed',
          'Received By',
          '',
        ];

  // Memoized table data that applies search filter if a search term exists
  const tableData = useMemo(
    () =>
      search
        ? TABLE_ROWS.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        : TABLE_ROWS,
    [search, TABLE_ROWS]
  );

  // Edit Modal Management
  const handleEditModalOpen = (row) => {
    setCurrentRow(row);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setCurrentRow(null);
  };

  // Delete Modal Management
  const handleDeleteModalOpen = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setSelectedId(null);
    setDeleteModalOpen(false);
  };

  // Memoized data for exporting to CSV, formatted based on the filter type and table data
  const csvData = useMemo(
    () =>
      TABLE_ROWS.map((item) => ({
        ID: item.id,
        ['License Number']: item.licenceNumber,
        [filter === 'Facility' ? 'Facility' : 'Healthcare Professional']:
          item.name,
        [filter === 'Facility' ? 'Level' : 'Specialization']:
          filter === 'Facility' ? item.level : item.specialization,
        Address: item.address,
        ['Contact Number']: item.contactNumber,
        Email: item.email,
        ['Send Date']: item?.sendDate ? format(item.sendDate, 'PP') : null,
        ['Received Date']: item?.receivedDate
          ? format(item.receivedDate, 'PP')
          : null,
        'Claim Status':
          item.status === 'NOT_RECEIVED' ? 'NOT RECEIVED' : 'RECEIVED',
        'Accreditation Status':
          item.accreditationStatus === 'PENDING' ? 'PENDING' : 'ACCEPTED',
        ['Date Claimed']: item?.dateClaimed
          ? format(item.dateClaimed, 'PP')
          : null,
        ['Received By']: item?.receivedBy,
      })),
    [filter, TABLE_ROWS]
  );

  return (
    <>
      {/* Edit Modal */}
      <EditModal
        currentRow={currentRow}
        open={editModalOpen}
        onClose={handleEditModalClose}
        filter={filter}
        setCurrentRow={setCurrentRow}
      />

      {/* Delete Modal */}
      <DeleteModal
        id={selectedId}
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        filter={filter}
      />

      <AddNewModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        filter={filter}
      />

      <Card className='h-full flex-1 w-full shadow-none'>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          <div className='flex flex-col justify-between md:flex-row md:items-center py-4'>
            <div className='flex items-center gap-4'>
              <Typography variant='h4' color='blue-gray'>
                Data Table
              </Typography>

              {/* Filter Dropdown */}
              <Menu>
                <MenuHandler>
                  <Button
                    size='sm'
                    variant='outlined'
                    className='flex items-center gap-2'>
                    {filter} <ChevronDownIcon className='h-4 w-4' />
                  </Button>
                </MenuHandler>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setFilter('Facility');
                      setSearchParams({ filter: 'Facility' });
                    }}>
                    Facility
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilter('Healthcare Professional');
                      setSearchParams({ filter: 'Healthcare Professional' });
                    }}>
                    Healthcare Professional
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>

            <div className='flex w-full shrink-0 gap-2 md:w-max'>
              <div className='w-full md:w-72'>
                <Input
                  label='Search'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={<MagnifyingGlassIcon className='h-5 w-5' />}
                />
              </div>

              <Button
                className='flex items-center gap-3 bg-green-700'
                size='sm'
                onClick={() => setAddModalOpen(true)}>
                <PlusIcon strokeWidth={2} className='h-4 w-4' />
                Add New
              </Button>
              <Button
                className='flex items-center gap-3 bg-green-700'
                size='sm'>
                <CSVLink
                  data={csvData}
                  filename={
                    filter === 'Facility'
                      ? 'facility_report.csv'
                      : 'healthcare-professional_report.csv'
                  }
                  className='flex items-center gap-3'>
                  <ArrowDownTrayIcon strokeWidth={2} className='h-4 w-4' />
                  Download
                </CSVLink>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className='overflow-y-scroll px-0 h-full'>
          <table className='w-full min-w-max table-auto text-left'>
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className='border-y border-blue-gray-100 bg-blue-gray-50/50 p-4'>
                    <Typography
                      variant='small'
                      color='blue-gray'
                      className='font-normal leading-none opacity-70'>
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? 'p-4'
                  : 'p-4 border-b border-blue-gray-50';

                return (
                  <tr key={row.id}>
                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {row.id}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {row.licenceNumber}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {filter === 'Healthcare Professional'
                          ? row.name
                          : row.name}
                      </Typography>
                    </td>
                    {filter === 'Healthcare Professional' && (
                      <td className={classes}>
                        <Typography variant='small' className='font-normal'>
                          {capitalize(row.specialization ?? '')}
                        </Typography>
                      </td>
                    )}
                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {row.address}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {row.contactNumber}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {row.email}
                      </Typography>
                    </td>
                    {filter === 'Facility' && (
                      <td className={classes}>
                        <Typography variant='small' className='font-normal'>
                          {row.level}
                        </Typography>
                      </td>
                    )}
                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {row.sendDate ? format(row.sendDate, 'PP') : null}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {row.receivedDate
                          ? format(row.receivedDate, 'PP')
                          : null}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className='w-max'>
                        <Chip
                          size='sm'
                          variant='ghost'
                          value={
                            row.status === 'NOT_RECEIVED'
                              ? 'NOT RECEIVED'
                              : 'RECEIVED'
                          }
                          color={row.status === 'RECIEVED' ? 'green' : 'red'}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className='w-max'>
                        <Chip
                          size='sm'
                          variant='ghost'
                          value={
                            row.accreditationStatus === 'PENDING'
                              ? 'PENDING'
                              : 'ACCEPTED'
                          }
                          color={
                            row.accreditationStatus === 'ACCEPTED'
                              ? 'green'
                              : 'yellow'
                          }
                        />
                      </div>
                    </td>

                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {row.dateClaimed ? format(row.dateClaimed, 'PP') : null}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant='small' className='font-normal'>
                        {row.receivedBy}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Tooltip content='Edit Details'>
                        <IconButton
                          onClick={() => handleEditModalOpen(row)}
                          variant='text'
                          color='blue-gray'>
                          <PencilIcon className='h-4 w-4' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content='Delete'>
                        <IconButton
                          onClick={() => handleDeleteModalOpen(row.id)}
                          variant='text'
                          color='red'>
                          <TrashIcon className='h-4 w-4' />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        {/* <CardFooter className='flex items-center justify-between border-t border-blue-gray-50 p-4'>
          <Button variant='outlined' size='sm'>
            Previous
          </Button>
          <div className='flex items-center gap-2'>
            <IconButton variant='outlined' size='sm'>
              1
            </IconButton>
            <IconButton variant='text' size='sm'>
              2
            </IconButton>
            <IconButton variant='text' size='sm'>
              3
            </IconButton>
            <IconButton variant='text' size='sm'>
              ...
            </IconButton>
            <IconButton variant='text' size='sm'>
              8
            </IconButton>
            <IconButton variant='text' size='sm'>
              9
            </IconButton>
            <IconButton variant='text' size='sm'>
              10
            </IconButton>
          </div>
          <Button variant='outlined' size='sm'>
            Next
          </Button>
        </CardFooter> */}
      </Card>
    </>
  );
}
