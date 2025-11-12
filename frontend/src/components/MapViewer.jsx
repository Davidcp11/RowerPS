// src/components/MapViewer.jsx

import React from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon
  // 1. Não precisamos mais do 'useMap' nem do 'ChangeView'
} from 'react-leaflet';

// 2. Receba 'selectedFlight' e a nova 'onMapReady'
function MapViewer({ selectedFlight, onMapReady }) {
  const defaultPosition = [-14.235, -51.925];
  
  let polygonCoords = null;

  // 3. Lógica simples de polígono (como era antes)
  if (selectedFlight) {
    const parsedPolygon = JSON.parse(selectedFlight.polygonJson);
    polygonCoords = parsedPolygon.map(p => [p.lat, p.lng]);
  }

  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={4} 
      style={{ height: '100%', width: '100%' }}
      zoomSnap={0.1}
      zoomDelta={0.25}
      // 4. Use a prop 'ref' para enviar a instância do mapa para o App.jsx
      ref={onMapReady}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* 5. Lógica de renderização simples */}
      {!selectedFlight ? (
        <Marker position={defaultPosition}>
          <Popup>Centro do Brasil</Popup>
        </Marker>
      ) : (
        <Polygon 
          pathOptions={{ color: '#016C72' }}
          positions={polygonCoords} 
        />
      )}
    </MapContainer>
  );
}

export default MapViewer;