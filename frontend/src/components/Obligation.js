import React from 'react';

function Obligation({ obligation }) {
  return (
    <div>
      <p>{obligation.name}</p>
      <img src={obligation.icon} alt={obligation.name} />
      <p>Fecha de facturacion: {obligation.startingDate}</p>
      <p>Fecha de vencimiento: {obligation.dueDate}</p>
    </div>
  );
}

export default Obligation;