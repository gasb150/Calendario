import React from 'react';

function Obligation({ obligation }) {
  return (
    <div>
      <p>{obligation.title}</p>
      <img src={obligation.iconStart} alt={`${obligation.title} (Inicio)`} style={{ width: '20px', height: '20px' }} />
      <img src={obligation.iconEnd} alt={`${obligation.title} (Fin)`} style={{ width: '20px', height: '20px' }} />
      <p>Fecha de inicio: {obligation.start.toDateString()}</p>
      <p>Fecha de fin: {obligation.end.toDateString()}</p>
    </div>
  );
}

export default Obligation;