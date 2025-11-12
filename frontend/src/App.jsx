// src/App.jsx

import React, { useState } from 'react';
import MapViewer from './components/MapViewer';
import FlightList from './components/FlightList';

function App() {
  const [selectedFlight, setSelectedFlight] = useState(null);
  // 1. Crie um estado para guardar a instância do mapa
  const [mapInstance, setMapInstance] = useState(null);

  // 2. Modifique o 'handleFlightSelect'
  const handleFlightSelect = (flight) => {
    // 2a. Diga ao React qual polígono desenhar
    setSelectedFlight(flight);

    // 2b. Comande o mapa para se mover (se ele existir)
    if (mapInstance) {
      // Parseamos a lógica aqui no "controlador"
      const parsedPolygon = JSON.parse(flight.polygonJson);
      const polygonBounds = parsedPolygon.map(p => [p.lat, p.lng]);
      
      // Comando imperativo: "Mapa, mova-se para cá!"
      mapInstance.fitBounds(polygonBounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gerenciador de Voos ROWER</h1>
      </header>

      <main className="app-main">
        <div className="list-panel">
          <FlightList 
            onFlightSelect={handleFlightSelect} 
          />
        </div>

        <div className="map-panel">
          <MapViewer 
            selectedFlight={selectedFlight}
            // 3. Passe a função 'setMapInstance' para o MapViewer
            onMapReady={setMapInstance} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;