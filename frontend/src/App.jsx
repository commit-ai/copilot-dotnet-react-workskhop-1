import React, { useEffect, useState } from 'react';
import './App.css';

function HeroImage({ src, alt, className, width }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`hero-image-fallback ${className || ''}`}
        style={width ? { width, height: width } : undefined}
        aria-label={`${alt} image unavailable`}
      >
        {alt.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={width ? { width, height: width } : undefined}
      onError={() => setHasError(true)}
    />
  );
}

function App() {
  const [superheroes, setSuperheroes] = useState([]);
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [currentView, setCurrentView] = useState('table');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetch('/api/superheroes')
      .then((response) => response.json())
      .then((data) => {
        setSuperheroes(data);
        setLoadError('');
      })
      .catch(() => setLoadError('Unable to load superheroes right now.'));
  }, []);

  const isHeroSelected = (heroId) => selectedHeroes.some((hero) => hero.id === heroId);
  const getWinnerClass = (hero1Value, hero2Value) => {
    if (hero1Value > hero2Value) {
      return 'hero1';
    }

    if (hero2Value > hero1Value) {
      return 'hero2';
    }

    return 'tie';
  };

  const handleHeroSelection = (hero) => {
    setSelectedHeroes((previous) => {
      if (previous.some((selectedHero) => selectedHero.id === hero.id)) {
        return previous.filter((selectedHero) => selectedHero.id !== hero.id);
      }

      if (previous.length < 2) {
        return [...previous, hero];
      }

      return [previous[1], hero];
    });
  };

  const calculateWinner = (hero1, hero2) => {
    const stats = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
    let hero1Wins = 0;
    let hero2Wins = 0;

    stats.forEach((stat) => {
      if (hero1.powerstats[stat] > hero2.powerstats[stat]) {
        hero1Wins += 1;
      } else if (hero2.powerstats[stat] > hero1.powerstats[stat]) {
        hero2Wins += 1;
      }
    });

    if (hero1Wins > hero2Wins) {
      return { winner: hero1, score: `${hero1Wins}-${hero2Wins}` };
    }

    if (hero2Wins > hero1Wins) {
      return { winner: hero2, score: `${hero2Wins}-${hero1Wins}` };
    }

    return { winner: null, score: `${hero1Wins}-${hero2Wins}` };
  };

  const handleCompare = () => {
    if (selectedHeroes.length === 2) {
      setCurrentView('comparison');
    }
  };

  const handleBackToTable = () => {
    setCurrentView('table');
    setSelectedHeroes([]);
  };

  const renderComparison = () => {
    if (selectedHeroes.length !== 2) {
      return null;
    }

    const [hero1, hero2] = selectedHeroes;
    const result = calculateWinner(hero1, hero2);
    const stats = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];

    return (
      <div className="comparison-view">
        <button className="back-button" onClick={handleBackToTable}>
          ← Back to Heroes Table
        </button>
        <h1>Superhero Comparison</h1>

        <div className="comparison-container">
          <div className="hero-card">
            <HeroImage src={hero1.image} alt={hero1.name} className="hero-image" />
            <h2>{hero1.name}</h2>
          </div>
          <div className="vs-section">VS</div>
          <div className="hero-card">
            <HeroImage src={hero2.image} alt={hero2.name} className="hero-image" />
            <h2>{hero2.name}</h2>
          </div>
        </div>

        <div className="stats-comparison">
          {stats.map((stat) => {
            const hero1Value = hero1.powerstats[stat];
            const hero2Value = hero2.powerstats[stat];
            const winnerClass = getWinnerClass(hero1Value, hero2Value);

            return (
              <div key={stat} className="stat-row">
                <div className={`stat-value ${winnerClass === 'hero1' ? 'winner' : ''}`}>{hero1Value}</div>
                <div className="stat-name">{stat}</div>
                <div className={`stat-value ${winnerClass === 'hero2' ? 'winner' : ''}`}>{hero2Value}</div>
              </div>
            );
          })}
        </div>

        <div className="final-result">
          <h2>Final Result</h2>
          {result.winner ? (
            <>
              <h3>🏆 {result.winner.name} Wins!</h3>
              <p>Score: {result.score}</p>
            </>
          ) : (
            <>
              <h3>🤝 It's a Tie!</h3>
              <p>Score: {result.score}</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        {currentView === 'table' ? (
          <div className="table-view">
            <h1>Superheroes</h1>
            <div className="selection-info">
              <p>Select 2 superheroes to compare ({selectedHeroes.length}/2 selected)</p>
              {selectedHeroes.length > 0 && (
                <div className="selected-heroes">
                  Selected: {selectedHeroes.map((hero) => hero.name).join(', ')}
                </div>
              )}
              <button className="compare-button" onClick={handleCompare} disabled={selectedHeroes.length !== 2}>
                Compare Heroes
              </button>
            </div>
            {loadError && <p>{loadError}</p>}
            <table>
              <thead>
                <tr>
                  <th>Select</th>
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
                  <tr key={hero.id} className={isHeroSelected(hero.id) ? 'selected-row' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isHeroSelected(hero.id)}
                        onChange={() => handleHeroSelection(hero)}
                      />
                    </td>
                    <td>{hero.id}</td>
                    <td>{hero.name}</td>
                    <td>
                      <HeroImage src={hero.image} alt={hero.name} className="table-hero-image" width="56" />
                    </td>
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
          </div>
        ) : renderComparison()}
      </header>
    </div>
  );
}

export default App;
