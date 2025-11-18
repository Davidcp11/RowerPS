import { useState } from 'react';
import MapViewer from './components/MapViewer';
import Sidebar from './components/Sidebar';

export default function App() {
  
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [newPolygonPoints, setNewPolygonPoints] = useState([]);
  const [clearPolygonKey, setClearPolygonKey] = useState(Date.now());
  
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
        <Sidebar 
          onFlightSelect={handleFlightSelect}
          newPolygonPoints={newPolygonPoints}
          onClearPolygon={handleClearPolygon}
        />

        <div className="map-panel">
          <MapViewer 
            selectedFlight={selectedFlight}
            onMapReady={setMapInstance}
            onPolygonDrawn={handlePolygonDrawn}
            clearPolygonKey={clearPolygonKey} 
          />
        </div>
      </main>
    </div>
  );
};
