import React from 'react';
import './App.css';
import Calendar from './components/Calendar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Calendario Colombiano</h1>
        <Calendar />
      </header>
    </div>
  );
}

export default App;