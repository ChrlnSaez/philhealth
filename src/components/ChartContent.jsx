/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  AdjustmentsHorizontalIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import HistoryModal from '../pages/HistoryModal';

// Define color shades for alternating bars in the chart
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

const MultiLevelBarChart = ({
  choose,
  facilities,
  healthCare,
  selectedYear = 2024,
  setSelectedYear,
}) => {
  const [filter, setFilter] = useState('monthly'); // Default filter is "yearly"

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aggregate healthcare data by month
  const monthlyHealthCare = healthCare
    ?.filter((item) => item.status === 'RECIEVED')
    ?.reduce((acc, record) => {
      const date = new Date(record.receivedDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const specialization = record.specialization.toLowerCase();

      // Ensure the year exists in the accumulator
      if (!acc[year]) {
        acc[year] = Array.from({ length: 12 }, (_, i) => ({
          name: new Date(0, i).toLocaleString('default', { month: 'long' }),
        }));
      }

      // Ensure the month entry for the year is initialized
      if (!acc[year][month]) {
        acc[year][month] = {
          name: new Date(0, month).toLocaleString('default', { month: 'long' }),
        };
      }

      // Initialize and increment specialization count for the month
      acc[year][month][specialization] =
        (acc[year][month][specialization] || 0) + 1;

      return acc;
    }, {});

  const yearlyHealthCare = healthCare
    ?.filter((item) => item.status === 'RECIEVED')
    ?.reduce((acc, record) => {
      const createdYear = new Date(record.receivedDate).getFullYear();
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

  const quarterlyHealthCare = healthCare
    ?.filter((item) => item.status === 'RECIEVED')
    ?.reduce((acc, record) => {
      const date = new Date(record.receivedDate);
      const year = date.getFullYear(); // Extract the year (e.g., 2024, 2025)
      const month = date.getMonth(); // 0 = January, 1 = February, ..., 11 = December
      const quarterIndex = Math.floor(month / 3); // 0 = Q1, 1 = Q2, 2 = Q3, 3 = Q4
      const specialization = record.specialization.toLowerCase();

      // Initialize the year if it doesn't exist
      if (!acc[year]) {
        acc[year] = Array.from({ length: 4 }, (_, i) => ({
          name: `Q${i + 1}`,
        }));
      }

      // Initialize and increment specialization count for the quarter
      acc[year][quarterIndex][specialization] =
        (acc[year][quarterIndex][specialization] || 0) + 1;

      return acc;
    }, {});

  // Identify unique specializations from the data, excluding 'name'
  const specializations = Array.from(
    new Set(
      (filter === 'monthly'
        ? Object.values(monthlyHealthCare[selectedYear] || [])
        : filter === 'yearly'
        ? yearlyHealthCareArray
        : filter === 'quarterly'
        ? Object.values(quarterlyHealthCare[selectedYear] || []) // Filter by selectedYear
        : Object.values(monthlyHealthCare[selectedYear] || [])
      )?.flatMap((item) => Object.keys(item)?.filter((key) => key !== 'name'))
    )
  );

  const monthlyFacility = facilities
    ?.filter((item) => item.status === 'RECIEVED')
    ?.reduce((acc, record) => {
      const date = new Date(record.receivedDate);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0 = January, 1 = February, etc.
      const level = `level${record.level}`;

      // Ensure the year exists in the accumulator
      if (!acc[year]) {
        acc[year] = Array.from({ length: 12 }, (_, i) => ({
          name: new Date(0, i).toLocaleString('default', { month: 'long' }),
        }));
      }

      // Ensure the month entry for the year is initialized
      if (!acc[year][month]) {
        acc[year][month] = {
          name: new Date(0, month).toLocaleString('default', { month: 'long' }),
        };
      }

      // Initialize and increment level count for the month
      acc[year][month][level] = (acc[year][month][level] || 0) + 1;

      return acc;
    }, {});

  // Aggregate facility data by year
  const yearlyFacility = facilities
    ?.filter((item) => item.status === 'RECIEVED')
    ?.reduce((acc, record) => {
      const year = new Date(record.receivedDate).getFullYear();
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

  const quarterlyFacility = facilities
    ?.filter((item) => item.status === 'RECIEVED')
    ?.reduce((acc, record) => {
      const date = new Date(record.receivedDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const quarterIndex = Math.floor(month / 3); // 0 = Q1, 1 = Q2, etc.
      const level = `level${record.level}`;

      // Ensure the year exists in the accumulator
      if (!acc[year]) {
        acc[year] = Array.from({ length: 4 }, (_, i) => ({
          name: `Q${i + 1}`,
        }));
      }

      // Ensure each quarter has an entry for the specific year
      if (!acc[year][quarterIndex]) {
        acc[year][quarterIndex] = { name: `Q${quarterIndex + 1}` };
      }

      // Initialize and increment level count for the quarter
      acc[year][quarterIndex][level] =
        (acc[year][quarterIndex][level] || 0) + 1;

      return acc;
    }, {});

  const years =
    filter === 'monthly'
      ? Object.keys(choose ? monthlyHealthCare : monthlyFacility)
      : Object.keys(choose ? quarterlyHealthCare : quarterlyFacility);

  // Logic to select data based on filter
  const getChartData = () => {
    const flattenQuarterlyData = (data, year) => {
      if (!data[year]) return [];

      return data[year].map((quarter) => {
        const quarterData = { name: `${quarter.name} ${year}` };

        for (const specialization in quarter) {
          if (specialization !== 'name') {
            quarterData[specialization] = quarter[specialization];
          }
        }

        return quarterData;
      });
    };

    const flattenMonthlyData = (data, year) => {
      if (!data[year]) return [];

      return data[year].map((month) => {
        const monthData = { name: `${month.name}` };

        for (const specialization in month) {
          if (specialization !== 'name') {
            monthData[specialization] = month[specialization];
          }
        }

        return monthData;
      });
    };

    if (filter === 'monthly') {
      const data = choose ? monthlyHealthCare : monthlyFacility;
      return flattenMonthlyData(data, Number(selectedYear));
    } else if (filter === 'yearly') {
      return choose ? yearlyHealthCareArray : yearlyFacilityArray;
    } else if (filter === 'quarterly') {
      const data = choose ? quarterlyHealthCare : quarterlyFacility;
      return flattenQuarterlyData(data, Number(selectedYear));
    }
    const data = choose ? monthlyHealthCare : monthlyFacility;
    return flattenMonthlyData(data, Number(selectedYear));
  };

  // Handle filter selection change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleHistoryClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <HistoryModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        chartData={getChartData()}
        chartType={choose ? 'healthCare' : 'facility'}
      />
      <div className='w-full flex flex-col justify-center items-center py-4 px-4'>
        <div className='w-full max-h-screen overflow-hidden'>
          {/* Title and Filter Dropdown Aligned */}
          <div className='flex justify-between items-center mt-14 mb-4 mx-8'>
            <h2 className='text-2xl font-semibold uppercase'>
              {choose ? 'Healthcare Professional' : 'Facility'} Statistics
            </h2>

            <div className='flex items-center space-x-4'>
              {/* Dropdown */}
              <div className='flex items-center gap-2'>
                <div className='relative'>
                  <select
                    value={filter}
                    onChange={handleFilterChange}
                    className='appearance-none border rounded px-4 py-2 pl-10 text-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-100'>
                    <option value='monthly'>Monthly</option>
                    <option value='yearly'>Yearly</option>
                    <option value='quarterly'>Quarterly</option>
                  </select>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <AdjustmentsHorizontalIcon className='h-5 w-5 text-gray-500' />
                  </div>
                </div>

                <div className='relative'>
                  {(filter === 'quarterly' || filter === 'monthly') && (
                    <>
                      <select
                        value={selectedYear.toString()}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className='appearance-none border rounded px-4 py-2 pl-10 text-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-gray-100'>
                        <option value={new Date().getFullYear().toString()}>
                          {new Date().getFullYear()}
                        </option>
                        {years
                          .filter(
                            (year) =>
                              year !== new Date().getFullYear().toString()
                          ) // Exclude the current year if it's already included
                          .map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                      </select>
                      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                        <ChevronDownIcon className='h-5 w-5 text-gray-500' />
                      </div>
                    </>
                  )}
                </div>

                {/* Icon */}
              </div>
              {/* History Button */}
              <button
                className='bg-green-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-green-700 shadow-lg flex items-center gap-2'
                onClick={() => handleHistoryClick('facility')}>
                <ClockIcon strokeWidth={2} className='h-6 w-6' />
                History
              </button>
            </div>
          </div>

          <ResponsiveContainer width='100%' height={400}>
            <BarChart
              data={getChartData()}
              margin={{ top: 30, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Legend
                verticalAlign='bottom'
                align='center'
                wrapperStyle={{ paddingTop: '15px' }} // Add margin above the legend
              />

              {choose ? (
                specializations.map((spec, index) => (
                  <Bar
                    key={spec}
                    dataKey={spec}
                    fill={alternatingShades[index]}
                    label={{
                      position: 'top',
                      formatter: (value) => `${value}`,
                    }}
                  />
                ))
              ) : (
                <>
                  <Bar
                    dataKey='level1'
                    fill='#E3C820'
                    label={{ position: 'top' }}
                  />
                  <Bar
                    dataKey='level2'
                    fill='#9EBD1B'
                    label={{ position: 'top' }}
                  />
                  <Bar
                    dataKey='level3'
                    fill='#017F42'
                    label={{ position: 'top' }}
                  />
                  <Bar
                    dataKey='level4'
                    fill='#9E9E9E'
                    label={{ position: 'top' }}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default MultiLevelBarChart;
