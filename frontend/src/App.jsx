import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [superheroes, setSuperheroes] = useState([]);

  useEffect(() => {
    fetch('/api/superheroes')
      .then((response) => response.json())
      .then((data) => setSuperheroes(data))
      .catch((error) => console.error('Error fetching superheroes:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Superheroes</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Intelligence</th>
              <th>Strength</th>
              <th>Speed</th>
              <th>Durability</th>
              <th>Power</th>
              <th>Combat</th>
            </tr>
          </thead>
          <tbody>
            {superheroes.map((hero) => (
              <tr key={hero.id}>
                <td>{hero.id}</td>
                <td>{hero.name}</td>
                <td><img src={hero.image} alt={hero.name} width="50" /></td>
                <td>{hero.powerstats.intelligence}</td>
                <td>{hero.powerstats.strength}</td>
                <td>{hero.powerstats.speed}</td>
                <td>{hero.powerstats.durability}</td>
                <td>{hero.powerstats.power}</td>
                <td>{hero.powerstats.combat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
