import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Select from 'react-select';
import { Obligation, useObligations, iconList, iconMap } from './Obligation';
import useHolidays from './Holidays/Holidays';
import '../App.css'; // Asegúrate de importar el archivo CSS

const localizer = momentLocalizer(moment);

const CustomCalendar = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const {
    obligations,
    newObligation,
    handleInputChange,
    handleIconChange,
    handleAddObligation
  } = useObligations(backendUrl);

  const { holidays } = useHolidays(backendUrl);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Añadir días festivos como eventos
  const holidayEvents = holidays.map(holiday => ({
    title: holiday.HolidayName,
    start: new Date(holiday.Date),
    end: new Date(holiday.Date),
    allDay: true,
    holiday: true
  }));

  console.log(holidays)

  const allEvents = [...events, ...holidayEvents];

  const generatePDF = () => {
    setShowToolbar(false); // Ocultar la barra de herramientas

    setTimeout(() => {
      const calendarElement = document.querySelector('.rbc-calendar');
      const dictionaryElement = document.querySelector('.symbol-dictionary');

      Promise.all([
        html2canvas(calendarElement),
        html2canvas(dictionaryElement)
      ]).then(canvases => {
        const calendarCanvas = canvases[0];
        const dictionaryCanvas = canvases[1];

        const calendarImgData = calendarCanvas.toDataURL('image/png');
        const dictionaryImgData = dictionaryCanvas.toDataURL('image/png');

        const doc = new jsPDF('landscape', 'pt', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 60; // Margen de 30 puntos a cada lado
        const totalHeight = calendarCanvas.height + dictionaryCanvas.height;
        const scaleFactor = (pageHeight - 60) / totalHeight; // Ajustar para que quepa en una sola página

        const calendarImgHeight = calendarCanvas.height * scaleFactor;
        const dictionaryImgHeight = dictionaryCanvas.height * scaleFactor;

        const monthTitle = moment(currentDate).format('MMMM YYYY');

        doc.text(`Calendario de Obligaciones - ${monthTitle}`, 15, 15);
        doc.addImage(calendarImgData, 'PNG', 15, 30, imgWidth, calendarImgHeight);
        doc.addImage(dictionaryImgData, 'PNG', 15, 40 + calendarImgHeight, imgWidth, dictionaryImgHeight);

        doc.save('calendario.pdf');

        setShowToolbar(true); // Mostrar la barra de herramientas nuevamente
      });
    }, 1000); // Esperar un segundo para asegurarse de que la barra de herramientas esté oculta
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

  const dayPropGetter = (date) => {
    const isHoliday = holidays.some(holiday => new Date(holiday.Date).toDateString() === date.toDateString());
    if (isHoliday) {
      return {
        className: 'holiday-day'
      };
    }
    return {};
  };

  const EventComponent = ({ event }) => {
    const events_length = event.obligations.length;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        {event.obligations.map((obligation, index) => {
          const IconComponent = iconMap[obligation.Icon.name];
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '1px' }}>
              {IconComponent ? <IconComponent color={obligation.type === 'start' ? 'green' : 'red'} size={40 / (events_length ** (1 / 2))} /> : null}
            </div>
          );
        })}
      </div>
    );
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      const mDate = moment(toolbar.date);
      const newDate = mDate.subtract(1, 'month').toDate();
      setCurrentDate(newDate);
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      const mDate = moment(toolbar.date);
      const newDate = mDate.add(1, 'month').toDate();
      setCurrentDate(newDate);
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      const now = new Date();
      setCurrentDate(now);
      toolbar.onNavigate('TODAY');
    };

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span>{date.format('MMMM YYYY')}</span>
      );
    };

    const setView = (view) => {
      toolbar.onView(view);
    };

    return (
      <div className="toolbar-container">
        <button onClick={goToBack}>Back</button>
        <button onClick={goToCurrent}>Today</button>
        <button onClick={goToNext}>Next</button>
        <button onClick={() => setView('month')}>Month</button>
        <button onClick={() => setView('week')}>Week</button>
        <button onClick={() => setView('day')}>Day</button>
        <div className="label">{label()}</div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        components={{
          event: EventComponent,
          toolbar: showToolbar ? CustomToolbar : () => <div /> // Condicionalmente mostrar la barra de herramientas
        }}
      />

      <div className="symbol-dictionary">
        <h3>Diccionario de Símbolos</h3>
        {obligations.length === 0 ? (
          <p>No hay obligaciones</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {obligations.map((obligation, index) => (
                  <th key={index} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(10px, 2vw, 20px)' }}>
                      {iconMap[obligation.Icon.name] ? React.createElement(iconMap[obligation.Icon.name], { size: '2em' }) : null}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {obligations.map((obligation, index) => (
                  <td key={index} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(10px, 2vw, 16px)' }}>
                      {obligation.Name}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <button onClick={generatePDF}>Generar PDF</button>

      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? 'Ocultar Formulario' : 'Añadir Obligación'}
      </button>

      {isFormVisible && (
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
            components={{ SingleValue: ({ data }) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {data.icon}
                <span style={{ marginLeft: 10 }}>{data.label}</span>
              </div>
            ), Option: (props) => {
              const { data, innerRef, innerProps } = props;
              return (
                <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center' }}>
                  {data.icon}
                  <span style={{ marginLeft: 10 }}>{data.label}</span>
                </div>
              );
            }}}
          />
          <button onClick={handleAddObligation}>Añadir Obligación</button>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;