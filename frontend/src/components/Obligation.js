import React from 'react';

function Obligation({ obligation }) {
  return (
    <div>
      <p>{obligation.Name}</p>
      {typeof obligation.Icon === 'string' ? (
        obligation.Icon.startsWith('http') ? (
          <img src={obligation.Icon} alt="icon" style={{ width: 20, height: 20 }} />
        ) : (
          obligation.Icon
        )
      ) : (
        <obligation.Icon />
      )}
    </div>
  );
}

export default Obligation;