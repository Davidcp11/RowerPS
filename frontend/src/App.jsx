// src/App.jsx

import React, { useState } from 'react';
import MapViewer from './components/MapViewer';
import Sidebar from './components/Sidebar'; // 1. IMPORTE O NOVO SIDEBAR

function App() {
  
  // --- 2. ESTADOS QUE SÃO REALMENTE GLOBAIS ---
  // (Porque o Sidebar e o MapViewer precisam deles)
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [newPolygonPoints, setNewPolygonPoints] = useState([]);
  const [clearPolygonKey, setClearPolygonKey] = useState(Date.now());

  // --- 3. LÓGICA DE DADOS REMOVIDA (foi para o Sidebar) ---
  // O 'flights', 'loading', 'error', 'filters', 'modalData'
  // E as funções 'fetchFlights', 'handleFilterChange', etc.
  // ... TUDO FOI REMOVIDO! ...

  // --- 4. HANDLERS GLOBAIS ---
  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    if (mapInstance) {
      const parsedPolygon = JSON.parse(flight.polygonJson);
      const polygonBounds = parsedPolygon.map(p => [p.lat, p.lng]);
      mapInstance.fitBounds(polygonBounds, { padding: [50, 50] });
    }
  };

  const handlePolygonDrawn = (coordinates) => {
    setNewPolygonPoints(coordinates);
  };
  
  const handleClearPolygon = () => {
    setNewPolygonPoints([]);
    setClearPolygonKey(Date.now());
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/logo-rower.png" alt="Rower Logo" className="header-logo" />
        <h1>Gerenciador de Voos ROWER</h1>
      </header>

      <main className="app-main">
        {/* 5. RENDERIZE O SIDEBAR */}
        <Sidebar 
          onFlightSelect={handleFlightSelect}
          newPolygonPoints={newPolygonPoints}
          onClearPolygon={handleClearPolygon}
        />

        {/* 6. O MAPA (sem alteração) */}
        <div className="map-panel">
          <MapViewer 
            selectedFlight={selectedFlight}
            onMapReady={setMapInstance}
            onPolygonDrawn={handlePolygonDrawn}
            clearPolygonKey={clearPolygonKey} 
          />
        </div>
      </main>

      {/* O MODAL FOI REMOVIDO DAQUI (está no Sidebar) */}
    </div>
  );
}

export default App;