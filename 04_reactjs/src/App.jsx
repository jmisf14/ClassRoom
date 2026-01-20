import React from 'react'
import { useState, useEffect } from 'react';

const App = () => {
  const [carList, setCarList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/cars')
      .then(response => response.json())
      .then(data => setCarList(data))
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  return (
    <div> 
      <h1>Welcome to the Car Store</h1>

      <ul> 
        {carList.map(car => (
            <li key={car.id}>
            <Car car={car} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
