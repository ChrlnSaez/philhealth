/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const alternatingShades = [
  '#FDD835', // Original Yellow
  '#4CAF50', // Original Green
  '#FFE082', // Light Yellow
  '#66BB6A', // Light Green
  '#FFD54F', // Medium Yellow
  '#388E3C', // Dark Green
  '#FFEB3B', // Bright Yellow
  '#2E7D32', // Deeper Green
  '#FBC02D', // Golden Yellow
  '#81C784', // Soft Green
  '#F9A825', // Dark Yellow
  '#1B5E20', // Forest Green
  '#FDDC6B', // Soft Pastel Yellow
  '#A5D6A7', // Light Pastel Green
  '#FFEE58', // Soft Bright Yellow
  '#43A047', // Mid Green
  '#FFC107', // Rich Yellow
  '#357A38', // Deep Green
  '#FFE57F', // Pale Yellow
  '#689F38', // Earthy Green
];

const MultiLevelBarChart = ({ choose, facilities, healthCare }) => {
  const [filter, setFilter] = useState('monthly'); // Default filter is "yearly"

  const monthlyHealthCare = healthCare?.reduce(
    (acc, record) => {
      const createdMonth = new Date(record.createdAt).getMonth(); // 0 = January, 1 = February, etc.
      const specialization = record.specialization.toLowerCase();

      // Ensure each month has an entry
      if (!acc[createdMonth]) {
        acc[createdMonth] = {
          name: new Date(0, createdMonth).toLocaleString('default', {
            month: 'long',
          }),
        };
      }

      // Initialize specialization count if it doesn't exist
      if (!acc[createdMonth][specialization]) {
        acc[createdMonth][specialization] = 0;
      }

      // Increment count for the specialization
      acc[createdMonth][specialization] += 1;

      return acc;
    },
    Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'long' }),
    }))
  );

  const yearlyHealthCare = healthCare?.reduce((acc, record) => {
    const createdYear = new Date(record.createdAt).getFullYear();
    const specialization = record.specialization.toLowerCase();

    // Ensure each year has an entry
    if (!acc[createdYear]) {
      acc[createdYear] = { name: String(createdYear) };
    }

    // Initialize and increment specialization count
    acc[createdYear][specialization] =
      (acc[createdYear][specialization] || 0) + 1;

    return acc;
  }, {});

  // Convert the yearly data object to an array of year entries (optional, if you want an array output)
  const yearlyHealthCareArray = Object.values(yearlyHealthCare ?? {});

  const quarterlyHealthCare = healthCare?.reduce(
    (acc, record) => {
      const month = new Date(record.createdAt).getMonth(); // 0 = January, 1 = February, ..., 11 = December
      const quarterIndex = Math.floor(month / 3); // 0 = Q1, 1 = Q2, 2 = Q3, 3 = Q4
      const specialization = record.specialization.toLowerCase();

      // Initialize quarter if it doesn't exist
      if (!acc[quarterIndex]) {
        acc[quarterIndex] = {
          name: `Q${quarterIndex + 1}`,
        };
      }

      // Initialize and increment specialization count
      acc[quarterIndex][specialization] =
        (acc[quarterIndex][specialization] || 0) + 1;

      return acc;
    },
    Array.from({ length: 4 }, (_, i) => ({ name: `Q${i + 1}` }))
  );

  const specializations = Array.from(
    new Set(
      (filter === 'monthly'
        ? monthlyHealthCare
        : filter === 'yearly'
        ? yearlyHealthCareArray
        : filter === 'quarterly'
        ? quarterlyHealthCare
        : monthlyHealthCare
      )?.flatMap((month) => Object.keys(month)?.filter((key) => key !== 'name'))
    )
  );

  const monthlyFacility = facilities?.reduce(
    (acc, record) => {
      const month = new Date(record.createdAt).getMonth(); // 0 = January, 1 = February, etc.
      const level = `level${record.level}`;

      // Ensure each month has an entry
      if (!acc[month]) {
        acc[month] = {
          name: new Date(0, month).toLocaleString('default', { month: 'long' }),
        };
      }

      // Initialize and increment level count
      acc[month][level] = (acc[month][level] || 0) + 1;

      return acc;
    },
    Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'long' }),
    }))
  );

  const yearlyFacility = facilities?.reduce((acc, record) => {
    const year = new Date(record.createdAt).getFullYear();
    const level = `level${record.level}`;

    // Ensure each year has an entry
    if (!acc[year]) {
      acc[year] = {
        name: String(year),
      };
    }

    // Initialize and increment level count
    acc[year][level] = (acc[year][level] || 0) + 1;

    return acc;
  }, {});

  // Convert to array format
  const yearlyFacilityArray = Object.values(yearlyFacility ?? {});

  const quarterlyFacility = facilities?.reduce(
    (acc, record) => {
      const month = new Date(record.createdAt).getMonth();
      const quarterIndex = Math.floor(month / 3); // 0 = Q1, 1 = Q2, etc.
      const level = `level${record.level}`;

      // Ensure each quarter has an entry
      if (!acc[quarterIndex]) {
        acc[quarterIndex] = { name: `Q${quarterIndex + 1}` };
      }

      // Initialize and increment level count
      acc[quarterIndex][level] = (acc[quarterIndex][level] || 0) + 1;

      return acc;
    },
    Array.from({ length: 4 }, (_, i) => ({ name: `Q${i + 1}` }))
  );

  // Logic to select data based on filter
  const getChartData = () => {
    if (filter === 'monthly') {
      return choose ? monthlyHealthCare : monthlyFacility;
    } else if (filter === 'yearly') {
      return choose ? yearlyHealthCareArray : yearlyFacilityArray;
    } else if (filter === 'quarterly') {
      return choose ? quarterlyHealthCare : quarterlyFacility;
    }
    return choose ? monthlyHealthCare : monthlyFacility; // Default data
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className='w-full flex flex-col justify-center items-center py-20 px-20'>
      <div className='w-full'>
        {/* Filter Dropdown Positioned on the Right */}
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold uppercase'>
            {choose ? 'Healthcare Professional' : 'Facility'}
          </h2>

          {/* Filter Dropdown with Icon */}
          <div className='flex items-center'>
            <div className='relative'>
              {/* Dropdown */}
              <select
                value={filter}
                onChange={handleFilterChange}
                className='appearance-none border rounded px-4 py-2 pl-10 text-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-100'>
                <option value='monthly'>Monthly</option>
                <option value='yearly'>Yearly</option>
                <option value='quarterly'>Quarterly</option>
              </select>
              {/* Icon */}
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <AdjustmentsHorizontalIcon className='h-5 w-5 text-gray-500' />
              </div>
            </div>
          </div>
        </div>

        <ResponsiveContainer width='100%' height={400}>
          <BarChart
            className='h-full'
            data={getChartData()} // Dynamically filtered data
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            {choose ? (
              <>
                {specializations.map((spec, index) => (
                  <Bar
                    key={spec}
                    dataKey={spec}
                    fill={alternatingShades[index]}
                  />
                ))}
              </>
            ) : (
              <>
                <Bar dataKey='level1' fill='#E3C820' />
                <Bar dataKey='level2' fill='#9EBD1B' />
                <Bar dataKey='level3' fill='#017F42' />
                <Bar dataKey='level4' fill='#9E9E9E' />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiLevelBarChart;
