import React from 'react';

function Obligation({ obligation }) {
  return (
    <div>
      <p>{obligation.name}</p>
      <img src={obligation.iconStart} alt={`${obligation.name} (Inicio)`} style={{ width: '20px', height: '20px' }} />
      <img src={obligation.iconEnd} alt={`${obligation.name} (Fin)`} style={{ width: '20px', height: '20px' }} />
      <p>Fecha de inicio: {new Date(obligation.starting_date).toDateString()}</p>
      <p>Fecha de fin: {new Date(obligation.due_date).toDateString()}</p>
    </div>
  );
}

export default Obligation;