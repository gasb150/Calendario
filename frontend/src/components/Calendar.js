import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Obligation from './Obligation';
import jsPDF from 'jspdf';

function CustomCalendar() {
  const [date, setDate] = useState(new Date());
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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Calendario de Obligaciones', 10, 10);
    obligations.forEach((obligation, index) => {
      doc.text(`${obligation.name} - ${obligation.startingDate} to ${obligation.dueDate}`, 10, 20 + (index * 10));
      doc.addImage(obligation.icon, 'PNG', 180, 15 + (index * 10), 10, 10);
    });
    doc.save('calendario.pdf');
  };

  return (
    <div>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={({ date, view }) => {
          const obligation = obligations.find(ob => new Date(ob.startingDate) <= date && date <= new Date(ob.dueDate));
          return obligation ? <img src={obligation.icon} alt={obligation.name} style={{ width: '20px', height: '20px' }} /> : null;
        }}
      />
      <button onClick={generatePDF}>Generar PDF</button>
      <div>
        {obligations.map((obligation, index) => (
          <Obligation key={index} obligation={obligation} />
        ))}
      </div>
    </div>
  );
}

export default CustomCalendar;