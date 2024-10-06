import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import jsPDF from 'jspdf';
import { FaBeer, FaCoffee, FaApple } from 'react-icons/fa'; // Importa los iconos que deseas usar
import Select from 'react-select'; // Importa react-select

const localizer = momentLocalizer(moment);

// Lista de iconos disponibles
const iconList = [
  { label: 'Beer', value: <FaBeer /> },
  { label: 'Coffee', value: <FaCoffee /> },
  { label: 'Apple', value: <FaApple /> }
];

function CustomCalendar() {
  const [obligations, setObligations] = useState([]);
  const [newObligation, setNewObligation] = useState({
    name: '',
    starting_date: '',
    due_date: '',
    icon: iconList[0].value // Icono por defecto
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
      title: `${obligation.name} (Inicio)`,
      start: new Date(obligation.starting_date),
      end: new Date(obligation.starting_date),
      icon: obligation.icon
    },
    {
      title: `${obligation.name} (Fin)`,
      start: new Date(obligation.due_date),
      end: new Date(obligation.due_date),
      icon: obligation.icon
    }
  ]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Calendario de Obligaciones', 10, 10);
    obligations.forEach((obligation, index) => {
      doc.text(`${obligation.name} - ${new Date(obligation.starting_date).toDateString()} to ${new Date(obligation.due_date).toDateString()}`, 10, 20 + (index * 10));
      // No se puede agregar un componente React directamente al PDF, necesitarías una URL de imagen
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
      {event.icon}
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewObligation({ ...newObligation, [name]: value });
  };

  const handleIconChange = (selectedOption) => {
    setNewObligation({ ...newObligation, icon: selectedOption.value });
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
          name: '',
          starting_date: '',
          due_date: '',
          icon: iconList[0].value
        });
      } else {
        console.error('Error adding obligation:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding obligation:', error);
    }
  };

  const customSingleValue = ({ data }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {data.value}
      <span style={{ marginLeft: 10 }}>{data.label}</span>
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center' }}>
        {data.value}
        <span style={{ marginLeft: 10 }}>{data.label}</span>
      </div>
    );
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
              {obligation.icon}
              <span>{obligation.name}</span>
            </div>
          ))
        )}
      </div>
      <button onClick={generatePDF}>Generar PDF</button>

      <div className="add-obligation-form">
        <h3>Añadir Obligación</h3>
        <input
          type="text"
          name="name"
          placeholder="Título"
          value={newObligation.name}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="starting_date"
          placeholder="Fecha de inicio"
          value={newObligation.starting_date}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="due_date"
          placeholder="Fecha de fin"
          value={newObligation.due_date}
          onChange={handleInputChange}
        />
        <Select
          options={iconList}
          value={iconList.find(icon => icon.value === newObligation.icon)}
          onChange={handleIconChange}
          components={{ SingleValue: customSingleValue, Option: customOption }}
        />
        <button onClick={handleAddObligation}>Añadir Obligación</button>
      </div>
    </div>
  );
}

export default CustomCalendar;