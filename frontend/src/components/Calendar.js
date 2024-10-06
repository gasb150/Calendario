import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import jsPDF from 'jspdf';

const localizer = momentLocalizer(moment);

function CustomCalendar() {
  const [obligations, setObligations] = useState([]);
  const [newObligation, setNewObligation] = useState({
    title: '',
    start: '',
    end: '',
    icon: 'https://example.com/icon-green.png' // Icono verde por defecto
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchObligations = async () => {
      try {
        const response = await fetch(`${backendUrl}/obligations`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setObligations(data || []); // Asegúrate de que obligations sea un array
        } else {
          console.error('Error fetching obligations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching obligations:', error);
      }
    };

    fetchObligations();
  }, [backendUrl]);

  const events = obligations.flatMap(obligation => [
    {
      title: `${obligation.title} (Inicio)`,
      start: new Date(obligation.start),
      end: new Date(obligation.start),
      icon: obligation.icon
    },
    {
      title: `${obligation.title} (Fin)`,
      start: new Date(obligation.end),
      end: new Date(obligation.end),
      icon: obligation.icon
    }
  ]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Calendario de Obligaciones', 10, 10);
    obligations.forEach((obligation, index) => {
      doc.text(`${obligation.title} - ${new Date(obligation.start).toDateString()} to ${new Date(obligation.end).toDateString()}`, 10, 20 + (index * 10));
      doc.addImage(obligation.icon, 'PNG', 180, 15 + (index * 10), 10, 10);
    });
    doc.save('calendario.pdf');
  };

  const eventPropGetter = () => {
    return {
      style: {
        backgroundColor: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    };
  };

  const EventComponent = ({ event }) => (
    <div>
      <img src={event.icon} alt={event.title} style={{ width: '20px', height: '20px' }} />
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewObligation({ ...newObligation, [name]: value });
  };

  const handleAddObligation = async () => {
    try {
      const response = await fetch(`${backendUrl}/obligations`, { // Ruta relativa al backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObligation)
      });

      if (response.ok) {
        const addedObligation = await response.json();
        setObligations([...obligations, addedObligation]);
        setNewObligation({
          title: '',
          start: '',
          end: '',
          icon: 'https://example.com/icon-green.png'
        });
      } else {
        console.error('Error adding obligation:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding obligation:', error);
    }
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventPropGetter}
        components={{
          event: EventComponent
        }}
      />

      <div className="symbol-dictionary">
        <h3>Diccionario de Símbolos</h3>
        {obligations.length === 0 ? (
          <p>No hay obligaciones</p>
        ) : (
          obligations.map((obligation, index) => (
            <div key={index} className="symbol-item">
              <img src={obligation.icon} alt={obligation.title} style={{ width: '20px', height: '20px' }} />
              <span>{obligation.title}</span>
            </div>
          ))
        )}
      </div>
      <button onClick={generatePDF}>Generar PDF</button>

      <div className="add-obligation-form">
        <h3>Añadir Obligación</h3>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={newObligation.title}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="start"
          placeholder="Fecha de inicio"
          value={newObligation.start}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="end"
          placeholder="Fecha de fin"
          value={newObligation.end}
          onChange={handleInputChange}
        />
        <button onClick={handleAddObligation}>Añadir Obligación</button>
      </div>
    </div>
  );
}

export default CustomCalendar;