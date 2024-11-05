import CardWithLink from '../components/Card';
import BarChartWithValues from '../components/ChartContent';
import { useEffect, useState } from 'react';
import request from '../lib/request';

export default function DashboardPage() {
  const [choose, setChoose] = useState(false);

  const [facilities, setFacilities] = useState([]);

  const [healthCare, setHealthCare] = useState([]);

  useEffect(() => {
    const getAllFacilities = async () => {
      try {
        const response = await request.get('/facility');

        setFacilities(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllHealthCare = async () => {
      try {
        const response = await request.get('/health-professional');

        setHealthCare(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllFacilities();
    getAllHealthCare();
  }, []);

  const isFacility = () => setChoose(false);
  const isHealthCare = () => setChoose(true);

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
        facilities={facilities}
        healthCare={healthCare}
      />
    </div>
  );
}
