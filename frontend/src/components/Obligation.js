import React from 'react';

function Obligation({ obligation }) {
  return (
    <div>
      <p>{obligation.name}</p>
      <img src={obligation.icon} alt={obligation.name} style={{ width: '20px', height: '20px' }} />
      <p>Fecha de facturación: {obligation.startingDate}</p>
      <p>Fecha de vencimiento: {obligation.dueDate}</p>
    </div>
  );
}

export default Obligation;