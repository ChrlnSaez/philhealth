/* eslint-disable react/prop-types */
import Modal from '../components/Modal';

export default function HistoryModal({
  isOpen,
  onRequestClose,
  chartData,
  chartType,
  filter, // Ensure the filter prop is being passed correctly
}) {
  const realData = chartData?.reduce((acc, data) => {
    const hasOnlyName = Object.keys(data).length === 1;
    acc.push({ ...data, ...(hasOnlyName && { noData: true }) });
    return acc;
  }, []);

  // Determine the title suffix based on the filter
  const titleSuffix =
    filter === 'yearly'
      ? 'Year'
      : filter === 'monthly'
      ? 'Month'
      : filter === 'quarterly'
      ? 'Quarter'
      : 'History';

  return (
    <Modal
      noButtons
      open={isOpen}
      handleOpen={onRequestClose}
      title={`${
        chartType === 'facility' ? 'Facility' : 'Healthcare'
      } Statistics (${titleSuffix})`}>
      <div className='border rounded-lg'>
        {chartData && chartData.length > 0 ? (
          <table className='border-collapse text-black w-full text-left'>
            <thead>
              <tr>
                <th className='border-b bg-green-50 p-2'>{titleSuffix}</th>
                <th className='border-b bg-green-50 p-2'>Values</th>
              </tr>
            </thead>
            <tbody>
              {realData.map((data, index) => {
                // Sum all values for the current row
                const totalRowValues = Object.keys(data)
                  .filter((key) => key !== 'name' && key !== 'noData')
                  .reduce((sum, key) => sum + (data[key] || 0), 0);

                return (
                  <tr key={index}>
                    <td className='p-2 border-b'>{data.name}</td>
                    <td className='border-b p-2'>{totalRowValues}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </Modal>
  );
}
