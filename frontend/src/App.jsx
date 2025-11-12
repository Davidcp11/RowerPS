// src/App.jsx

import React, { useState } from 'react';
import MapViewer from './components/MapViewer';
import FlightList from './components/FlightList';

function App() {

  const [selectedFlight, setSelectedFlight] = useState(null)

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gerenciador de Voos ROWER</h1>
      </header>

      <main className="app-main">
        <div className="list-panel">
          {/* <h2>Voos Agendados</h2> */}
          <FlightList 
            onFlightSelect={handleFlightSelect}
          />
        </div>

        <div className="map-panel">
          {/* <h2>Mapa de Operações</h2> */}
          <MapViewer
            selectedFlight={selectedFlight}
          />
        </div>
      </main>
    </div>
  );
}

export default App;