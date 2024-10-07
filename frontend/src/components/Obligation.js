import React, { useState, useEffect } from 'react';
import { FaBeer, FaCoffee, FaApple } from 'react-icons/fa';

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

function Obligation({ obligation }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 'clamp(10px, 2vw, 16px)' }}>
      <p>{obligation.Name}: </p>
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

function useObligations(backendUrl) {
  const [obligations, setObligations] = useState([]);
  const [newObligation, setNewObligation] = useState({
    name: '',
    starting_date: '',
    due_date: '',
    icon: iconList[0].value
  });

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
        const mappedObligation = {
          ...addedObligation,
          Icon: iconMap[addedObligation.Icon] || addedObligation.Icon
        };
        setObligations([...obligations, mappedObligation]);
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

  return {
    obligations,
    newObligation,
    handleInputChange,
    handleIconChange,
    handleAddObligation,
    iconList,
    iconMap
  };
}

export { Obligation, useObligations, iconList, iconMap };