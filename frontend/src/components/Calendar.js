import React from 'react';
import Obligation from './Obligation';

function Calendar({ calendar }) {
  return (
    <div>
      {calendar.map((day, index) => (
        <div key={index}>
          <h2>{day.date}</h2>
          {day.holiday && <p>Festivo: {day.holidayName}</p>}
          {day.obligations.map((obligation, idx) => (
            <Obligation key={idx} obligation={obligation} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Calendar;