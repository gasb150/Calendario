import React, { useEffect, useState } from 'react';
import Calendar from './components/Calendar';
import axios from 'axios';

function App() {
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/calendar')
      .then(response => {
        setCalendar(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the calendar!', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Calendario Colombiano</h1>
      <Calendar calendar={calendar} />
    </div>
  );
}

export default App;