import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import jsPDF from 'jspdf';
import { FaBeer, FaCoffee, FaApple } from 'react-icons/fa';
import Select from 'react-select';
import Obligation from './Obligation';

const localizer = momentLocalizer(moment);

const iconList = [
  { label: 'FaBeer', value: 'FaBeer', icon: <FaBeer color="blue" /> },
  { label: 'FaCoffee', value: 'FaCoffee', icon: <FaCoffee color="blue" /> },
  { label: 'FaApple', value: 'FaApple', icon: <FaApple color="blue" /> }
];

const iconMap = {
  FaCoffee: FaCoffee,
  FaApple: FaApple,
  FaBeer: FaBeer,
};

function CustomCalendar() {
  const [obligations, setObligations] = useState([]);
  const [newObligation, setNewObligation] = useState({
    name: '',
    starting_date: '',
    due_date: '',
    icon: iconList[0].value
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchObligations = async () => {
      try {
        const response = await fetch(`${backendUrl}/obligations`);
        if (response.ok) {
          const data = await response.json();
          const mappedObligations = data.map(obligation => ({
            ...obligation,
            Icon: iconMap[obligation.Icon] || obligation.Icon
          }));
          setObligations(mappedObligations || []);
        } else {
          console.error('Error fetching obligations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching obligations:', error);
      }
    };

    fetchObligations();
  }, [backendUrl]);

  const groupByDate = (obligations) => {
    const grouped = {};
    obligations.forEach(obligation => {
      const startDate = new Date(obligation.StartingDate).toDateString();
      const endDate = new Date(obligation.DueDate).toDateString();

      if (!grouped[startDate]) grouped[startDate] = [];
      if (!grouped[endDate]) grouped[endDate] = [];

      grouped[startDate].push({ ...obligation, type: 'start' });
      grouped[endDate].push({ ...obligation, type: 'end' });
    });
    return grouped;
  };

  const groupedObligations = groupByDate(obligations);

  const events = Object.keys(groupedObligations).map(date => ({
    title: date,
    start: new Date(date),
    end: new Date(date),
    obligations: groupedObligations[date]
  }));

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Calendario de Obligaciones', 10, 10);
    obligations.forEach((obligation, index) => {
      doc.text(`${obligation.Name} - ${new Date(obligation.StartingDate).toDateString()} to ${new Date(obligation.DueDate).toDateString()}`, 10, 20 + (index * 10));
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

  const EventComponent = ({ event }) => {
    const events_length = event.obligations.length
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        {event.obligations.map((obligation, index) => {
          const IconComponent = iconMap[obligation.Icon.name];
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '1px' }}>
              {IconComponent ? <IconComponent color={obligation.type === 'start' ? 'green' : 'red'} size={40/(events_length**(1/2))} /> : null}
            </div>
          );
        }
       )
       }
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewObligation({ ...newObligation, [name]: value });
  };

  const handleIconChange = (selectedOption) => {
    setNewObligation({ ...newObligation, icon: selectedOption.value });
  };

  const handleAddObligation = async () => {
    try {
      const response = await fetch(`${backendUrl}/obligations`, {
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
      {data.icon}
      <span style={{ marginLeft: 10 }}>{data.label}</span>
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center' }}>
        {data.icon}
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
            <Obligation key={index} obligation={obligation} />
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
          className="react-select-container"
          classNamePrefix="react-select"
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