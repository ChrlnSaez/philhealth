import CardWithLink from '../components/Card';
import BarChartWithValues from '../components/ChartContent';
import { useEffect, useState } from 'react';
import request from '../lib/request';

export default function DashboardPage() {
  // State to determine whether the user has chosen a facility or healthcare professional
  const [choose, setChoose] = useState(false);

  // State to store the list of facilities fetched from the API
  const [facilities, setFacilities] = useState([]);

  // State to store the list of healthcare professionals fetched from the API
  const [healthCare, setHealthCare] = useState([]);

  const [selectedYear, setSelectedYear] = useState(2024);

  // useEffect to fetch data from the API when the component mounts
  useEffect(() => {
    // Function to fetch all facilities from the API
    const getAllFacilities = async () => {
      try {
        // Make GET request to fetch facilities data
        const response = await request.get('/facility');
        // Update facilities state with the response data
        setFacilities(response.data);
      } catch (error) {
        // Log any errors in fetching facilities data
        console.log(error);
      }
    };

    // Function to fetch all healthcare professionals from the API
    const getAllHealthCare = async () => {
      try {
        // Make GET request to fetch healthcare professionals data
        const response = await request.get('/health-professional');

        // Update healthcare state with the response data
        setHealthCare(response.data);
      } catch (error) {
        // Log any errors in fetching healthcare data
        console.log(error);
      }
    };
    // Invoke both data-fetching functions when the component mounts
    getAllFacilities();
    getAllHealthCare();
  }, []);

  // Set choose state to false, indicating a facility is selected
  const isFacility = () => {
    setChoose(false);
    setSelectedYear(2024);
  };
  // Set choose state to true, indicating a healthcare professional is selected
  const isHealthCare = () => {
    setChoose(true);
    setSelectedYear(2024);
  };

  return (
    <div>
      <CardWithLink
        isFacility={isFacility}
        isHealthCare={isHealthCare}
        choose={choose}
        numFacilities={facilities.length}
        numHealthCare={healthCare.length}
      />
      <BarChartWithValues
        choose={choose}
        setSelectedYear={setSelectedYear}
        selectedYear={selectedYear}
        facilities={facilities}
        healthCare={healthCare}
      />
    </div>
  );
}
