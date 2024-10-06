import React from 'react';
import Obligation from './Obligation';

function Calendar() {
  const obligations = [
    {
      name: 'Pago de servicios',
      icon: 'https://example.com/icon.png',
      startingDate: '2023-01-01',
      dueDate: '2023-01-31'
    },
    {
      name: 'Pago de impuestos',
      icon: 'https://example.com/icon2.png',
      startingDate: '2023-02-01',
      dueDate: '2023-02-28'
    }
  ];

  return (
    <div>
      {obligations.map((obligation, index) => (
        <Obligation key={index} obligation={obligation} />
      ))}
    </div>
  );
}

export default Calendar;