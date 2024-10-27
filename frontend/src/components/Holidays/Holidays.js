import { useEffect, useState } from 'react';

function useHolidays(backendUrl) {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(`${backendUrl}/holidays`);
        if (response.ok) {
          const data = await response.json();

          const holidayData = data.filter(day => day.Date);
          setHolidays(holidayData);
        } else {
          console.error('Error fetching holidays:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching holidays:', error);
      }
    };
    fetchHolidays();
  }, [backendUrl]);

  return { holidays };
}

export default useHolidays;