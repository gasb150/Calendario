import React, { useEffect, useState } from 'react';
import CustomCalendar from './CustomCalendar';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    fetch('/calendar')
      .then(response => response.json())
      .then(data => {
        const holidayData = data.filter(day => day.Holiday);
        setHolidays(holidayData);
      })
      .catch(error => console.error('Error fetching holidays:', error));
  }, []);

  return (
    <div>
      <h2>Días Festivos</h2>
      <ul>
        {holidays.map((holiday, index) => (
          <li key={index}>
            {holiday.Date}: {holiday.HolidayName}
          </li>
        ))}
      </ul>
      <CustomCalendar holidays={holidays} />
    </div>
  );
};

export default Holidays;